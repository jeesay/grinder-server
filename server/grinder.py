'''

Authors : Texier Louis, Jean-Christophe Taveau
'''

#!/bin/env/python

import argparse
import os
from datetime import datetime
import json
import sys
import asyncio
import subprocess
import websockets

import gm_init as init

'''
logfile = open('run.out', 'w')
errfile = open('run.err', 'w')
proc=subprocess.Popen(['cat', 'file'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
for line in proc.stdout:
    sys.stdout.write(line)
    logfile.write(line)
for line in proc.stderr:
    sys.stderr.write(line)
    errfile.write(line)
proc.wait()
'''

def list_files(startpath):
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print('{}{}/'.format(indent, os.path.basename(root)))
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print('{}{}'.format(subindent, f))
    return 'coucou'

def dispatch_message(obj):
  console.log(obj.type)


async def send(websocket, event):  
    '''
        Send a request to HTML

        Parameters:
          websocket (Websocket) : Websocket server
          event (dict) : Message to send
    '''
    await websocket.send(json.dumps(event))


async def run(websocket,message,pathProject):
    '''
        Routine of the server

        Parameters:
          websocket (Websocket) : Websocket server
          message (json) : Message send by HTML
          pathProject (String) : Path to .GRINDER
    '''
    print(message)
    event = json.loads(message)
    if event['action']['tool'] == 'GRINDER.py' :
        # Opening config STAR file
        f = open(f"{os.environ.get('GRINDER_PROJECT')}/default_pipeline.json")
          
        # returns star object as 
        # a dictionary
        _config = json.load(f)
        print(_config)

        # Closing file
        f.close()

        task = asyncio.create_task(send(websocket,_config))
        await task
    elif event['action']['tool'] == 'GET':
        # Opening the config STAR/JSON file
        filename = event['action']['args']
        print(filename)
        with open(filename) as user_file:
            file_contents = json.load(user_file)
        task = asyncio.create_task(send(websocket,file_contents))
        await task
    elif event['action']['tool'] == 'BROWSE':
        # Get path
        args = event['action']['args'].split(' ')
        path = args[args.index('--i')  + 1]
        file_hidden = args.index('--hidden') if '--hidden' in args else -1
        dirs=[]; files=[]; stats= []
        for item in os.listdir(path):
          print(item)
          if file_hidden and item[0] ==  '.':
            continue
          if os.path.isfile(os.path.join(path, item)):
            statinfo = os.stat(os.path.join(path, item))
            files.append(item)
            mtime = statinfo.st_mtime
            stats.append({'size_in_bytes': statinfo.st_size,'mdate': datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M')})
          else:
            dirs.append(item)
        file_contents = {'dirs':dirs,'files': files, 'stats': stats}
        print(file_contents)
        task = asyncio.create_task(send(websocket,file_contents))
        await task
    else:
        action = event['action']
        param = ['python3']
        command = f"{os.environ.get('GRINDER_PATH')}/{action['tool']} {action['args']}"

async def handler(websocket):
    '''
        Function starting the routine for each message recieve

        Parameters:
          websocket (Websocket) : Websocket server
    '''
    pathProject = os.getcwd() + "/.GRINDER"
    while True :
      asyncio.create_task(run(websocket,await websocket.recv(),pathProject))



async def main(port):
    '''
        Run the server and keep it running on the selected port
    '''
    async with websockets.serve(handler, "", port, ping_timeout=None): 
        #Remove ping_timeout (Default 20s), send a ping and wait to receive a pong, 
        # if not pong in the 20s, then stop the server
        await asyncio.Future()  # run forever


###############  MAIN ###############

parser = argparse.ArgumentParser(description='Run GRINDER websocket server')
parser.add_argument("--port", "-p", nargs='?', const=8001, default=8001, type=int, help='The port of the websocket server')

args = parser.parse_args()

cwd = os.getcwd()

os.environ["GRINDER_PROJECT"] = os.getcwd()

'''
.GRINDER/
  L config.json
.GRINDER_lock
'''


# Get RELION version
# relion_import --version | egrep -o '[0-9].*'
# TODO exec("relion_import --version | egrep -o \'[0-9].*\'")

cmd = ["""/usr/bin/grep -o '[0-9][^ ]*' ../relion_version.txt"""]
# HACK proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
# HACK print(subprocess.check_output(cmd,shell=True))

'''
# Check if `.GRINDER_lock` is present, stop 
if not os.path.exists("./.GRINDER_lock") :
  os.mkdir("./.GRINDER_lock")
else :
  msg = 'An instance of GRINDER already running'
  sys.exit(msg)
'''
  
# Check if current directory already contain a RELION Project
if os.path.exists('default_pipeline.star') :
  # Create/ Update JSON configuration files
  init.update_project()
else:
  answer = input(f"Do you want to create a new project [Y/n] ? ")
  if answer == "Y" or answer == "Yes" or answer == "yes" or answer == "y":
    print("Create Project at", cwd)
    try:
      os.mkdir("./.GRINDER")
    except OSError as error:
      pass
    print("Run configuration...")
    f = open('./.GRINDER/config.json','w')
    for root,dirs,files in os.walk(os.environ.get('GRINDER_PROJECT')):
      for name in files:
        print(os.path.join(root, name))
      for name in dirs:
        print(os.path.join(root, name))

    json_data = {
      "jobs_counter" : 0,
      "filetree" : list_files(os.environ.get('GRINDER_PROJECT')),
      "jobs" : []
    }
    f.write(json.dumps(json_data))
    f.close()

# Running the websockets server
print("Run server...")
asyncio.run(main(args.port))
  
# Running web browser at localhost:8080
print(f'Please, open your web browser at the IP address `ws://localhost:{args.port}`')





