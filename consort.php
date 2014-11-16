<!DOCTYPE html>
<?php
if (isset($_POST["user"]) || trim($_POST["user"]) == "") {
	header("index.html");
	die();
}

$req = new HttpRequest('http://attu4.cs.washington.edu:33333/SessionServer', HttpRequest::METH_POST);
$req -> addPostFields(array('user' => '$_POST["user"]', 'platform' => 'browser'));

?>
<html>
<head>
	<title>Consort</title>
</head>
<body>
<?php
try {
	echo $req->send()->getBody();
} catch (HttpException $err) {
	echo $err
}
?>
</body>
</html>
