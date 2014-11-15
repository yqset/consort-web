window.onload = function () {
	alert("Check");
	document.getElementById("login").onclick = userLogin;
	document.getElementById("session").onclick = userJoinSession;
	document.getElementById("update").onclick = userUpdate;

	function userLogin() {
	}

	function userJoinSession() {
		alert(this.value);
	}

	function userUpdate() {
<<<<<<< HEAD
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://attu4.cs.washington.edu/SessionServer?name=yqset?callback=returnUpdate"
=======
>>>>>>> c218e975d6dfc132343318771797ed2d9c63dea7
	}

	function returnUpdate(data) {
		var jsonVal = JSON.parse(data);
		var preBlock = document.createElement("pre");
		preBlock.innerHTML = jsonVal;
		document.getElementById("jsonArea").append(preBlock); 
	}
}
