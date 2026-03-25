import json
import os
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


def check_environment():  
    # Env var check
    relion_config = {k: v for k, v in os.environ.items() if k.startswith("RELION_")}
    print(relion_config)
    # `default_pipeline` check
    has_file = True
    try:
        cargo = sg.StarGate()
        cargo.read('default_pipeline.star')
    except FileNotFoundError:
        has_file = False

    return json.dumps({
        "file_exists": has_file,
        "env_vars": relion_config,
        "pipeline": cargo.db['pipeline_general']
    },indent=2)

