#!/usr/bin/env python

import asyncio
import itertools
import json
import websockets

import os
import src.py.baseline as ba
import src.py.cosmic_ray as cr

'''
    Receive the event send by js file, run the py functions and send the result to the js file

    Parameters:
		websocket (Websocket): Server which is running
'''
async def handler(websocket):

    async for message in websocket:
        event = json.loads(message)
        input = "./src/py/"+event['input']
        param = "./src/json/"+event['param']
        output = "./data/save_files/json/data/"+event['output']

        if event['input'] == 'baseline.py' :
            os.system(f"python3 {input} -p {param} -o {output} -t {event['name']}")

            x,y = ba.creat_raw()
            x = x.tolist()
            y = y.tolist()
            dico = {'x':x,'y':y}
            await websocket.send(json.dumps(dico))

            f = open(output)
            dict = json.load(f)
            f.close()
            dico = dict
            await websocket.send(json.dumps(dico))

            f = open('./data/save_files/json/data/'+event['output'][:-5]+'_base.json')
            dict = json.load(f)
            f.close()
            dico = dict
            await websocket.send(json.dumps(dico))
        
        elif event['input'] == 'cosmic_ray.py' :
            os.system(f"python3 {input} -p {param} -o {output}")

            x,y = cr.creat_raw()
            x = x.tolist()
            y = y.tolist()
            dico = {'x':x,'y':y}
            await websocket.send(json.dumps(dico))

            f = open(output)
            dict = json.load(f)
            f.close()
            dico = dict
            await websocket.send(json.dumps(dico))



'''
    Run the server and keep it running on the selected port
'''
async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever

'''
    Launch the serv
'''
if __name__ == "__main__":
    asyncio.run(main())