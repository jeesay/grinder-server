# In src/my_app/main.py

import argparse
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse
import uvicorn
from grinder_server.tree import build_file_tree, build_relion_tree # Clean import
import grinder_server.utils as gru

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
            dict = await gru.check_environment()
            print(dict)
            await websocket.send_json({
                "status": "success",
                "message": "Welcome to GRINDER",
                "environment": dict
            })
    except WebSocketDisconnect:
        print("Client disconnected")


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

# src/grinder_server/main.py

def run_server():
    parser = argparse.ArgumentParser(description="Grinder Server: A file explorer WebSocket server.")
    
    # Define arguments
    parser.add_argument("--ip", default="0.0.0.0", help="IP address to bind the server to")
    parser.add_argument("--port", type=int, help="Specific port to use")
    parser.add_argument("--new", action="store_true", help="Initialize a new session/configuration")
    
    args = parser.parse_args()

    # Determine the port
    port = args.port if args.port else gru.find_available_port(20000, 20100)
    
    # Handle the --new argument logic
    if args.new:
        print("Initializing new session...")
        # Add your custom logic here (e.g., clearing caches, resetting logs)

    try:
        print(f"Starting server on {args.ip}:{port}")
        uvicorn.run("grinder_server.main:app", host=args.ip, port=port, reload=True)
    except OSError as e:
        print(f"Failed to start: {e}")

if __name__ == "__main__":
    run_server()

