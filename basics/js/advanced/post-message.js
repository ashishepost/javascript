// var targetWindow = "http://localhost/javascript/basics/post-windows.html";

// windowObjectReference = window.open(targetWindow, "Post Window");
// windowObjectReference.postMessage("Hello", targetWindow);


window.onload = function() {
  // Get the window displayed in the iframe.
  var receiver = document.getElementById('receiver').contentWindow;

  // Get a reference to the 'Send Message' button.
  var btn = document.getElementById('send');

  // A function to handle sending messages.
  function sendMessage(e) {
    // Prevent any default browser behaviour.
    //e.preventDefault();

    // Send a message with the text 'Hello Treehouse!' to the receiver window.
    receiver.postMessage('Hello Treehouse!', 'http://localhost/javascript/basics/post-windows.html');
  }

  // Add an event listener that will execute the sendMessage() function
  // when the send button is clicked.
  btn.addEventListener('click', sendMessage);
}