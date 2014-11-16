window.onload = function () {
		alert("Check");
		document.getElementById("join").onclick = userJoinSession;
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
		var _HEIGHT = 800;
		var _WIDTH = 500;

		alert("data is back");
		var canvas = document.createElement("canvas");

		var jsonObj = JSON.parse(data);
		var width = parseFloat(jsonObj.Graph.Width) * _HEIGHT;
		var height = parseFloat(jsonObj.Graph.Height) * _WIDTH;
		canvas.width = Math.round(width) + 200;
		canvas.height = Math.round(height) + 100;
		canvas.style = "border:2px solid #111111;"
		var idNameMap = jsonObj.Graph.Mappings;
		
		var idLocaleMap = new Object();
		for (var i = 0; i < jsonObj.Graph.Nodes.length; i++) {
			idLocaleMap[jsonObj.Graph.Nodes[i].id] = jsonObj.Graph.Nodes[i].X + ":" + jsonObj.Graph.Nodes[i].Y;
		}

		var draw = canvas.getContext("2d");
		draw.font = "12pt Arial";
		draw.strokeStyle = "#000";
		draw.lineWidth = 0.1;
		for (var i = 0; i < jsonObj.Graph.Nodes.length; i++) {
			var temp = jsonObj.Graph.Nodes[i];
			var node_x = Math.round(parseFloat(temp.X) * _WIDTH);
			var node_y = Math.round(parseFloat(temp.Y) * _HEIGHT);
			for (var j = 0; j < temp.Neighbors.length; j++) {
				var neigh = temp.Neighbors[i];
				var x = idLocaleMap[neigh].split(":")[0];
				var y = idLocaleMap[neigh].split(":")[1];
				var neigh_x = Math.round(parseFloat(x) * _WIDTH) + 100;
				var neigh_y = Math.round(parseFloat(y) * _HEIGHT) + 50;
				draw.moveTo(node_x + 100, node_y + 50);
				draw.lineTo(neigh_x, neigh_y);
				draw.stroke();
			}
			draw.fillStyle = "#3c0";
			draw.rect(node_x + 100, node_y + 50, 100, 50);
			draw.fill();
			draw.stroke();

			draw.fillStyle = "#fff";
			draw.fillText(temp.Data, node_x + 30, node_y + 15);

		}
		//var preBlock = document.createElement("pre");
		//preBlock.innerHTML = data;
		//document.getElementById("jsonArea").appendChild(preBlock); 
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
