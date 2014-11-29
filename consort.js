var gameData;
var idKnownMap = new Object();
var idLocaleMap = new Object();
var gameState = new Object();
var currentGameState = 0;
var autoUpdateTimer = null;

window.onload = function () {
		document.getElementById("submit").onclick = gameUpdate;
		document.getElementById("line").style.display = "none";
		document.getElementById("bg").style.display = "none";
		document.getElementById("fg").style.display = "none";
		gameData = document.getElementById("jsonArea").innerHTML;
		gameStateSetup();
		autoUpdate();
		draw();
		//document.getElementById("update").onclick = userUpdate;
		autoUpdateTimer = setInterval(autoUpdate, 2000);
}
													
function gameStateSetup() {
	var jsonObj = JSON.parse(String(gameData));
	for (var i = 0; i < jsonObj.Graph.Nodes.length; i++) {
		idKnownMap[jsonObj.Graph.Nodes[i].Id] = jsonObj.Graph.Nodes[i].Known;
		idLocaleMap[jsonObj.Graph.Nodes[i].Id] = jsonObj.Graph.Nodes[i].X + ":" + jsonObj.Graph.Nodes[i].Y;
	}
}

	function gameUpdate() {
		var data = document.getElementById("data").value; 
		var foundNode = isCorrect(data);
		if (foundNode) {
			if (!idKnownMap[foundNode]) {
				idKnownMap[foundNode] = true;
				currentGameState++;
				gameState[currentGameState] = data;

				var parameter = new Object();
				parameter.gamestate = currentGameState;
				parameter.data = data;
				parameter.user = document.getElementById("user").value;
				send("http://attu4.cs.washington.edu:33333/UpdateBrowserState", parameter, "");
				clear();
				draw();
			}
		} else {
			// No answer found. WHat do i do? hmm.
		}
	}
		
	function autoUpdate() {
		var parameter = new Object();
		parameter.gamestate = currentGameState;
		parameter.user = document.getElementById("user").value;
		send("http://attu4.cs.washington.edu:33333/RequestUpdate", parameter, "userUpdate");
	}

	function userUpdate(returnedData) {
		var jsonGameState = JSON.parse(String(returnedData));
		var toggle = false;
		for (var i = 0; i < jsonGameState.length; i++) {
			var foundNode = isCorrect(jsonGameState[i]);
			idKnownMap[foundNode] = true;
			currentGameState++;
			gameState[currentGameState] = data;
			toggle = true;
		}
		if (toggle) {
			clear();
			draw();
		}
	}

	function draw() {
		console.log("drawing");
		var _HEIGHT = 80.0;
		var _WIDTH = 50.0;

		var canvas = document.getElementById("bg");
		var fg = document.getElementById("fg");
		var line = document.getElementById("line");
		var jsonObj = JSON.parse(String(gameData));
		var width = parseFloat(jsonObj.Width) * _HEIGHT;
		var height = parseFloat(jsonObj.Height) * _WIDTH;

		canvas.width = Math.round(width);
		canvas.height = Math.round(height) + 500;
		canvas.style.display = "initial";
		
		fg.width = Math.round(width);
		fg.height = Math.round(height) + 500;
		fg.style.display = "initial";		

		line.width = Math.round(width);
		line.height = Math.round(height) + 500;
		line.style.display = "initial";		
		

		var draw = canvas.getContext("2d");
		var typeText = fg.getContext("2d");
		var drawLine = line.getContext("2d");
		drawLine.strokeStyle = "#000";
		drawLine.lineWidth = 0.1;
		for (var i = 0; i < jsonObj.Graph.Nodes.length; i++) {
			var temp = jsonObj.Graph.Nodes[i];
			if (idKnownMap[temp.Id]) {
				var node_x = Math.round(parseFloat(temp.X) * _WIDTH);
				var node_y = Math.round(parseFloat(temp.Y) * _HEIGHT);
				for (var j = 0; j < temp.Neighbors.length; j++) {
					var neigh = temp.Neighbors[j];
					var x = (""+idLocaleMap[neigh]).split(":")[0];
					var y = (""+idLocaleMap[neigh]).split(":")[1];
					var neigh_x = Math.round(parseFloat(x) * _WIDTH);
					var neigh_y = Math.round(parseFloat(y) * _HEIGHT);
					drawLine.moveTo(node_x + 50, node_y + 25);
					drawLine.lineTo(neigh_x + 50, neigh_y + 25);
					drawLine.stroke();
					if (!idKnownMap[neigh]) {
						drawBubble(draw, "white", neigh_x, neigh_y);
						var stars = "*".repeat(("" + jsonObj.Mappings[neigh]).length);
						writeTo(typeText, stars, neigh_x, neigh_y);
					}
				}
				drawBubble(draw, "white", node_x, node_y);

				if (idKnownMap[temp.Id]) {
					writeTo(typeText, temp.Data, node_x, node_y);
				} else {
					var stars = "*".repeat(("" + temp.Data).length);
					writeTo(stars, node_x, node_y);
				}
			}
		}
	}

function send(url, parameter, callbackMethod) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		var string = url + "?";
		for (var key in parameter) {
			string += key + "=" + parameter[key] + "&";
		}
		string += "callback=" + callbackMethod;
		script.src = string;
		document.getElementsByTagName("head")[0].appendChild(script);
}

String.prototype.repeat = function(n) {
	return new Array(n + 1).join(this);
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

// Returns the Id of the found node, if not found,
// return false.
function isCorrect(data) {
	var jsonObj = JSON.parse(String(gameData));
	var tempNodes = jsonObj.Graph.Nodes;
	data = data.trim();
	data = data.toLowerCase();
	for (var i = 0; i < tempNodes.length; i++) {
		if (tempNodes[i].Data == data) {
			return tempNodes[i].Id;
		}
	}
	return false;
}

// Clears all canvas on the page
function clear() {
		console.log("clearing");		

		var canvas = document.getElementById("bg");
		var fg = document.getElementById("fg");
		var line = document.getElementById("line");
	
		var draw = canvas.getContext("2d");
		var typeText = fg.getContext("2d");
		var drawLine = line.getContext("2d");

		draw.clearRect(0,0, canvas.width, canvas.height);
		typeText.clearRect(0,0, canvas.width, canvas.height);
		drawLine.clearRect(0,0, canvas.width, canvas.height);
}

// Draw a bubble with the context ctx,
// with background color of color at centered at x and y
function drawBubble(ctx, color, x, y) {
	
	ctx.beginPath();
	ctx.moveTo(x + 50, y);
	
	ctx.quadraticCurveTo(x, y, x, y + 25);
	ctx.quadraticCurveTo(x, y + 50, x + 50, y + 50);
	ctx.quadraticCurveTo(x + 100, y + 50, x + 100, y + 25);
	ctx.quadraticCurveTo(x + 100, y, x + 50, y);

	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
 
}

// Print text (data)to the context ctx,
// centered at x and y
function writeTo(ctx, data, x, y) {
	ctx.fillStyle = "#333333";
	ctx.font = "11pt Tahoma";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(data.capitalize(), x + 50, y + 25);
}
