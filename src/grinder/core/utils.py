import json
import os
from pathlib import Path
import socket
import star_gate as sg

def is_port_in_use(port: int, host: str = 'localhost') -> bool:
    """Checks if a port is already being used on the host."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((host, port)) == 0

def find_available_port(start: int, end: int) -> int:
    """
    Scans a range of ports and returns the first one that is free.
    Raises an OSError if none are available.
    """
    for port in range(start, end + 1):
        if not is_port_in_use(port):
            return port
    raise OSError(f"No available ports found in range {start}-{end}")


def find_relion_dirs(root_path):
    target_file = 'default_pipeline.star'
    found_directories = []

    # topdown=True is required to modify 'dirs' in place to prune the search
    for root, dirs, files in os.walk(root_path, topdown=True):
        if target_file in files:
            # Normalize to Unix-style forward slashes
            # root.replace(os.sep, '/') 
            unix_path = Path(root).as_posix() # will automatically use '/' regardless of OS
            found_directories.append(unix_path)
            
            # This prevents os.walk from looking into subfolders of the current root
            dirs.clear() 
            
    return found_directories

# Example usage:
# result = find_pipeline_dirs('/your/search/path')
# print(result)
async def check_environment():  
    # Env var check
    relion_config = {k: v for k, v in os.environ.items() if k.startswith("RELION_")}
    # Get all the projects in the file tree
    projects = find_relion_dirs('./')
    return (relion_config,projects)

async def upload_project(path):
    # `default_pipeline` check
    has_file = True
    try:
        cargo = sg.StarGate()
        cargo.read(os.path.join(path,'default_pipeline.star'))
        # Modify `pipelines_processes` in order to have unique process
        procs = cargo.db['pipeline_processes']['table']
        procs.apply(lambda row: row)
    except FileNotFoundError:
        has_file = False

    return {
        "pipeline": cargo.db['pipeline_general'],
        'nodes': cargo.db['pipeline_nodes']['table'].to_dict(orient='split'),
        'processes': cargo.db['pipeline_processes']['table'].to_dict(orient='split')
    }

async def get_logfile(dn,jn,fn='log.txt'):
    has_file = True
    data = None
    try:
        with open(os.path.join(dn,jn,fn),'r') as f:
            data = f.readlines()
    except FileNotFoundError:
        has_file = False
    
    return {"has_file":has_file,"log": data}    
