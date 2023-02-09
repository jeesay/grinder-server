  /**
   * Save the click on the button and send to the server the json attached
   * @param  {Element} board  Button for the rand int
   * @param  {Websocket} websocket  Server
   */
  function click(board, websocket) {
    // When clicking on the button, send the json
    board.addEventListener("click", ({ target }) => {
      const event = {rand:0};
      websocket.send(JSON.stringify(event));
    });
  }

 /**
   * Save the click on the button and send to the server the json attached
   * @param  {Element} board  Button for the rand letter
   * @param  {Websocket} websocket  Server
   */
  function click2(board, websocket) {
    // When clicking on the button, send the json
    board.addEventListener("click", ({ target }) => {
      const event = {rand:1};
      websocket.send(JSON.stringify(event));
    });
  }

 /**
   * Receive the response of the server and display the result on the HTML page
   * @param  {Websocket} websocket  Server
   */
  function receive(websocket) {
    websocket.addEventListener("message", ({ data }) => {
      const event = JSON.parse(data);
      let res = event["data"];
      document.getElementById('result').innerText = res;
    });
  }

/**
  Connect to the python server, send the click event to it, then wait for the response 
 */
window.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("Rand int");
    const board2 = document.getElementById("Rand let");
    // Open the WebSocket connection and register event handlers.
    const websocket = new WebSocket("ws://localhost:8001/");
    click(board, websocket);
    click2(board2, websocket);
    receive(websocket);
  });