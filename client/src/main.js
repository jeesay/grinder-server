const GRELION = {
  version: '0.1',
  websocket: undefined
};
  
 /**
 * Receive the response of the server and display the result on the HTML page
 * @param  {Websocket} websocket  Server
 */
const receive = (websocket) => {
  websocket.addEventListener("message", (response) => {
    console.log(response);
    const msg = JSON.parse(response.data);

    console.log(`[message] Data received from server: ${msg}`);

    // Dispatch data
    if (event['data'] != null){
      let data = event['data']
      GRELION.config = parseSTAR(msg);
    }
  });
}



/*
 * Run the WebSocket Client and try to connect to the python WebSocket server
*/
const connect_to_ws_server = () => {
  const ip_address = document.getElementById('ws_server_ip').value;
  const port = document.getElementById('ws_port').value;

  // Open the WebSocket connection and register event handlers.
  GRELION.websocket = new WebSocket(`ws://${ip_address}:${port}/`);   

  GRELION.websocket.onopen = function(e) {
    alert(`[open] Connection established with server ws://${ip_address}:${port}/`);
    // Step #1 - Get default_pipeline.star of Project
    let cli = {
      end:0,
      action: {
        tool: 'grelion.py',
        title:'project',
        args:'--get default_pipeline.star'
      }
    };
    GRELION.websocket.send(JSON.stringify(cli));

  };

//  GRELION.websocket.onmessage = (event) => {};

  GRELION.websocket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      alert('[close] Connection died');
    }
  };

  GRELION.websocket.onerror = function(error) {
    alert(`[error]`);
  };
  
  receive(GRELION.websocket);
};

  
