window.onload = function () {
	alert("Check");
	document.getElementById("login").onclick = userLogin;
	document.getElementById("session").onclick = userJoinSession;
	document.getElementById("update").onclick = userUpdate;
}
	function userLogin() {
		var user_name = document.getElementsByName("name")[0].value;
		var data = new Object;
		data.user = user_name;
		data.platform = "browser";
		send("http://attu4.cs.washington.edu:33333/SessionServer", data, "returnUpdate");
	
	}

	function userJoinSession() {
		alert(this.value);
	}

	function userUpdate() {
	}

	function returnUpdate(data) {
		alert(data);
		var jsonVal = JSON.parse(data);
		var preBlock = document.createElement("pre");
		preBlock.innerHTML = jsonVal;
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
