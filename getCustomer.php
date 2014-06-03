<?php
	header('Content-type: application/json');
	
	if(isset($_POST['username']) && isset($_POST['password']))
	{ 
		$username = $_POST['username'];
		$password = $_POST['password'];

		$db = new PDO('mysql:host=localhost;dbname=sdisdb;charset=utf8', 'root', 'sdis2048');
		
		$ourQuery = "SELECT * FROM users WHERE username=" . $username . "AND password=" . $password;

		$intermidiateResult = $db->query($ourQuery);

		if( $intermidiateResult == FALSE )
		{
			$result = array();
		}
		else
		{
			$result = $intermidiateResult->fetchall(PDO::FETCH_ASSOC);
		}
	
		if( $result === null )
		{
			$result = array("error" => array("code" => 404,"reason" => "Not Found",));
			echo json_encode($result, JSON_PRETTY_PRINT);
		} 
		else
		{
			$result = array("success" => array("code" => 200,"reason" => "Register Successful",));
			session_start();
			$_SESSION["username"] = $result["username"];
			$_SESSION["email"] = $result["email"];
			$_SESSION["gamesplayed"] = $resulta["gamesplayed"];
			echo json_encode($result, JSON_PRETTY_PRINT);
		}
	} 
	else 
	{
		$result = array("error" => array("code" => 400,"reason" => "Bad Request",));
		echo json_encode($result, JSON_PRETTY_PRINT);
	}
?>