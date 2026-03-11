import os
import socket
import uvicorn
from typing import Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse


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

def build_file_tree(path: str) -> Dict[str, Any]:
    name = os.path.basename(path) or os.path.abspath(path).split(os.sep)[-1]
    item = {"name": name, "path": path}

    if os.path.isdir(path):
        item["type"] = "directory"
        try:
            item["children"] = [build_file_tree(os.path.join(path, x)) for x in os.listdir(path)]
        except PermissionError:
            item["children"] = []
    else:
        item["type"] = "file"
        item["size"] = os.path.getsize(path)
    return item

# --- 3. EXISTING: WebSocket Logic ---

@app.websocket("/ws/file-tree")
async def websocket_file_tree(websocket: WebSocket):
    await websocket.accept()
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




app = FastAPI()

def is_port_in_use(port: int) -> bool:
    """Checks if a port is already being used."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def find_available_port(start: int, end: int) -> int:
    """Returns the first available port in the given range."""
    for port in range(start, end + 1):
        if not is_port_in_use(port):
            return port
    raise OSError(f"No available ports in range {start}-{end}")

if __name__ == "__main__":
    try:
        # Define your range
        chosen_port = find_available_port(20000, 20100)
        print(f"Starting server on port: {chosen_port}")
        uvicorn.run(app, host="0.0.0.0", port=chosen_port)
    except OSError as e:
        print(f"Error: {e}")