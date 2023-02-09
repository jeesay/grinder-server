const GIMMICK = {
  version: '0.1',
  websocket: undefined
};
  
 /**
 * Receive the response of the server and display the result on the HTML page
 * @param  {Websocket} websocket  Server
 */
function receive(websocket) {
  websocket.addEventListener("message", (response) => {
    console.log(response);
    const msg = JSON.parse(response.data);

    console.log(`[message] Data received from server: ${msg}`);


    if (event['data'] != null){
      let data = event['data']
      console.log(data);
      visualisation(data);
    }

    if ( event['action']['res'] != null){
      selectSpectra(event['action']['res'],event['action']['name']);
    }

    if (event['log_2'] != null){
      let field_2 = document.querySelectorAll("article#running > div > fieldset > div")[2]
      field_2.textContent = event['log_2'];
    }

    if (event['log'] != null){
      let field = document.querySelectorAll("article#running > div > fieldset > div")[3]
      field.textContent = event['log'];
      document.querySelector('button#submit').disabled = false;
    }

    if (event['error'] != null){
      let field = document.querySelectorAll("article#running > div > fieldset")[3]
      field.textContent = event['error'];
      document.querySelector('button#submit').disabled = false;
    }
  });
}



/*
Run the WebSocket Client and try to connect to the python WebSocket server
*/
const connect_to_ws_server = () => {
  const ip_address = document.getElementById('ws_server_ip').value;
  const port = document.getElementById('ws_port').value;

  // Open the WebSocket connection and register event handlers.
  GIMMICK.websocket = new WebSocket(`ws://${ip_address}:${port}/`);   

  GIMMICK.websocket.onopen = function(e) {
    alert(`[open] Connection established with server ws://${ip_address}:${port}/`);
    // Step #1 - Get config.json of Project
    let cli = {
      end:0,
      action: {
        tool: 'gimmick.py',
        title:'project',
        args:'--get config.json'
      }
    };
    GIMMICK.websocket.send(JSON.stringify(cli));

  };

//  GIMMICK.websocket.onmessage = function(event) {
//  };

  GIMMICK.websocket.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      alert('[close] Connection died');
    }
  };

  GIMMICK.websocket.onerror = function(error) {
    alert(`[error]`);
  };
  
  receive(GIMMICK.websocket);
};

  
