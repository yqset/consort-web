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
		alert("data is back");
		var jsonVal = JSON.parse(data);
		var preBlock = document.createElement("pre");
		preBlock.innerHTML = data;
		document.getElementById("jsonArea").appendChild(preBlock); 
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
