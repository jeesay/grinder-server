#!/usr/bin/env python

import asyncio
import itertools
import json
import websockets

import random_file as rf

'''
    Receive the event send by js file, run the py functions and send the result to the js file

    Parameters:
		websocket (Websocket): Server which is running
'''
async def handler(websocket):

    async for message in websocket:
        event = json.loads(message)

        res = rf.calc(event)
        event = {"data":res}
        await websocket.send(json.dumps(event))

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
