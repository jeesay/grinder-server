const GRINDER = {
  version: '0.1',
  server: new WSClient()
};
  
 /**
 * Receive the response of the server and display the result on the HTML page
 * @param  {Websocket} websocket  Server

const receive = (websocket) => {
  websocket.addEventListener("message", (response) => {
    console.log(response);
    const msg = JSON.parse(response.data);

    console.log(`[message] Data received from server: ${msg}`);

    // Dispatch data
    if (event['data'] != null){
      let data = event['data']
      GRINDER.jobs = JSON.parse(msg);
    }
  });
}

 
// https://github.com/jcao219/websocket-async/blob/master/src/websocket-client.js
// 
const receive = function() {
  if (GRINDER.receiveDataQueue.length !== 0) {
    // We have a message ready.
    return Promise.resolve(GRINDER.receiveDataQueue.shift());
  }

  // Wait for the next incoming message and receive it.
  const receivePromise = new Promise((resolve, reject) => {
    GRINDER.receiveCallbacksQueue.push({ resolve, reject });
  });

  return receivePromise;
};
 */
 
 
/*
 * Run the WebSocket Client and try to connect to the python WebSocket server
*/
const connect_to_ws_server = async () => {
  const ip_address = document.getElementById('ws_server_ip').value;
  const port = document.getElementById('ws_port').value;

  // Open the WebSocket connection and register event handlers.
  await GRINDER.server.connect(`ws://${ip_address}:${port}/`);

  if (GRINDER.server.connected) {
      alert(`[Open] Connection established with server ws://${ip_address}:${port}/`);
      document.getElementById('connect').innerHTML = '<i class="bi bi-wifi"></i>Connected';
      document.getElementById('connect').style.color = 'lightgreen';
  }
  else {
      alert(`[Fail] Unable to connect to the server ws://${ip_address}:${port}/`);
  }

/*
//  GRINDER.websocket.onmessage = (event) => {};

  GRINDER.websocket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      alert('[close] Connection died');
    }
  };

  GRINDER.websocket.onerror = function(error) {
    alert(`[error]`);
  };

   // Step #1 - Get default_pipeline.json of Project
    let cli = {
      end:0,
      action: {
        tool: 'grelion.py',
        title:'project',
        args:'--get default_pipeline.json'
      }
    };
    GRINDER.websocket.send(JSON.stringify(cli));

  receive(GRINDER.websocket);
*/
};

  
