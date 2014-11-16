window.onload = function () {
		document.getElementById("join").onclick = userJoinSession;
		document.getElementById("bg").style.display = "none";
		document.getElementById("fg").style.display = "none";
		//document.getElementById("update").onclick = userUpdate;
}
													

	function userJoinSession() {
		var data = new Object();
		data.platform = "browser";
		data.user = document.getElementById("user").value;
		data.session = document.querySelector('input[name="session"]:checked').value;
		send("http://attu4.cs.washington.edu:33333/GameServer", data, 'returnUpdate');
	}

	function userUpdate() {
	}

	function returnUpdate(data) {
		var _HEIGHT = 80.0;
		var _WIDTH = 50.0;

		alert("data is back");
		var canvas = document.getElementById("bg");
		var fg = document.getElementById("fg");
		var jsonObj = JSON.parse(data);
		var width = parseFloat(jsonObj.Width) * _HEIGHT;
		var height = parseFloat(jsonObj.Height) * _WIDTH;

		canvas.width = Math.round(width) + 200;
		canvas.height = Math.round(height) + 200;
		canvas.style.display = "initial";
		
		fg.width = Math.round(width) + 200;
		fg.height = Math.round(height) + 200;
		fg.style.display = "initial";		

		var idLocaleMap = new Object();
		console.log(jsonObj.Graph.Nodes);
		for (var i = 0; i < jsonObj.Graph.Nodes.length; i++) {
			idLocaleMap[jsonObj.Graph.Nodes[i].Id] = jsonObj.Graph.Nodes[i].X + ":" + jsonObj.Graph.Nodes[i].Y;
		}

		var draw = canvas.getContext("2d");
		var typeText = fg.getContext("2d");
		draw.strokeStyle = "#000";
		draw.lineWidth = 0.1;
		for (var i = 0; i < jsonObj.Graph.Nodes.length; i++) {
			var temp = jsonObj.Graph.Nodes[i];
			var node_x = Math.round(parseFloat(temp.X) * _WIDTH);
			var node_y = Math.round(parseFloat(temp.Y) * _HEIGHT);
			for (var j = 0; j < temp.Neighbors.length; j++) {
				var neigh = temp.Neighbors[j];
				var x = (""+idLocaleMap[neigh]).split(":")[0];
				var y = (""+idLocaleMap[neigh]).split(":")[1];
				console.log(idLocaleMap[neigh]);
				console.log(x);
				console.log(y);
				var neigh_x = Math.round(parseFloat(x) * _WIDTH);
				var neigh_y = Math.round(parseFloat(y) * _HEIGHT);
				draw.moveTo(node_x + 50, node_y + 25);
				draw.lineTo(neigh_x + 50, neigh_y + 25);
				draw.stroke();
			}
			draw.fillStyle = "#3c0";
			draw.rect(node_x, node_y, 100, 50);
			draw.fill();

			typeText.fillStyle = "red";
			typeText.font = "12pt Arial";
			console.log(temp.Data);
			if (temp.Known == 'True') {
				typeText.fillText(temp.Data, node_x + 5, node_y + 30);
			} else {
				var stars = ("" + temp.Data).length * "*";
				typeText.fillText(stars, node_x + 5, node_y + 30);
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
