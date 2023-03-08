#!/bin/env/python

import os
import json
import re
import star_gate as sg

JOBTYPES = [
  {
    'type': "relion.autopick.ref2d",
    'menu': 'picking'
  },
  {
    'type': "relion.autopick.topaz.pick",
    'menu': 'picking'
  },
  {
    'type': "relion.autopick.topaz.train",
    'menu': 'picking'
  },
  {
    'type': "relion.class2d",
    'menu': 'class2d'
    'subtypes': {
      '--grad': 'vdam',
      '--helix': 'helix',
      '--em': 'em'
    },
  },
  {
    'type': "relion.class3d",
    'menu': 'class3d'
  },
  {
    'type': "relion.ctffind.ctffind4",
    'menu': 'ctf'
  },
  {
    'type': "relion.ctfrefine",
    'menu': 'ctf'
  },
  {
    'type': "relion.ctfrefine.anisomag",
    'menu': 'ctf'
  },
  {
    'type': "relion.extract",
    'menu': 'extract'
  },
  {
    'type': "relion.extract.reextract",
    'menu': 'extract'
  },
  {
    'type': "relion.import.movies",
    'menu': 'import'
  },
  {
    'type': "relion.import.other",
    'menu': 'import',
    'subtypes': {}
  },
  {
    'type': "relion.initialmodel",
    'menu': 'abinitio'
  },
  {
    'type': "relion.maskcreate",
    'menu': 'tools',
  },
  {
    'type': "relion.motioncorr.own",
    'menu': 'motioncorr',
  },
  {
    'type': "relion.polish",
    'menu': 'postprocess',
  },
  {
    'type': "relion.polish.train",
    'menu': 'postprocess',
  },
  {
    'type': "relion.postprocess",
    'menu': 'postprocess',
  },
  {
    'type': "relion.refine3d",
    'menu': 'refine3d',
  },
  {
    'type': "relion.select.interactive",
    'menu': 'tools',
  },
  {
    'type': "relion.select.onvalue",
    'menu': 'tools',
  },
  {
    'type': "relion.select.split",
    'menu': 'tools',
  }
]

def to_number(s):
  try:
    float_value = float(s)
  except ValueError:
    return s
    
  if float_value.is_integer():
    return int(float_value)
  else:
    return float_value
        
def parse_note(f,dict):
  # returns object as 
  # a dictionary
  line = f.readline()
  while line:
    line = f.readline()
    
    _date = re.findall("job on (.*)\n", line)
    if _date:
      new_cli = {}
      new_cli['date'] = _date[0]
      new_cli['script'] = []
      dict['cli'].append(new_cli)
      
    _params = re.findall("(`which|relion)(.*)\n", line)
    if _params:
      commands = {}
      for i,cli in enumerate(_params):
        words = cli[1].split()
        commands['command'] = f'relion{words[0]}' if words[0][0] == '_' else words[0][0:-1].strip()
        commands['options'] = {}
        last=''
        lasti=0
        for i,opt in enumerate(words[1:]):
          if opt[0:2] == '--':
            last = opt
            lasti = i
            commands['options'][last] = True
          elif i == lasti + 1:
            commands['options'][last] = to_number(opt)
      new_cli['script'].append(commands)

  # Closing file
  f.close()
  return dict
  

def parse_job(root,dict):
  # returns object as 
  # a dictionary
  with open(os.path.join(root, 'job.star')) as f:  # Use file to refer to the file object
    for line in f:
      words=line.split()
      keywords = [
        'nr_mpi','gpu_ids','nr_threads','min_dedicated',
        'scratch_dir','use_gpu','do_queue','qsub','qsubscript','queuename'
      ]
      if len(words) > 1 and words[0] == '_rlnJobTypeLabel':
        dict['jobtype'] = words[1]
      if len(words) > 1 and words[0] in keywords :
        value = to_number(words[1])
        if value == "No":
          value = False
        elif value == "Yes":
          value = True
        elif value == '""':
          value = ''

        dict['process'][words[0]] = value
  
  return dict

def update_project():
  collection = []
  pipeline = []
  
  print('Scanning the jobs...')
  for root,dirs,files in os.walk('./'):

    if 'Nodes' not in root:
      # Init job params
      job = {}
      job['outputs'] = []
      job['jobtype'] = ''
      job['process'] = {}
      job['path'] = root
      job['cli'] = []
      
      status = 0
      for name in files:
        basename, file_extension = os.path.splitext(name)
        if name in ['note.txt','job.star']:
          filename = os.path.join(root, name)
          f = open(filename)
          if name == 'note.txt':
            job = parse_note(f,job)
            status += 1
          elif name == 'job.star':
            job = parse_job(root,job)
            status += 1
        elif basename[0:4] != 'job_' and basename[0:8] != 'default_' and file_extension == '.star':
          job['outputs'].append(name)
        elif os.path.join(root, name) == './default_pipeline.star':
          print('Scanning `./default_pipeline.star`...')
          # STAR Parsing
          pipeline = sg.StarGate('./default_pipeline.star')
          processes = pipeline.datablock('pipeline_processes').table().rows()
        if status == 2:
          # print(job)
          # Write as job.json
          with open(os.path.join(root, 'job.json'), 'w') as f:  # Use file to refer to the file object
            f.write(json.dumps(job, indent=2))
          
      # Add job in the list

      # print(job['path'])
      if (len(job['cli']) > 0):
        pid = re.findall(r'\d+',job['path'])[-1]
        # Find obj from pipeline
        process = [p for i,p in enumerate(processes) if pid in p[0] ]
        collection.append({
          'id': pid, 
          'alias': process[0][1],
          'date': job['cli'][0]['date'],
          'path': job['path'],
          'type': job['jobtype'],
          'status': process[0][3],
          'steps': len(job['cli']),
        })

  with open('./default_pipeline.json', 'w') as f:  # Use file to refer to the file object
    sortcoll = sorted(collection, key=lambda d: d['id'])
    f.write(json.dumps(sortcoll, indent=2))


########### MAIN ###########

update_project()
