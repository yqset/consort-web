<!DOCTYPE html>
<?php
session_start();
if (isset($_SESSION["user"]) && isset($_SESSION["session"])) {
	header('Location: consort-game.php');
	die();	
} else if (isset($_SESSION["user"])) {
	$user_name = $_SESSION["user"];
} else if (isset($_POST["user"]) || trim($_POST["user"]) != "") {
	$user_name = $_POST["user"];
	$_SESSION["user"] = $user_name;
} else {
	header('Location: index.php');
	die();	

}
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
	<link rel="stylesheet" type="text/css" href="consort.css" />
</head>
<body>
	<div id="jsonArea">
	</div>
	<form action="consort-game.php" method="POST">
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
		<input type="submit" value="Join">
	</form>
	<br />
	<form action="logout.php">
		<input type="submit" value="Log out">
	</form>
</body>
</html>
