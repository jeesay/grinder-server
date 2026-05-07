import asyncio
import json
import logging
import os
import star_gate as sg

def create_defaultpipeline(path):
    cargo = sg.StarGate()
    # 
    general = sg.DataBlock('pipeline_general') 
    general.set('rlnPipeLineJobCounter',1)
    cargo.add(general)
    #
    cargo.write(os.path.join(path,'default_pipeline.star'))

def create_jobstar(metadata,rlnpath):
    cargo = sg.StarGate()
    # Datablock `job`
    job = sg.Block('job')
    job.set('rlnJobTypeLabel',metadata['current_job']['tag'])
    if 'continue' in metadata['current_job']:
        job.set('rlnJobIsContinue',1 if metadata['continue'] == 'true' else 0)
    else:
        job.set('rlnJobIsContinue',0)
    job.set('rlnJobIsTomo',0)
    cargo.add(job)
    # Datablock `joboptions_values`
    table = sg.Table()
    table.from_dict(metadata['joboptions'])
    job = sg.Block('joboptions_values')
    job.add(table)
    cargo.add(job)
    print(cargo)
    cargo.save(rlnpath,'job.star')

def create_jobpipelinestar(metadata,job_counter):
    cargo = sg.StarGate()
    # Datablock `pipeline_general`
    general = sg.DataBlock('pipeline_general')
    general.set('rlnPipeLineJobCounter', job_counter)
    cargo.add(general)
    # Datablock `joboptions_values`
    table = sg.Table(
        columns = [
            'rlnPipeLineProcessName', 
            'rlnPipeLineProcessAlias', 
            'rlnPipeLineProcessTypeLabel',
            'rlnPipeLineProcessStatus'
        ]
    )
    table.from_json(metadata.joboptions)
    proc = sg.DataBlock('pipeline_processes')
    proc.add(table)
    cargo.add(job)
    # Datablock `pipeline_nodes`
    nods = sg.DataBlock('pipeline_processes')
    # Example
    # input : Extract/job019/particles.star ParticlesData.star.relion 
    # output: Class2D/job020/run_it200_data.star ParticlesData.star.relion.class2d 
    # output: Class2D/job020/run_it200_optimiser.star ProcessData.star.relion.optimiser.class2d
    table = sg.Table(data = metadata.nodes, columns = ['rlnPipeLineNodeName','rlnPipeLineNodeTypeLabel'])
    nods.add(table)
    cargo.add(nods)
    # Datablock `pipeline_input_edges`
    iedges = sg.DataBlock('pipeline_propipeline_input_edges')
    table = sg.Table(data = metadata.nodes, columns = ['rlnPipeLineEdgeFromNode','rlnPipeLineEdgeProcess'])
    iedges.add(table)
    cargo.add(iedges)
    # Datablock `pipeline_output_edges`
    oedges = sg.DataBlock('pipeline_output_edges')
    table = sg.Table(data = metadata.nodes, columns = ['rlnPipeLineEdgeProcess','rlnPipeLineEdgeToNode'])
    oedges.add(table)
    cargo.add(iedges)
    # Save
    cargo.write(metadata.outdir,'job_pipeline.star')
    # metadata

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

async def run_command_asyncio(command):
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    async def log_output(stream, logger_func):
        while True:
            line = await stream.readline()
            if line:
                logger_func(line.decode().strip())
            else:
                break

    # On lance les deux lectures en "background"
    await asyncio.gather(
        log_output(process.stdout, logging.info),
        log_output(process.stderr, logging.error)
    )
    
    await process.wait()
