import os
import json
import pandas as pd
import star_gate as sg
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

async def build_relion_tree(filter=None):

    def datablock(star,blockname):
        for k,block in star.blocks.items():
            if k == blockname:
                return block
        return None
        
    # Main
    cargo = sg.StarGate()
    cargo.read('default_pipeline.star')

    # Create file tree from `default_pipeline.star`
    root = {
        'name':'root',
        'type': 'folder',
        'children':[],
        'dirnames': []
    }

    df = datablock(cargo,'pipeline_nodes')['table']
    nodename = df.rlnPipeLineNodeName.str.replace('//','/')
    for fn,label in zip(nodename.str.split('/'),df.rlnPipeLineNodeTypeLabel):
        # fnclean = fn.copy()
        # if len(fn) > 3:
        #     fnclean = [s for s in fn if len(s) != 0]
        parent,job,filename = fn
        # Create Folder, sub-folder
        if parent not in root['dirnames']:
            root['dirnames'].append(parent)
            root['children'].append(
                {
                    'name':parent, # `Import`, `Select`, etc.
                    'type': 'folder',
                    'children':[], 
                    'dirnames':[]
                }
            )

        # Add filename
        idx = root['dirnames'].index(parent) # Get index of `Import`, `Select`, etc.
        cat = root['children'][idx]
        if job not in cat['dirnames']:
            cat['children'].append({'name':job, 'type':'folder','children': [],'parent':parent})
            cat['dirnames'].append(job)
        #
        idj = cat['dirnames'].index(job)
        cat['children'][idj]['children'].append({'name':filename,'type':'file','label':label,'next':'none','parent':job})


    return json.dumps(root,indent=2)