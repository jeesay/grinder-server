# In src/my_app/main.py

import argparse
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse
import uvicorn
from grinder_server.tree import build_file_tree # Clean import
from grinder_server.utils import find_available_port

app = FastAPI()

# --- 1. NEW: Redirect and Welcome Message ---

@app.get("/config")
async def config_redirect():
    """Redirects the user from /config to the welcome page."""
    return RedirectResponse(url="/welcome")

@app.get("/welcome")
async def welcome_message():
    """The landing page for the redirect."""
    return {
        "status": "success",
        "message": "Welcome to the File Tree Configuration Server!",
        "instructions": "Connect to /ws/file-tree via WebSocket to begin."
    }

# --- 2. EXISTING: File Tree Logic ---

@app.websocket("/ws/file-tree")
async def websocket_file_tree(websocket: WebSocket):
    await websocket.accept()
    # ... logic using build_file_tree(path) ...
    try:
        while True:
            requested_path = await websocket.receive_text()
            if os.path.exists(requested_path):
                tree_data = build_file_tree(requested_path)
                await websocket.send_json(tree_data)
            else:
                await websocket.send_json({"error": "Path not found"})
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
    port = args.port if args.port else find_available_port(20000, 20100)
    
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

