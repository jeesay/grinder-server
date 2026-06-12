import asyncio
import json
import logging
import os
import star_gate as sg
import grinder.core.log as glog


def create_defaultpipeline(path):
    starship = sg.StarGate()
    # 
    general = sg.Block('pipeline_general') 
    general.set('rlnPipeLineJobCounter',1)
    starship.add(general)
    #
    starship.write(os.path.join(path,'default_pipeline.star'))

def create_jobstar(metadata):
    projpath = metadata['current_job']['projpath']
    jobpath = metadata['current_job']['jobpath']
    rlnpath = os.path.join(projpath,jobpath) 
    starship = sg.StarGate()
    # Datablock `job`
    job = sg.Block('job')
    job.set('rlnJobTypeLabel',metadata['current_job']['tag'])
    if 'continue' in metadata['current_job']:
        job.set('rlnJobIsContinue',1 if metadata['continue'] == 'true' else 0)
    else:
        job.set('rlnJobIsContinue',0)
    job.set('rlnJobIsTomo',0)
    starship.add(job)
    # Datablock `joboptions_values`
    # Update jobpath
    jo = next(filter(lambda opt: opt['key'] == 'JOB_OUTDIR', metadata['joboptions']))
    jo['value'] = metadata['current_job']['jobpath']
    table = sg.Table()
    table.from_data(metadata['joboptions'])
    table.columns = ['rlnJobOptionVariable','rlnJobOptionValue'] 
    job = sg.Block('joboptions_values')
    job.add(table)
    starship.add(job)
    starship.save(os.path.join(rlnpath,'job.star'))

def create_jobpipelinestar(metadata):
    projpath = metadata['current_job']['projpath']
    jobpath = metadata['current_job']['jobpath']
    rlnpath = os.path.join(projpath,jobpath)
    starship = sg.StarGate()
    general = sg.Block('pipeline_general')
    procs   = sg.Block('pipeline_processes')
    nods = sg.Block('pipeline_nodes')
    nods.add(sg.Table())
    iedges = sg.Block('pipeline_input_edges')
    iedges.add(sg.Table())
    oedges = sg.Block('pipeline_output_edges')
    oedges.add(sg.Table())
    starship.add(general)
    starship.add(procs)
    starship.add(nods)
    starship.add(iedges)
    starship.add(oedges)
    # Datablock `pipeline_general`
    job_counter = 1
    general.set('rlnPipeLineJobCounter',job_counter + 1)
    # Datablock `pipeline_processes`
    table = sg.Table()
    cols = ['rlnPipeLineProcessName','rlnPipeLineProcessAlias','rlnPipeLineProcessTypeLabel','rlnPipeLineProcessStatus']
    row = [
        jobpath, 
        'None', # At that time, no way to set an alias in GRINDER
        metadata['current_job']['tag'],
        'Running'
    ]
    table.from_data([row],columns=cols)
    procs.add(table)
    # Node Datablocks `pipeline_nodes`, `pipeline_input_edges`, and `pipeline_output_edges`
    for node in metadata['nodes']:
        if node['nodetype'] == 'output':
            nn = os.path.join(jobpath,node['filename'])
            nt = node['filetype']
            row = {'rlnPipeLineNodeName': nn,'rlnPipeLineNodeTypeLabel': nt, 'rlnPipeLineNodeTypeLabelDepth': 1}
            nods.table().append(row)
            row = {'rlnPipeLineEdgeProcess': jobpath,'rlnPipeLineEdgeToNode': nn}
            oedges.table().append(row)
        if node['nodetype'] == 'input':
            # Get the input data typed by the user
            id = node['id']
            fn = metadata['job_options'][id]
            efn = os.path.join(jobpath,fn)
            row = {'rlnPipeLineEdgeFromNode': efn,'rlnPipeLineEdgeProcess': jobpath}
            iedges.table().append(row)
    # Save
    starship.save(os.path.join(rlnpath,'job_pipeline.star'))

def create_defaultpipelinestar(metadata,state):
    projpath = metadata['current_job']['projpath']
    jobpath = metadata['current_job']['jobpath']
    rlnpath = os.path.join(projpath,jobpath)
    starship = sg.StarGate()
    # Read <project_root>/default_pipeline.star
    starship.read(os.path.join(projpath,'default_pipeline.star'))
    # Datablock `pipeline_general`
    general = starship.datablock('pipeline_general')
    job_counter = general.get('rlnPipeLineJobCounter')
    general.set('rlnPipeLineJobCounter', int(job_counter) + 1) 
    # Datablock `pipeline_processes`
    proc_table = starship.datablock('pipeline_processes').table()
    row = {
        'rlnPipeLineProcessName': jobpath,
        'rlnPipeLineProcessAlias': 'None', # At that time, no way to set an alias in GRINDER
        'rlnPipeLineProcessTypeLabel': metadata['current_job']['tag'],
        'rlnPipeLineProcessStatus': state
    }
    proc_table.append(row)
    # Node Datablocks `pipeline_nodes`, `pipeline_input_edges`, and `pipeline_output_edges`
    nods = starship.datablock('pipeline_nodes').table()
    iedges = starship.datablock('pipeline_input_edges').table()
    oedges = starship.datablock('pipeline_output_edges').table()
    # Example
    # input : Extract/job019/particles.star ParticlesData.star.relion 
    # output: Class2D/job020/run_it200_data.star ParticlesData.star.relion.class2d 
    # output: Class2D/job020/run_it200_optimiser.star ProcessData.star.relion.optimiser.class2d
    for node in metadata['nodes']:
        if node['nodetype'] == 'output':
            nn = os.path.join(jobpath,node['filename'])
            nt = node['filetype']
            row = {'rlnPipeLineNodeName': nn,'rlnPipeLineNodeTypeLabel': nt, 'rlnPipeLineNodeTypeLabelDepth': 1}
            nods.append(row)
            row = {'rlnPipeLineEdgeProcess': jobpath,'rlnPipeLineEdgeToNode': nn}
            oedges.append(row)
        if node['nodetype'] == 'input':
            # Get the input data typed by the user
            id = node['id']
            fn = metadata['job_options'][id]
            efn = os.path.join(jobpath,fn)
            row = {'rlnPipeLineEdgeFromNode': efn,'rlnPipeLineEdgeProcess': jobpath}
            iedges.append(row)
    # Save
    starship.save(os.path.join(rlnpath,'default_pipeline.star'))
    starship.save(os.path.join(projpath,'default_pipeline.star'))


def update_defaultpipelinestar(metadata,state):
    projpath = metadata['current_job']['projpath']
    jobpath = metadata['current_job']['jobpath']
    rlnpath = os.path.join(projpath,jobpath)
    starship = sg.StarGate()
    # Read <project_root>/default_pipeline.star
    starship.read(os.path.join(projpath,'default_pipeline.star'))
    df = starship.datablock('pipeline_processes').table().df
    row = df['rlnPipeLineProcessName'] == jobpath 
    row['rlnPipeLineProcessStatus'] = state # 'Success', 'Failed', 'Aborted', etc.
    starship.save(os.path.join(projpath,'default_pipeline.star'))

def create_command(metadata):
    jobargs = metadata['command']
    joboptions = metadata['joboptions']
    jobpath = metadata['current_job']['jobpath']
    print(jobargs,joboptions)
 
    # Create command-line from all the args set up in the GUI
    cli = ''
    for arg in jobargs:
        typ = arg['type']
        if typ == 'prog':
            cli += arg['arg']
        elif typ == 'param':
            L = list(filter(lambda jo: jo['key'] == arg['param_id'], joboptions))
            if len(L) >= 1:
                found = L[0]
                v = str(found['value'])
                if arg['param_id'] == 'JOB_OUTDIR':
                    v = jobpath
                # Add quotes if sentence
                if len(v.split(' ')) > 1:
                    cli += f' {arg['arg']} "{v}"'
                else:
                    cli += f' {arg['arg']} {v}'
        else:
            # typ == flag
            found = list(filter(lambda jo: jo['key'] == arg['param_id'], joboptions))
            if len(found) >=1 and bool(found[0]['value']):
                cli += f' {arg['arg']}'

    print(cli)
    return cli

async def run_command_asyncio(command,metadata,websocket):

    async def log_output(stream, logger_func):
        while True:
            line = await stream.readline()
            if line:
                # Dispatch line
                log_line = line.decode().strip()
                logger_func(log_line)
                with open(os.path.join(file_path,'log.txt'), "a") as f: 
                    # Move to the end of the file if you only want new logs
                    f.write(log_line)
                    # sending new lines to client
                msg = {'type': 'log','content': log_line}
                await websocket.send_json(msg)

    projname = metadata['current_job']['projpath']
    jobname = metadata['current_job']['jobpath']

    file_path = os.path.join(projname,jobname)
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    running_file = "RELION_JOB_RUNNING"
    with  open(os.path.join(projname,jobname,running_file),'w') as f :
        pass
    create_defaultpipelinestar(metadata,'Running')

    # Run the two reads in "background"
    await asyncio.gather(
        log_output(process.stdout, logging.info),
        log_output(process.stderr, logging.error)
    )
    
    stdout,stderr = await process.communicate()

    if process.returncode == 0:
        os.remove(os.path.join(projname,jobname,running_file))
        success_file = "RELION_JOB_EXIT_SUCCESS"
        status = 'Success'
        with open(os.path.join(projname,jobname,success_file),'w') as f :
            pass
    else:
        os.remove(os.path.join(projname,jobname,running_file))
        failed_file = "RELION_JOB_EXIT_FAILED"
        status = 'Failed'
        with open(os.path.join(projname,jobname,failed_file),'w') as f :
            pass 

    update_defaultpipelinestar(metadata,status)
    return process



async def run_command(command,projname,jobname,websocket):
    rlnpath = os.path.join(projname,jobname)
    log_info = os.path.join(os.getcwd(),rlnpath,'run.out')
    log_err = os.path.join(os.getcwd(),rlnpath,'run.err')   
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    running_file = "RELION_JOB_RUNNING"
    with  open(os.path.join(projname,jobname,running_file),'w') as f :
        pass
    status = 'running'

    # Step #5 - Start the log tailer as a background task
    tailer_task = asyncio.create_task(glog.tail_log(websocket, log_info))

    # Step #6 - Return process running
    await websocket.send_json({"type": "process", "status": status, "pid": process.pid})

    # Step #7 Wait for the process to finish without blocking other connections
    # return_code = await process.wait() 
    stdout, stderr = await process.communicate()

    os.remove(os.path.join(projname,jobname,running_file))
    if process.returncode == 0:
        success_file = "RELION_JOB_EXIT_SUCCESS"
        status = 'success'
        with open(os.path.join(projname,jobname,success_file),'w') as f :
            pass
    else:
        failed_file = "RELION_JOB_EXIT_FAILED"
        status = 'failed'
        with open(os.path.join(projname,jobname,failed_file),'w') as f :
            pass 

    # Step #8 - Cleanup: stop the tailer 
    tailer_task.cancel()  
    return process
                     

async def run_command_io(
    command,
    metadata,
    websocket,
    running_processes
):
    
    projname = metadata['current_job']['projpath']
    jobname = metadata['current_job']['jobpath']

    job_path = os.path.join(projname, jobname)

    log_info = os.path.join(job_path, "run.out")
    log_err = os.path.join(job_path, "run.err")


    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        cwd=projname,
        start_new_session=True
    )

    # Running...
    running_processes[(projname, jobname)] = [process,websocket]
    running_file = os.path.join(job_path, "RELION_JOB_RUNNING")
    with open(running_file, "w"):
        pass
    create_defaultpipelinestar(metadata,'Running')

    await websocket.send_json(
        {
            "type": "process",
            "status": "running",
            "pid": process.pid,
        }
    )


    async def consume_stream(stream, logfile, stream_type):
        with open(logfile, "a", buffering=1) as f:
            while True:
                line = await stream.readline()
                if not line:
                    break
                text = line.decode(errors="replace").rstrip()
                # stockage fichier
                f.write(text + "\n")
                f.flush()
                # websocket
                await websocket.send_json(
                    {
                        "type": stream_type,
                        "content": text,
                    }
                )
                # logs serveur
                if stream_type == "stderr":
                    logging.error(text)
                else:
                    logging.info(text)

    stdout_task = asyncio.create_task(
        consume_stream(
            process.stdout,
            log_info,
            "stdout"
        )
    )

    stderr_task = asyncio.create_task(
        consume_stream(
            process.stderr,
            log_err,
            "stderr"
        )
    )

   # Run the tasks and the process wait concurrently
    await asyncio.gather(
        stdout_task, 
        stderr_task, 
        process.wait()
    )
    return_code = process.returncode

    # End of running...
    running_processes.pop((projname, jobname), None)
    os.remove(running_file)

    msg = ''
    if return_code == -15:
        status = "Aborted"
        with open(os.path.join(job_path, "RELION_JOB_EXIT_ABORTED"), "w"):
            pass
        logging.warning("Process terminated with SIGTERM")
        msg = 'Job stopped by user'
    elif return_code == 0:
        status = "Succeeded"
        with open(os.path.join(job_path, "RELION_JOB_EXIT_SUCCESS"), "w"):
            pass
    else:
        status = "Failed"
        msg = "Job Failed"
        with open(os.path.join(job_path, "RELION_JOB_EXIT_FAILED"), "w"):
            pass

    update_defaultpipelinestar(metadata,status)

    await websocket.send_json(
        {
            "type": "process",
            "status": status,
            "pid": process.pid,
            "message": msg,
            "exit_code": return_code,
        }
    )

    return return_code

async def run_command_io_gather(command, projname, jobname, websocket):
    rlnpath = os.path.join(projname, jobname)
    log_info = os.path.join(os.getcwd(), rlnpath, 'run.out')
    log_err  = os.path.join(os.getcwd(), rlnpath, 'run.err')

    async def stream_to_file_and_ws(stream, log_path, log_func):
        """Lit le stream ligne par ligne, écrit dans le fichier ET envoie au client."""
        with open(log_path, "a") as f:
            while True:
                line = await stream.readline()
                if not line:
                    break
                decoded = line.decode().strip()
                log_func(decoded)
                f.write(decoded + "\n")
                f.flush()  # Garantit l'écriture immédiate sur disque
                await websocket.send_json({"type": "log", "content": decoded})

    # Lancement du sous-processus (sans redirection shell, on gère nous-mêmes)
    process = await asyncio.create_subprocess_shell(
        f'cd {projname} && {command}',
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    # Fichier sentinelle "job en cours"
    running_file = os.path.join(projname, jobname, "RELION_JOB_RUNNING")
    open(running_file, 'w').close()

    # Notifie le client que le job démarre
    await websocket.send_json({"type": "process", "status": "running", "pid": process.pid})

    try:
        # Lecture simultanée stdout → run.out  /  stderr → run.err
        # gather() bloque jusqu'à ce que les deux streams soient épuisés,
        # ce qui n'arrive qu'à la fin du processus → garantit le return_code.
        await asyncio.gather(
            stream_to_file_and_ws(process.stdout, log_info, logging.info),
            stream_to_file_and_ws(process.stderr, log_err,  logging.error),
        )
    finally:
        # Attend la fin propre du processus et récupère le return_code
        await process.wait()

        os.remove(running_file)

        if process.returncode == 0:
            status = "success"
            sentinel = "RELION_JOB_EXIT_SUCCESS"
        else:
            status = "failed"
            sentinel = "RELION_JOB_EXIT_FAILED"

        open(os.path.join(projname, jobname, sentinel), 'w').close()

        # Notifie le client du résultat final avec le return_code
        await websocket.send_json({
            "type": "process",
            "status": status,
            "returncode": process.returncode,
        })

    return process