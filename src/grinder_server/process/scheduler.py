import asyncio
import aiosqlite
import json
import re

async def update_db_status(db_path: str, job_id: str, new_status: str, failure_reason: str = None):
    """Updates the internal SQLite tracking state."""
    async with aiosqlite.connect(db_path) as db:
        if failure_reason:
            await db.execute(
                "UPDATE jobs SET status = ?, failure_reason = ? WHERE job_id = ?",
                (new_status, failure_reason, job_id)
            )
        else:
            await db.execute(
                "UPDATE jobs SET status = ? WHERE job_id = ?",
                (new_status, job_id)
            )
        await db.commit()

import asyncio
import subprocess

# Map SLURM native states to your internal pipeline state machine
SLURM_STATE_MAP = {
    "PENDING": "RUNNING",       # Pipeline treats queued as 'RUNNING/active'
    "RUNNING": "RUNNING",
    "COMPLETING": "RUNNING",
    "COMPLETED": "COMPLETED",
    "FAILED": "FAILED",
    "CANCELLED": "FAILED",
    "TIMEOUT": "FAILED",
    "OUT_OF_MEMORY": "FAILED",
    "NODE_FAIL": "FAILED",
}

async def update_job_status(db_path: str, job_id: str, slurm_job_id: str):
    """
    Queries SLURM for the current state of a job, maps it to the 
    internal status schema, and updates the tracking database.
    """
    try:
        # Run 'sacct' non-blockingly. 
        # -j specifies job ID, -n removes headers, -P makes it pipe-delimited
        # State: Native SLURM state, ExitCode: Application return code
        proc = await asyncio.create_subprocess_exec(
            'sacct', '-j', slurm_job_id, '--format=State,ExitCode', '-n', '-P',
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()

        if proc.returncode != 0:
            print(f"Error querying sacct for Slurm ID {slurm_job_id}: {stderr.decode()}")
            return

        output = stdout.decode().strip()
        if not output:
            # If sacct returns nothing, the job might be brand new and not in accounting yet
            return

        # sacct often returns multiple lines (one for job, one for job steps like batch/extern)
        # We only care about the main job descriptor, which is usually the first line
        first_line = output.split('\n')[0]
        slurm_state, exit_code = first_line.split('|')

        # Clean up appended sub-states (e.g., "CANCELLED+ by 1001" -> "CANCELLED")
        slurm_state = slurm_state.split(' ')[0].strip()

        # Resolve internal status
        internal_status = SLURM_STATE_MAP.get(slurm_state, "FAILED")

        # Extract diagnostics if it failed
        failure_reason = None
        if internal_status == "FAILED":
            if slurm_state == "TIMEOUT":
                failure_reason = "SLURM_TIMEOUT: Job exceeded requested walltime limit."
            elif slurm_state == "OUT_OF_MEMORY":
                failure_reason = "SLURM_OOM: Job killed by the cluster Out-Of-Memory manager."
            else:
                failure_reason = f"SLURM_FAILURE: Job state [{slurm_state}] with ExitCode [{exit_code}]."

        # Update the database
        await update_db_status(db_path, job_id, internal_status, failure_reason)
        print(f"[Sync] Pipeline Job {job_id} (Slurm: {slurm_job_id}) updated to {internal_status}")

    except Exception as e:
        print(f"Failed to execute update_job_status for job {job_id}: {str(e)}")

async def global_slurm_status_poller(db_path: str, interval_seconds: int = 45):
    """
    A single infinite background loop that updates all active jobs 
    in bulk to minimize cluster scheduler overhead.
    """
    while True:
        try:
            # 1. Fetch all jobs currently marked 'RUNNING' in your local DB
            async with aiosqlite.connect(db_path) as db:
                async with db.execute("SELECT job_id, slurm_job_id FROM jobs WHERE status='RUNNING'") as cursor:
                    active_jobs = await cursor.fetchall()

            if active_jobs:
                # Group all SLURM IDs into a comma-separated string (e.g. "12345,12346,12347")
                slurm_ids = [job[1] for job in active_jobs if job[1]]
                id_query_str = ",".join(slurm_ids)

                # Query all of them at once
                proc = await asyncio.create_subprocess_exec(
                    'sacct', '-j', id_query_str, '--format=JobID,State,ExitCode', '-n', '-P',
                    stdout=asyncio.subprocess.PIPE
                )
                stdout, _ = await proc.communicate()
                
                # Parse output lines and build a lookup map
                slurm_results = {}
                for line in stdout.decode().strip().split('\n'):
                    if not line: continue
                    s_id, s_state, e_code = line.split('|')
                    # Keep only the primary job ID state (ignore steps like 12345.batch)
                    if "." not in s_id and "_" not in s_id: 
                        slurm_results[s_id] = (s_state.split(' ')[0], e_code)

                # 2. Iterate and update local database states
                for job_id, slurm_id in active_jobs:
                    if slurm_id in slurm_results:
                        s_state, e_code = slurm_results[slurm_id]
                        internal_status = SLURM_STATE_MAP.get(s_state, "RUNNING")
                        
                        if internal_status != "RUNNING": # State changed!
                            reason = f"Crashed with {s_state}" if internal_status == "FAILED" else None
                            await update_db_status(db_path, job_id, internal_status, reason)

        except Exception as e:
            print(f"Error in global cluster poller loop: {e}")

        # Non-blocking pause before checking the cluster again
        await asyncio.sleep(interval_seconds)

import asyncio

async def check_slurm_status(slurm_job_id: str) -> str:
    """
    Checks the real-time status of a SLURM job.
    Returns standard SLURM states: 'RUNNING', 'PENDING', 'COMPLETED', 'FAILED', etc.
    """
    # Step 1: Fast check using squeue (queries memory for active jobs)
    # --jobs filters by ID, -o "%T" requests only the State in compact text
    try:
        proc_q = await asyncio.create_subprocess_exec(
            'squeue', '--jobs', slurm_job_id, '-o', '%T', '-h',
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout_q, stderr_q = await proc_q.communicate()
        
        if proc_q.returncode == 0 and stdout_q:
            state = stdout_q.decode().strip()
            if state in ["RUNNING", "PENDING", "COMPLETING", "CONFIGURING"]:
                # Normalise COMPLETING/CONFIGURING states to RUNNING for simplicity
                return "RUNNING" if state != "PENDING" else "PENDING"

    except Exception as e:
        print(f"[Warning] Failed to run squeue: {e}")

    # Step 2: Fallback to sacct (queries accounting database for finished jobs)
    # If it wasn't in squeue, it either completed, failed, or was cancelled.
    try:
        proc_a = await asyncio.create_subprocess_exec(
            'sacct', '-j', slurm_job_id, '--format=State', '-n', '-P',
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout_a, _ = await proc_a.communicate()
        
        output = stdout_a.decode().strip()
        if output:
            # Grab the main job state (first line, stripping sub-states like CANCELLED+ by 1001)
            raw_state = output.split('\n')[0].split(' ')[0].strip()
            
            # Map common variants cleanly
            if raw_state in ["COMPLETED", "FAILED", "TIMEOUT", "OUT_OF_MEMORY", "CANCELLED"]:
                return raw_state
                
    except Exception as e:
        print(f"[Error] Failed to run sacct: {e}")

    # If neither squeue nor sacct can find it, the ID might be invalid or purged
    return "UNKNOWN"

import asyncio
import os

async def handle_failed_job(db_path: str, job_id: str, slurm_job_id: str, step_name: str, paths: dict):
    """
    Handles a failed SLURM job by gathering cluster forensics, scraping application logs,
    updating the tracking database, and isolating the failure from the rest of the streaming pipeline.
    
    :param db_path: Path to the SQLite tracking database.
    :param job_id: Internal pipeline tracking ID.
    :param slurm_job_id: The ID generated by the cluster scheduler.
    :param step_name: Name of the failed task (e.g., 'motioncorr2', 'ctffind').
    :param paths: A dict containing 'stdout' and 'stderr' log file paths for this job.
    """
    print(f"[Failure Handler] Triage started for Job {job_id} (Slurm ID: {slurm_job_id}) at step '{step_name}'")
    
    # 1. Gather Cluster-Level Diagnostics
    cluster_reason = "UNKNOWN_CLUSTER_ERROR"
    try:
        proc = await asyncio.create_subprocess_exec(
            'sacct', '-j', slurm_job_id, '--format=State,ExitCode', '-n', '-P',
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, _ = await proc.communicate()
        output = stdout.decode().strip()
        
        if output:
            slurm_state, exit_code = output.split('\n')[0].split('|')
            slurm_state = slurm_state.split(' ')[0].strip() # Strip sub-states like CANCELLED+
            
            if slurm_state == 'TIMEOUT':
                cluster_reason = "TIMEOUT: Job exceeded cluster walltime allocation limit."
            elif slurm_state == 'OUT_OF_MEMORY':
                cluster_reason = "OOM: Job killed by cluster Out-Of-Memory manager."
            elif slurm_state == 'NODE_FAIL':
                cluster_reason = "NODE_FAILURE: The physical HPC node computing this job crashed."
            else:
                cluster_reason = f"CLI_EXIT_{exit_code}: Program exited with an error on the cluster."
    except Exception as e:
        cluster_reason = f"METADATA_FETCH_FAILED: Could not query sacct ({str(e)})"

    # 2. Extract Application-Level Error (Log Scraping)
    # If it's a software/scientific issue, the specific reason is hidden inside the logs
    app_reason = "No specific error signature found in logs."
    stdout_path = paths.get('stdout')
    stderr_path = paths.get('stderr')
    
    try:
        # Give filesystem a second to flush logs from computing node to shared storage
        await asyncio.sleep(1.0) 
        
        if stderr_path and os.path.exists(stderr_path):
            with open(stderr_path, 'r') as f:
                # Read the last few lines where crashes usually dump their backtrace
                lines = f.readlines()[-20:] 
                stderr_content = "".join(lines)
                
                if "cudaErrorMemoryAllocation" in stderr_content or "out of memory" in stderr_content.lower():
                    app_reason = "GPU_OOM: MotionCor2 or RELION exhausted GPU VRAM. Reduce patches/parallelism."
                elif "CUDA error" in stderr_content:
                    app_reason = "CUDA_DRIVER_ERROR: Incompatible CUDA runtime or GPU hardware failure."
                elif "Segmentation fault" in stderr_content:
                    app_reason = "SEGFAULT: Core dumped. Likely a malformed file or software bug."

        if app_reason == "No specific error signature found in logs." and stdout_path and os.path.exists(stdout_path):
            with open(stdout_path, 'r') as f:
                stdout_content = f.read()
                if "Cannot open file" in stdout_content:
                    app_reason = "I/O_ERROR: RELION/CTFFIND could not read an input file. Check permissions/paths."
                elif "ERROR:" in stdout_content:
                    # Snatch the explicit error line
                    error_line = [line for line in stdout_content.split('\n') if "ERROR:" in line]
                    if error_line: app_reason = f"APPLICATION_ERROR: {error_line[0].strip()}"
    except Exception as e:
        app_reason = f"LOG_PARSING_FAILED: Logs were unreachable ({str(e)})"

    # 3. Combine Forensics into a Final Diagnostic Statement
    final_failure_log = f"[{cluster_reason}] Summary: {app_reason}"
    print(f"[Failure Handler] Diagnosed Job {job_id}: {final_failure_log}")

    # 4. Commit to DB and Halt Downstream Branch
    # Flipping status to 'FAILED' ensures that when downstream steps look for inputs, 
    # they skip this specific micrograph entirely.
    try:
        await update_db_status(db_path, job_id, "FAILED", failure_reason=final_failure_log)
    except Exception as e:
        print(f"[Critical] Failed to write failure status to DB for job {job_id}: {e}")

    # 5. Pipeline Alert (Slack/Webhook/Email hook goes here)
    # e.g., await send_slack_alert(f"Job {job_id} failed on step {step_name}: {final_failure_log}")
    
    return final_failure_log


async def start_pipeline_engine():
    db_path = "pipeline_state.db"
    
    # Fire and forget the status sync loop
    asyncio.create_task(global_slurm_status_poller(db_path, interval_seconds=30))
    
    # Continue setting up your streaming queues and data consumers...


async def recover_pipeline(db_path):
    async with aiosqlite.connect(db_path) as db:
        # 1. Find all jobs that were "RUNNING" when the backend died
        async with db.execute("SELECT job_id, slurm_job_id, step_name FROM jobs WHERE status='RUNNING'") as cursor:
            running_jobs = await cursor.fetchall()
            
        for job_id, slurm_id, step in running_jobs:
            if slurm_id:
                # 2. Check if the job is still alive on the cluster
                status = await check_slurm_status(slurm_id)
                if status == 'COMPLETED':
                    await update_job_status(db, job_id, 'COMPLETED')
                    # Trigger next step in DAG...
                elif status in ['FAILED', 'CANCELLED', 'TIMEOUT']:
                    await handle_failed_job(db, job_id, slurm_id, step)
                else:
                    # It's still running on the cluster! Re-attach the polling coroutine
                    asyncio.create_task(wait_for_slurm_job(job_id, slurm_id))
            else:
                # Marked running but no Slurm ID? It died during submission. Reset it.
                await update_job_status(db, job_id, 'PENDING')

async def analyze_slurm_failure(slurm_job_id: str):
    # Query sacct for both State and ExitCode
    proc = await asyncio.create_subprocess_exec(
        'sacct', '-j', slurm_job_id, '--format=State,ExitCode,DerivedExitCode', '-n', '-P',
        stdout=asyncio.subprocess.PIPE
    )
    stdout, _ = await proc.communicate()
    lines = stdout.decode().strip().split('\n')
    
    # Example output line: "FAILED|1:0" (Exit code 1, no signal)
    # Example out line:   "TIMEOUT|0:15" (Signaled by SIGTERM due to timeout)
    state, exit_code = lines[0].split('|')[:2]
    
    if state == 'TIMEOUT':
        return "TIMEOUT", "Job exceeded walltime limit. Needs higher allocation."
    elif state == 'OUT_OF_MEMORY':
        return "OOM", "Job killed by OOM Killer. Increase memory requested (--mem)."
    
    return "UNKNOWN_FAILURE", f"Slurm State: {state}, ExitCode: {exit_code}"


async def submit_slurm_job(script_path: str) -> str:
    """Submits a job and returns the SLURM Job ID."""
    proc = await asyncio.create_subprocess_exec(
        'sbatch', script_path,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
    )
    stdout, _ = await proc.communicate()
    
    # Extract ID, e.g., "Submitted batch job 12345"
    match = re.search(r"batch job (\d+)", stdout.decode())
    if match:
        return match.group(1)
    raise RuntimeError("Failed to submit job to cluster")

async def wait_for_slurm_job(job_id: str, poll_interval: int = 60):
    """Asynchronously polls sacct until the job finishes."""
    while True:
        proc = await asyncio.create_subprocess_exec(
            'sacct', '-j', job_id, '--format=State', '-n', '-P',
            stdout=asyncio.subprocess.PIPE
        )
        stdout, _ = await proc.communicate()
        state = stdout.decode().strip().split('\n')[0] # Get state of main job
        
        if state in ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT']:
            return state
            
        # Yield control back to the event loop, letting other pipelines process
        await asyncio.sleep(poll_interval)


class PipelineManager:
    def __init__(self):
        self.tasks: List[gpi.PipelineTask] = []
        self.channels: Dict[str, gpi.DataChannel] = {}

    def create_channel(self, name: str) -> DataChannel:
        channel = DataChannel(name)
        self.channels[name] = channel
        return channel

    def add_task(self, task: PipelineTask, input_channel: DataChannel = None, output_channel: DataChannel = None):
        self.tasks.append(task)
        if input_channel:
            input_channel.consumers.append(task)
        if output_channel:
            task.output_channel = output_channel

    async def run(self, initial_channel_name: str, raw_inputs: list):
        # 1. Start all task worker loops concurrently
        task_coroutines = [task.start() for task in self.tasks]
        
        # 2. Feed initial data into the mouth of the pipeline
        initial_channel = self.channels[initial_channel_name]
        for item in raw_inputs:
            await initial_channel.put(item)
        
        # Signal that no more initial raw data is coming
        await initial_channel.put(None)

        # 3. Keep loop alive until all tasks conclude naturally
        await asyncio.gather(*task_coroutines)

# --- EXECUTION ---
async def main():
    manager = PipelineManager()

    # Define Channels
    movies = manager.create_channel("raw_movies")
    mrcs = manager.create_channel("corrected_mrcs")
    particles = manager.create_channel("particle_coordinates")

    # Define & Wire Tasks
    # 1. MotionCor reads from 'movies' and outputs to 'mrcs'
    manager.add_task(MotionCorTask("MotionCor2"), input_channel=movies, output_channel=mrcs)
    
    # 2. CTF Estimation reads from 'mrcs' (Terminal branch, no output channel)
    manager.add_task(CtfEstimationTask("CTFFIND4"), input_channel=mrcs)
    
    # 3. Particle Picking also reads from 'mrcs' in parallel, outputs to 'particles'
    manager.add_task(ParticlePickingTask("TopazPicking"), input_channel=mrcs, output_channel=particles)
    
    # 4. 2D Classification reads from 'particles'
    manager.add_task(Class2DTask("RelionClass2D", batch_size=2), input_channel=particles)

    # Simulated incoming dataset from the microscope
    microscope_stream = ["movie_001.tif", "movie_002.tif", "movie_003.tif", "movie_004.tif"]

    print("--- Starting Generic Cryo-EM Pipeline ---")
    await manager.run(initial_channel_name="raw_movies", raw_inputs=microscope_stream)
    print("--- Pipeline Processing Complete ---")

if __name__ == "__main__":
    asyncio.run(main())