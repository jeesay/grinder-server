import os
from typing import Dict, Any

def build_file_tree(path: str) -> Dict[str, Any]:
    """
    Recursively builds a dictionary representing the file tree structure.
    Separated from web logic for better maintainability.
    """
    # Normalize the path
    abs_path = os.path.abspath(path)
    name = os.path.basename(abs_path)
    print(abs_path,name)
    
    # Handle the root case
    if not name:
        name = abs_path

    item = {
        "name": name,
        "path": abs_path,
    }

    if os.path.isdir(abs_path):
        item["type"] = "directory"
        try:
            # Recursively collect children
            item["children"] = [
                build_file_tree(os.path.join(abs_path, x)) 
                for x in os.listdir(abs_path)
            ]
        except PermissionError:
            # Handle folders we don't have access to
            item["children"] = []
    else:
        item["type"] = "file"
        item["size"] = os.path.getsize(abs_path)

    return item