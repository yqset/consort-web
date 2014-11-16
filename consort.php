<!DOCTYPE html>
<?php
if (!isset($_POST["user"]) || trim($_POST["user"]) == "") {
	header('Location: index.html');
	die();
}
$user_name = $_POST["user"];
$req = curl_init('http://attu4.cs.washington.edu:33333/SessionServer');
curl_setopt( $req, CURLOPT_POSTFIELDS, array('user' => $user_name, 'platform' => 'browser'));
curl_setopt( $req, CURLOPT_RETURNTRANSFER, true);
$json = curl_exec($req);
curl_close($req);
$sessions = json_decode($json, true);
?>

<html>
<head>
	<title>Consort</title>
	<script type="application/javascript" src="consort.js"></script>
	<link rel="stylesheet" type="text/css" href="consort.css" />
</head>
<body>
	<div id="jsonArea">
	</div>
<?php
	for ($i = 0; $i < count($sessions); $i++) { 
		if ($i == count($sessions) - 1) {?>
			<input type="radio" value="<?= $i + 1 ?>" name="session" checked="checked"/><?= $sessions[$i]?>
	<?php } else { ?>
			<input type="radio" value="<?= $i + 1 ?>" name="session" /><?= $sessions[$i]?>
<?php
		}
	}
?>
	<input type="hidden" id="user" value="<?= $user_name ?>" />
	<button id="join">Join</button>
	<br />
	<form action="logout.php">
		<input type="submit" value="Log out">
	</form>
	<canvas id="bg"></canvas>
	<canvas id="fg"></canvas>
</body>
</html>
