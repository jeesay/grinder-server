import socket

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