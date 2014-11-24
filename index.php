<!DOCTYPE html>
<?php
session_start();
if (isset($_SESSION["user"])) {
	if (isset($_SESSION["session"])) {
		header('Location: consort-game.php');
		die();
	}
	header('Location: consort.php');
	die();
}
?>

<html>
<head>
	<title>Consort</title>
</head>
<body>
	<form method="POST" action="consort.php">
	User Name:
		<input type="text" name="user" />
		<input type="submit" value="Login" />
	</form>
		
</body>
</html>
