<!DOCTYPE html>
<?php
if (!isset($_POST["user"]) || trim($_POST["user"]) == "") {
	header('Location: index.html');
	die();
}
$user_name = $_POST["user"];
$session = $_POST["session"];
$req = curl_init('http://attu4.cs.washington.edu:33333/GameServer');
curl_setopt( $req, CURLOPT_POSTFIELDS, array('user' => $user_name, 'platform' => 'browser', 'session' => $session));
curl_setopt( $req, CURLOPT_RETURNTRANSFER, true);
$gameData = curl_exec($req);
curl_close($req);
?>

<html>
<head>
	<title>Consort</title>
	<script type="application/javascript" src="consort.js"></script>
	<link rel="stylesheet" type="text/css" href="consort.css" />
</head>
<body>
	<div id="jsonArea">
		<?= $gameData?>
	</div>
	<input type="hidden" id="user" value="<?= $user_name?>"/>
	<input type="text" id="data" />
	<button id="submit">Find!</button>
	<form action="logout.php">
		<input type="submit" value="Log out" />
	</form>
	<canvas id="line"></canvas>
	<canvas id="bg"></canvas>
	<canvas id="fg"></canvas>
</body>
</html>
