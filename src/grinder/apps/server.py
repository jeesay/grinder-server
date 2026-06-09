# In src/my_app/main.py
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse, StreamingResponse
import io
import json
import numpy as np
import os
import pathlib
import polars as pl
import signal
import subprocess
import sys
import typer
from typing import Annotated
import uvicorn


import pyarrow as pa

from grinder.core.tree import build_file_tree, build_relion_tree # Clean import
import grinder.core.utils as gru
import grinder.core.graphics as grg
import grinder.core.log as glog
import grinder.core.job as gjb

import star_gate as sg

# Force Windows to use the correct event loop for subprocesses
if sys.platform == 'win32':
    # asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    print("ERROR : windows OS not supported")
    sys.exit(1)

app = FastAPI()

# Global variable
running_processes = {}

# --- 1. NEW: Redirect and Welcome Message ---

@app.get("/config")
async def config_redirect():
    """Redirects the user from /config to the welcome page."""
    return RedirectResponse(url="/welcome")

@app.websocket("/welcome")
async def welcome_message(websocket: WebSocket):
    """The landing page for the redirect."""
    await websocket.accept()
    try:
        while True:
            # Required for websocket completion
            dummy = await websocket.receive_text() 
            progs, projs = gru.get_environment()
            await websocket.send_json({
                "status": "success",
                "message": "Welcome to GRINDER",
                "current_dir": os.getcwd().replace(os.sep, '/'),
                "project_list": projs,
                "environment": progs
            })
    except WebSocketDisconnect:
        print("[/welcome] Client disconnected")

@app.websocket("/project")
async def project(websocket: WebSocket):
    """Upload Project"""
    await websocket.accept()
    try:
        while True:
            request = await websocket.receive_text()
            print(request)
            project_path = request
            pipeline = await gru.upload_project(project_path)
            await websocket.send_json(pipeline)
    except WebSocketDisconnect:
        print("[/project] Client disconnected")


@app.websocket("/log")
async def log_message(websocket: WebSocket):
    await websocket.accept()

    # stop_event allow to stop tail_log
    stop_event  = asyncio.Event()
    monitor_task = None

    try:
        while True:
            response = await websocket.receive_text()
            resp = json.loads(response)
            print(f"[/log] response = {resp}")
            pn = resp['projpath']
            dn = resp['dirname']
            jn = resp['jobname']
            success_file = "RELION_JOB_EXIT_SUCCESS"
            failed_file = "RELION_JOB_EXIT_FAILED"
            if os.path.isfile(os.path.join(pn,dn,jn,success_file)) or os.path.isfile(os.path.join(pn,dn,jn,failed_file)) :
                fn = "run.out"
                with open(os.path.join(pn,dn,jn,fn),'r') as f:
                    log = f.readlines()
                fn = "run.err"
                with open(os.path.join(pn,dn,jn,fn),'r') as f:
                    error = f.readlines()
                logfile = os.path.join(pn,dn,jn,fn)
                logtxt = glog.curate_log(log,error)
                status = "success" if os.path.isfile(success_file) else "failed"
                await websocket.send_json({
                    "log_type": "log_complete",
                    "content":  logtxt,
                    "status":   status
                })
                # if os.path.exists(requested_path):
                #     tree_data = build_relion_tree(requested_filter)
                #     await websocket.send_json(tree_data)
                # else:
                #     await websocket.send_json({"error": "Path not found"})
            else : 
                if resp['command'] == "start_monitoring":
                    print("log command received")
                    # Cancel previous monitoring if existing one
                    if monitor_task and not monitor_task.done():
                        stop_event.set() # flag for stop process
                        await monitor_task  # waiting for process to end clearly
                        stop_event.clear() # reinitialize for next process

                    # We launch file reading to background
                    logfile = os.path.join(pn,dn,jn,'run.out')
                    monitor_task = asyncio.create_task(glog.tail_log(websocket, logfile, stop_event))
                else:
                    await websocket.send(f"Command unknown : {resp['command']}")

    except WebSocketDisconnect:
        # Stoping monitoring on disconnection
        if monitor_task and not monitor_task.done():
            stop_event.set()
            await asyncio.wait_for(monitor_task, timeout=2.0)
        print("[/log] Client disconnected")

@app.websocket("/tmp/explore")
async def job_explore(websocket: WebSocket):
    # Private
    def iter_batches():
        # Write the dataframe to a buffer in IPC Stream format
        buf = io.BytesIO()
        df.write_ipc_stream(buf)
        yield buf.getvalue()

    await websocket.accept()
    try:
        while True:
            request = await websocket.receive_text()
            metadata = request['metadata']
            columns = request['columns']
            jobdir,jobname,_ = request['jobname'].split('/')

            # 0. Check if .grinder/{jobname} is available. If not, prepare the metadata and/or data
            # TODO
            print('TODO. run app for ',jobdir,jobname)
            # 1. Define your Lazy query
            lf = pl.scan_parquet(os.path.join('.grinder',jobname,metadata))

            # 2. Apply some selection or filtering. Here select columns
            query = lf.select(columns)

            # 3. Execute and convert to Arrow Stream
            # For large data, we collect in chunks or as a whole and stream the bytes
            df = query.collect()

            # 4. Convert to Arrow IPC Stream
            # We use a buffer to capture the binary data
            buf = io.BytesIO()
            df.write_ipc_stream(buf)
    
            # 4. Send binary data over WebSocket
            await websocket.send_bytes(buf.getvalue())

            await websocket.close()

    except WebSocketDisconnect:
        print("Client disconnected")

@app.websocket("/parquet")
async def parquet_test(websocket: WebSocket):

    def generate_df():
        num_rows = 5000
        rng = np.random.default_rng(seed=7)

        buildings_data = {
            "sqft": rng.exponential(scale=1000, size=num_rows),
            "year": rng.integers(low=1995, high=2023, size=num_rows),
            "building_type": rng.choice(["A", "B", "C"], size=num_rows),
        }
        return pl.DataFrame(buildings_data)

    await websocket.accept()
    try:
	    # 1. Create test data
        # df = generate_df()
        path_to_parquet = "/mnt/HD002/tomo/ESRF_PatAB/mx2441_Grid5/.grinder/job002/mx2441_grid5_12134_shifts.parquet"
        df = pl.read_parquet(path_to_parquet)

        # 2. Forced conversion to standard Arrow Table
        table = df.to_arrow()

        # 4. Convert to Arrow IPC Stream
        # We use a buffer to capture the binary data
        sink = io.BytesIO()
        with pa.ipc.new_stream(sink, table.schema) as writer:
            writer.write_table(table)
        # df.write_ipc(buf)
        payload = sink.getvalue()
    
        # 2. Send binary data over WebSocket
        print(f"Stream send : {len(payload)} octets")
        await websocket.send_bytes(payload)
        print("Stream sent successfully !")

        while True :
            await websocket.receive_text()

        # await websocket.close()
        
    except Exception as e :
        print(f"Error during sending : {e}")

    # finally :
    # 	await websocket.close()

@app.websocket("/job/read")
async def job_read(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            request = await websocket.receive_text()
            req = json.loads(request)
            projname = req['projpath']
            dirname = req['dirname']
            jobname = req['jobname']
            logs = await gru.get_jobfiles(projname,dirname,jobname) # (requested_filter)
            await websocket.send_json(logs)
            # if os.path.exists(requested_path):
            #     tree_data = build_relion_tree(requested_filter)
            #     await websocket.send_json(tree_data)
            # else:
            #     await websocket.send_json({"error": "Path not found"})
    except WebSocketDisconnect:
        print("[/job/read] Client disconnected")

@app.websocket("/job/data")
async def websocket_dataviz(websocket: WebSocket):
    """
    Expecting message : "{"projpath":"xxx","dirname"xxx" ","jobname":"xxx"}"
    ex : "{"projpath":".","dirname":"MotionCorr","jobname":"job002"}
    """
    await websocket.accept()
    try : 
        while True :
            request = await websocket.receive_text()
            # print(f"[/job/data] request={request}")

            if len(request) == 0:
                await websocket.send_json({"error" : f"Unknown request : {request}"})
                continue

            req = json.loads(request)

            req["request"] = json.loads(req["request"])
            req["data"] = json.loads(req["data"])

            print(f"[/job/data] request cleaned = {req}")

            job_path = os.path.join(req["request"]["projpath"], req["request"]["dirname"], req["request"]["jobname"])
            dataviz_rows = req["data"]['datablocks']['default']['dataviz']['rows']

            print('\n', "path : ", job_path, '\n', '&& dataviz rows : ', dataviz_rows)
            
            package = await grg.get_dataviz_package(job_path, dataviz_rows, "dataviz_package")

            await websocket.send_json(package)

    except WebSocketDisconnect:
        print("[/job/data] Client disconnected")


@app.websocket("/ws/micrographs")
async def ws_micrographs(websocket: WebSocket):
    """
    Expecting message : "{"projpath":"xxx","dirname"xxx" ","jobname":"xxx"}"
    ex : "{"projpath":".","dirname":"MotionCorr","jobname":"job002"}
    """
    await websocket.accept()
    try:
        while True:

            request = await websocket.receive_text()
            # print(f"[/job/data] request={request}")

            if len(request) == 0:
                await websocket.send_json({"error" : f"Unknown request : {request}"})
                continue

            req = json.loads(request)

            req["request"] = json.loads(req["request"])
            req["data"] = json.loads(req["data"])

            print(f"[/ws/micrographs] request cleaned = {req}")

            job_path = os.path.join(req["request"]["projpath"], req["request"]["dirname"], req["request"]["jobname"])
            rows = req["data"]['datablocks']['default']['micrograph']['rows']

            print('\n', "path : ", job_path, '\n', '&& rows : ', rows)
            
            package = await grg.get_dataviz_package(job_path, rows, "mics_viewer")
            await websocket.send_json(package)
                
    except WebSocketDisconnect:
        print("[/ws/micrographs] Client disconnected")

        
@app.websocket("/job/run")
async def job_run(websocket: WebSocket):
    await websocket.accept()
    # ... logic using build_file_tree(path) ...
    try:
        while True:
            request = await websocket.receive_text()
            metadata = json.loads(request)
            projname = metadata['current_project']['path']
            jobname = metadata['current_job']['jobpath']
            rlnpath = os.path.join(projname,jobname)
            # Step #0 - Create directory
            pathlib.Path(rlnpath).mkdir(parents=True, exist_ok=True)
            # Step #1 - Create `job.star`
            gjb.create_jobstar(metadata)
            # Step #2 - Create `job_pipeline.star`
            gjb.create_jobpipelinestar(metadata)
            # Step #3 - Create cli
            command = gjb.create_command(metadata)
            status = 'pending'
            # Step #4 - Run ASYNC subprocess
            if not os.path.exists(rlnpath):
                os.makedirs(rlnpath)
            log_info = os.path.join(os.getcwd(),rlnpath,'run.out')
            log_err = os.path.join(os.getcwd(),rlnpath,'run.err')    
            await gjb.run_command_io(command,projname,jobname,websocket,running_processes)   
            # This does NOT block the whole server
            # full_command = f'cd {projname} && {command} 2> {log_err} 1> {log_info}'
            # print(full_command)
            # process = subprocess.Popen(full_command, shell=True)
            # process = await gjb.run_command(full_command,projname,jobname,websocket)
            # Step #8 - Cleanup: stop the tailer and inform the client
            # await websocket.send_json({"type": "process", "status": status, "pid": process.pid, "exit_code": process.returncode})

    except WebSocketDisconnect:
        print("[/job/run] Client disconnected")

@app.websocket("/job/stop")
async def stop_job(websocket: WebSocket):
    await websocket.accept()
    # ... logic using build_file_tree(path) ...
    try:
        while True:
            data = await websocket.receive_json()
            # Something like: {"action": "stop","projname": "EMPIAR", "jobname": "Class2D/job001"}
            if data["action"] == "stop":
                process,ws = running_processes.get( (data["projname"],data["jobname"]))
                msg = "ABORTED: Job aborted by user";
                await ws.send_json({"type": "stdout","content": msg});
                if process:
                    os.killpg(
                        process.pid,
                        signal.SIGTERM
                    )
    except WebSocketDisconnect:
        print("[/job/stop] Client disconnected")

@app.websocket("/ws/file-tree")
async def websocket_file_tree(websocket: WebSocket):
    await websocket.accept()
    # ... logic using build_file_tree(path) ...
    try:
        while True:
            requested_filter = await websocket.receive_text()
            print(requested_filter)
            tree_data = await build_relion_tree() # (requested_filter)
            await websocket.send_json(tree_data)
            # if os.path.exists(requested_path):
            #     tree_data = build_relion_tree(requested_filter)
            #     await websocket.send_json(tree_data)
            # else:
            #     await websocket.send_json({"error": "Path not found"})
    except WebSocketDisconnect:
        print("Client disconnected")

# Test websocket
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")

@app.websocket("/ws/explore")
async def websocket_explore(websocket: WebSocket):
    # RELION jobs management
    RELION_DIR = os.path.abspath(".")
    await websocket.accept()
    print(f"[ws/explore] Connection : {websocket.client} | RELION_DIR={RELION_DIR}")

    try : 
        while True:
            request = await websocket.receive_text()
            print(f"[ws/explore] request={request}")

            # job_list
            if request == "job_list" :
                tree_data = await build_relion_tree()
                await websocket.send_json(tree_data)
            
            # job_params : <job_id>
            elif request.startswith("job_params:"):
                job_id = request.split(":",1)[1].strip()

                try:
                    content = _read_job_star(job_id)
                    await websocket.send_json({"job_id": job_id, "data" : content})
                except FileNotFoundError as e :
                    await websocket.send_json({"error" : str(e)})

            else :
                await websocket.send_json({"error" : f"Unknown request : {request}"})

    except WebSocketDisconnect:
        print("[ws/explore] Client disconnected")

def _read_job_star(job_id: str) -> str:
    """
    Read job.star from a given job.
    job_id example : "MotionCorr/job001"
    Raise FileNotFoundError if file doesn't exist
    """
    RELION_DIR = os.path.abspath(".")

    path = os.path.join(RELION_DIR, job_id.replace("/", os.sep), "job.star")
    if not os.path.exists(path):
        raise FileNotFoundError(f"job.star not found for : {job_id}")
    with open(path, "r", encoding="utf-8") as f :
        return f.read()

def run_server(ip,port):
    # Determine the port logic
    final_port = port if port else gru.find_available_port(20000, 20100)
    
    try:
        typer.echo(f"Starting server on {ip}:{final_port}")
        uvicorn.run("grinder.apps.server:app", host=ip, port=final_port, reload=True)
    except OSError as e:
        typer.secho(f"Failed to start: {e}", fg=typer.colors.RED, err=True)
        raise typer.Exit(code=1)
    

# src/grinder_server/main.py

# Create the Typer app object
helper = typer.Typer(help="Grinder WebSocket Server")

@helper.command()
def server(
    ip: Annotated[str, typer.Option(help="IP address to bind the server to")] = "0.0.0.0",
    port: Annotated[int,  typer.Option(help="Specific port to use")] = None,
    new: Annotated[ bool, typer.Option("--new", help="Initialize a new session/configuration")] = False,
):
    """
    Starts the Grinder WebSocket server.
    """
    
    # Handle the --new argument logic
    if new:
        typer.echo("Initializing new session...")
        # Add your custom logic here

    run_server(ip,port)

# if __name__ == "__main__":
#     app()


