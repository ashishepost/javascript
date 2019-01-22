var url = "wss://echo.websocket.org";

var wsConnection = new WebSocket(url);

console.log(wsConnection);

wsConnection.onopen = function (eventData) {
	wsConnection.send('hey');
}

wsConnection.onmessage = function (responseData) {
	console.log(responseData);
}