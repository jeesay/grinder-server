'''
//  GIMMICK - Graphical Interface of Multi-Modal Imaging and sCientific Kit
//  Copyright (C) 2023  Jean-Christophe Taveau
//
//  This file is part of GIMMICK
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with GIMMICK.  If not, see <http://www.gnu.org/licenses/>.
//
// Authors : Texier Louis
'''

#!/bin/env/python

import os
import json
import sys
import asyncio
import subprocess
import websockets


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
          pathProject (String) : Path to .gimmick
    '''
    print(message)
    event = json.loads(message)
    if event['action']['tool'] == 'gimmick.py' :
      # Opening JSON file
      f = open(f"{os.environ.get('GIMMICK_PROJECT')}/.gimmick/config.json")
        
      # returns JSON object as 
      # a dictionary
      _config = json.load(f)
        
      # Closing file
      f.close()
      
      print(_config)
      task = asyncio.create_task(send(websocket,_config))
      await task
    else:
      action = event['action']
      param = ['python3']
      command = f"{os.environ.get('GIMMICK_PATH')}/{action['tool']} {action['args']}"

'''
      param.append(command)
      print(param)
      
      param.append('-i')
      if action['title'] == 'Import' or action['title'] == 'Copy':
        param.append(str(action['name'].split('\\')[-1]))

      else :
        name = action['param'][0]['data'].split('\\')[-1]

        pathin = gkw.searchInJob(pathProject,name)
        param.append(str(pathin))

        param.append('-o')
        job = gkw.addJob(pathProject,action['title'],name)
        pathout = f"./.gimmick/{action['title']}/job_{job}/Output/{name[:-5]}_baseline_{action['algo']}.json"
        param.append(str(pathout))

      param.append('-ag')
      param.append(str(action['algo']))

      for i in action['param'] :
        if not 'data' in i :
          for j in i :
            if i[j] == 'null' :
              param.append('None')
            else :
              param.append(str(i[j]))
      
      if action['title'] != 'Import' and action['title'] != 'Copy':
        gkw.createCommand(action['title'],job,param)

      # Run subprocess
      process = subprocess.Popen(param,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=True,
        encoding='utf-8')

      # Get log
      while True :
        output = process.stdout.readline()
        if process.poll() is not None:
          break
        if output:
          if action['title'] == "Import" :
            if "[" in output.strip() :
              caption = output.strip()
              captions = caption.split("', '")
              captions[0] = captions[0][2:]
              captions[-1] = captions[-1][:-2]
              action['res'] = captions
              task_i = asyncio.create_task(send(websocket,event))
              await task_i

          else :
            if not "Done" in output.strip() and not "data" in output.strip():
              event["log_2"] = output.strip()
              task_f = asyncio.create_task(send(websocket,event))
              await task_f
            elif "Done" in output.strip() :
              event["log"] = output.strip()
              task_g = asyncio.create_task(send(websocket,event))
              await task_g
            elif "data" in output.strip() :
              res = output.strip().replace("\'","\"")
              result = json.loads(res)
              event['data'] = result
              task_h = asyncio.create_task(send(websocket,event))
              await task_h
          
    else :
    # sys.exit() close all instances and raise a SystemExit, when catch, call os._exit() to close definitely the program
    # os.exit() instance to avoid because don't close all running instances (files, ...)
      try :
        sys.exit("Stop program running")
      except :
        os._exit(0)
'''

async def handler(websocket):
    '''
        Function starting the routine for each message recieve

        Parameters:
		      websocket (Websocket) : Websocket server
    '''
    pathProject = os.getcwd() + "/.gimmick"
    while True :
      asyncio.create_task(run(websocket,await websocket.recv(),pathProject))



async def main():
    '''
        Run the server and keep it running on the selected port
    '''
    async with websockets.serve(handler, "", 8001, ping_timeout=None): 
        #Remove ping_timeout (Default 20s), send a ping and wait to receive a pong, 
        # if not pong in the 20s, then stop the server
        await asyncio.Future()  # run forever


###############  MAIN ###############

cwd = os.getcwd()

'''
.gimmick/
  L config.json
.gimmick_lock
'''

# Check if `.gimmick_lock` is present, stop 
if not os.path.exists("./.gimmick_lock") :
  os.mkdir("./.gimmick_lock")

  # Check if current directory already contain a GIMMICK Project aka `.gimmick` is present
  if os.path.exists('./.gimmick') and os.path.exists('./.gimmick/config.json'):
    pass
  else :

    answer = input(f"Do you want to create a new project [Y/n] ? ")
    if answer == "Y" or answer == "Yes" or answer == "yes" or answer == "y":
      print("Create Project at", cwd)
      try:
        os.mkdir("./.gimmick")
        os.mkdir("./Import")
        os.mkdir("./Baseline")
        os.mkdir("./Despiking")
        os.mkdir("./Normalize")
        os.mkdir("./Filter")
        os.mkdir("./Calibration")
        os.mkdir("./Model")
        os.mkdir("./Quality")
        os.mkdir("./Debug")
      except OSError as error:
        pass
      print("Run configuration...")
      f = open('./.gimmick/config.json','w')
      for root,dirs,files in os.walk(os.environ.get('GIMMICK_PROJECT')):
        for name in files:
          print(os.path.join(root, name))
        for name in dirs:
          print(os.path.join(root, name))

      json_data = {
        "jobs_counter" : 0,
        "filetree" : list_files(os.environ.get('GIMMICK_PROJECT')),
        "jobs" : []
      }
      f.write(json.dumps(json_data))
      f.close()

  # Running the websockets server
  print("Run server...")
  asyncio.run(main())
    
  # Running web browser at localhost:8080
  print("Please, open your web browser at the IP address `ws://localhost:8000`")

else :
  msg = 'An instance of gimmick already running'
  sys.exit(msg)



