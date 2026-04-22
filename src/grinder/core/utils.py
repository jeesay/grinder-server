import json
import os
from pathlib import Path
import socket
import star_gate as sg
import logging

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

    logging.basicConfig(
        format='%(levelname)-8s[%(asctime)s]: %(message)s',
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S')

    try:
        logging.info('Parse default_pipeline.star')
        cargo = sg.StarGate()
        cargo.read(os.path.join(path,'default_pipeline.star'))
        logging.info('Get `pipeline_processes` table in default_pipeline.star')
        # Modify `pipelines_processes` in order to have unique process
        procs = cargo.db['pipeline_processes']['table']
        logging.info('Update `pipeline_processes` table in default_pipeline.star')
        procs.apply(lambda row: row)
        logging.info('End of `pipeline_processes` datablock in default_pipeline.star')
    except FileNotFoundError:
        has_file = False

    return {
        "pipeline": cargo.db['pipeline_general'],
        'nodes': cargo.db['pipeline_nodes']['table'].to_dict(orient='split'),
        'processes': cargo.db['pipeline_processes']['table'].to_dict(orient='split')
    }

async def get_jobfiles(pn,dn,jn):

    def _curatelog(logtxt,errtxt):
        curated = ''
        mouse = '~~(,_,">'
        for line in logtxt:
            if mouse in line:
                if line.count('.') == 60:
                    curated += line
                # <progress id="file" max="60" value="60">100%</progress>
            else:
                curated += f'INFO: {line}' 
        return curated

    def _convert(nodetype,df):
        # Try to guess
        if nodetype == 'relion.class2d':
            do_vdam = df.loc[df['rlnJobOptionVariable'] == 'do_grad'].iloc[0]['rlnJobOptionValue'].lower() == 'yes'
            do_em   = df.loc[df['rlnJobOptionVariable'] == 'do_em'  ].iloc[0]['rlnJobOptionValue'].lower() == 'yes'
            return nodetype + '.vdam' if do_vdam else nodetype + '.em'
        else:
            return nodetype
        
    has_file = True
    log = ''
    error = ''
    params = None
    try:
        # if .grinder/<jn> does not exist
        fn = "run.out"
        with open(os.path.join(pn,dn,jn,fn),'r') as f:
            log = f.readlines()
        fn = "run.err"
        with open(os.path.join(pn,dn,jn,fn),'r') as f:
            error = f.readlines()
        fn = "job.star"
        cargo = sg.StarGate()
        cargo.read(os.path.join(pn,dn,jn,fn))
        params_head = cargo.db['job']
        params = cargo.db['joboptions_values']['table']
        # Cleanup
        nodetype = _convert(params_head['rlnJobTypeLabel'],params)
        clean_log = _curatelog(log,error)
        params_head['rlnJobTypeLabel'] = nodetype
        # else goto .grinder/<jn>/job.json
    except FileNotFoundError:
        has_file = False
    
    return {"has_file":has_file,"log": clean_log,"params_head":params_head, "params":params.to_dict(orient='split')}    
