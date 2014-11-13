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
	}

	function returnUpdate() {
		var jsonVal = JSON.parse(this.responseText);
		var preBlock = document.createElement("pre");
		preBlock.innerHTML = jsonVal;
		document.getElementById("jsonArea").append(preBlock); 
	}
}
