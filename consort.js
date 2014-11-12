window.onload = function () {
	alert("Check");
	document.getElementById("login").onclick = userLogin;
	document.getElementById("session").onclick = userJoinSession;
	document.getElementById("update").onclick = userUpdate;

	function userLogin() {
		alert(this.value);
	}

	function userJoinSession() {
		alert(this.value);
	}

	function userUpdate() {
		var ajax = new XMLHttpRequest();
		ajax.onload = returnUpdate;
		ajax.open("POST", "Test", true);
		ajax.send("name=yqset&sesison=99");
	}

	function returnUpdate() {
		var jsonVal = JSON.parse(this.responseText);
		var preBlock = document.createElement("pre");
		preBlock.innerHTML = jsonVal;
		document.getElementById("jsonArea").append(preBlock); 
	}
}
