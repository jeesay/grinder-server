# In src/my_app/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse, StreamingResponse
import io
import json
import numpy as np
import typer
from typing import Annotated

import os
import polars as pl
import uvicorn

import asyncio
import pyarrow as pa

from grinder.core.tree import build_file_tree, build_relion_tree # Clean import
import grinder.core.utils as gru

import star_gate as sg


app = FastAPI()

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
            progs, projs = await gru.check_environment()
            await websocket.send_json({
                "status": "success",
                "message": "Welcome to GRINDER",
                "current_dir": os.getcwd().replace(os.sep, '/'),
                "project_list": projs,
                "environment": progs
            })
    except WebSocketDisconnect:
        print("Client disconnected /welcome")

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
        print("Client disconnected /project")


@app.get("/log")
async def log_message(websocket: WebSocket):
    await websocket.accept()
    # ... logic using build_file_tree(path) ...
    try:
        while True:
            request = await websocket.receive_text()
            dirname = request['dirname']
            jobname = request['jobname']
            logtxt = await gru.get_logfile(dirname,jobname) # (requested_filter)
            await websocket.send_json({"log":logtxt})
            # if os.path.exists(requested_path):
            #     tree_data = build_relion_tree(requested_filter)
            #     await websocket.send_json(tree_data)
            # else:
            #     await websocket.send_json({"error": "Path not found"})
    except WebSocketDisconnect:
        print("Client disconnected /log")

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
        print("Client disconnected")

@app.websocket("/job/explore")
async def websocket_dataviz(websocket: WebSocket):
    """
    Expecting message : "get_data:<job_id>:<source_file>"
    ex : "get_data:MotionCorr/job002:corrected_micrograph.star
    """
    await websocket.accept()
    try : 
        while True :
            request = await websocket.receive_text()
            print(f"[/job/data] request={request}")

            if not request.startswith("get_data:"):
                await websocket.send_json({"error" : f"Unknown request : {request}"})
                continue

    except WebSocketDisconnect:
        print(f"[/job/data] Client disconnected")
        
@app.websocket("/job/run")
async def job_run(websocket: WebSocket):
    await websocket.accept()
    # ... logic using build_file_tree(path) ...
    try:
        while True:
            request = await websocket.receive_text()
            dirname = request['dirname']
            jobname = request['jobname']
            logtxt = await gru.get_logfile(dirname,jobname) # (requested_filter)
            await websocket.send_json({"log":logtxt})
            # if os.path.exists(requested_path):
            #     tree_data = build_relion_tree(requested_filter)
            #     await websocket.send_json(tree_data)
            # else:
            #     await websocket.send_json({"error": "Path not found"})
    except WebSocketDisconnect:
        print("Client disconnected")


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
        print(f"[ws/explore] Client disconnected")

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


