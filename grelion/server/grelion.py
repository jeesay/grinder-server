'''

Authors : Texier Louis
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
          pathProject (String) : Path to .GRELION
    '''
    print(message)
    event = json.loads(message)
    if event['action']['tool'] == 'grelion.py' :
      # Opening STAR file
      f = open(f"{os.environ.get('GRELION_PROJECT')}/default_pipeline_test.star")
        
      # returns star object as 
      # a dictionary
      _config = f.read()
      print(_config)
      
      # Closing file
      f.close()
      
      print(_config)
      task = asyncio.create_task(send(websocket,_config))
      await task
    else:
      action = event['action']
      param = ['python3']
      command = f"{os.environ.get('GRELION_PATH')}/{action['tool']} {action['args']}"

async def handler(websocket):
    '''
        Function starting the routine for each message recieve

        Parameters:
          websocket (Websocket) : Websocket server
    '''
    pathProject = os.getcwd() + "/.GRELION"
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

os.environ["GRELION_PROJECT"] = os.getcwd()

'''
.grelion/
  L config.json
.grelion_lock
'''

# Check if `.GRELION_lock` is present, stop 
if not os.path.exists("./.grelion_lock") :
  os.mkdir("./.grelion_lock")

  # Check if current directory already contain a GRELION Project aka `.GRELION` is present
  if os.path.exists('./.grelion') and os.path.exists('./.grelion/config.json'):
    pass
  else :

    answer = input(f"Do you want to create a new project [Y/n] ? ")
    if answer == "Y" or answer == "Yes" or answer == "yes" or answer == "y":
      print("Create Project at", cwd)
      try:
        os.mkdir("./.grelion")
      except OSError as error:
        pass
      print("Run configuration...")
      f = open('./.grelion/config.json','w')
      for root,dirs,files in os.walk(os.environ.get('GRELION_PROJECT')):
        for name in files:
          print(os.path.join(root, name))
        for name in dirs:
          print(os.path.join(root, name))

      json_data = {
        "jobs_counter" : 0,
        "filetree" : list_files(os.environ.get('GRELION_PROJECT')),
        "jobs" : []
      }
      f.write(json.dumps(json_data))
      f.close()

  # Running the websockets server
  print("Run server...")
  asyncio.run(main())
    
  # Running web browser at localhost:8080
  print("Please, open your web browser at the IP address `ws://localhost:8001`")

else :
  msg = 'An instance of GRELION already running'
  sys.exit(msg)




