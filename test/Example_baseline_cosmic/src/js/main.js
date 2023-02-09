  /**
   * Save the click on the button and send to the server the json attached
   * @param  {Element} board  Button for the rand int
   * @param  {Websocket} websocket  Server
   */
  function click(board, websocket) {
    let name_val;
    // When clicking on the button, send the json
    board.addEventListener("click", ({ target }) => {
      clear(document.getElementById('svg'));
      let text = document.getElementById("input");
      let input_val = text.value;
      text = document.getElementById("param");
      let param_val = text.value;
      text = document.getElementById("output");
      let output_val = text.value;
      if (text.value == 'baseline.py'){
        text = document.getElementById("name");
        name_val = text.value;
      }
      else {
        name_val = null;
      }
      const event = {input:input_val, param:param_val, output:output_val, name:name_val};
      websocket.send(JSON.stringify(event));
    });
  }

 /**
   * Receive the response of the server and display the result on the HTML page
   * @param  {Websocket} websocket  Server
   */
  function receive(websocket) {
    let i = 0
    let col = ["#0000CC","#00CC00","#CC0000"]
    websocket.addEventListener("message", ({ data }) => {
      const event = JSON.parse(data);
      data = restructurationData(event);
      svg_gestion(data,col[i%3]);
      i+=1;
    });
  }


/**
  Connect to the python server, send the click event to it, then wait for the response 
 */

window.addEventListener("DOMContentLoaded", () => {

    const tool = document.getElementById("baseline");
    tool.addEventListener("click", ({ target }) => { 
      displayParamsBaseline();
    });
    const tool2 = document.getElementById("cosmic");
    tool2.addEventListener("click", ({ target }) => { 
      displayParamsCosmic();
    });

    button(document.getElementById('interface'))
    const board = document.getElementById("valid");
    // Open the WebSocket connection and register event handlers.
    const websocket = new WebSocket("ws://localhost:8001/");
    click(board, websocket);
    receive(websocket);

  });
  

