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

		canvas.width = Math.round(width) + 200;
		canvas.height = Math.round(height) + 200;
		canvas.style.display = "initial";
		
		fg.width = Math.round(width) + 200;
		fg.height = Math.round(height) + 200;
		fg.style.display = "initial";		

		line.width = Math.round(width) + 200;
		line.height = Math.round(height) + 200;
		line.style.display = "initial";		
		

		var draw = canvas.getContext("2d");
		var typeText = fg.getContext("2d");
		var drawLine = line.getContext("2d");
		drawLine.strokeStyle = "#000";
		drawLine.lineWidth = 0.1;
		draw.fillStyle = "#3c0";
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
						draw.rect(neigh_x, neigh_y, 100, 50);
						draw.fill();
						var stars = "*".repeat(("" + jsonObj.Mappings[neigh]).length);
						typeText.fillText(stars, neigh_x + 5, neigh_y + 30);
					}
				}
				draw.rect(node_x, node_y, 100, 50);
				draw.fill();

				typeText.fillStyle = "red";
				typeText.font = "12pt Arial";
				if (idKnownMap[temp.Id]) {
					typeText.fillText(temp.Data, node_x + 5, node_y + 30);
				} else {
					var stars = "*".repeat(("" + temp.Data).length);
					typeText.fillText(stars, node_x + 5, node_y + 30);
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

// Returns the Id of the found node, if not found,
// return false.
function isCorrect(data) {
	var jsonObj = JSON.parse(String(gameData));
	var tempNodes = jsonObj.Graph.Nodes;
	var data = data.trim();
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
