<?php
	header('Content-type: application/json');
	
	if(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['email']))
	{ 
		$username = $_POST['username'];
		$password = $_POST['password'];
		$email = $_POST['email'];

		$db = new PDO('mysql:host=localhost;dbname=sdisdb;charset=utf8', 'root', 'sdis2048');
		$ourQuery =  "INSERT INTO `sdisdb`.`users` (`username`, `password`, `email`, `gamesplayed`) VALUES ('" .$username. "', '" . $password . "', '" . $email ."',0)";

		$intermidiateResult = $db->query($ourQuery);
		

		if( $intermidiateResult == FALSE )
		{
			$result = array("error" => array("code" => 404,"reason" => "Not Found",));
			echo json_encode($result, JSON_PRETTY_PRINT);
		}
		else
		{
			$result = array("error" => array("code" => 200,"reason" => "Register Successful",));
			session_start();
			$_SESSION["username"] = $result["username"];
			echo json_encode($result, JSON_PRETTY_PRINT);
		}
		
	} 
	else 
	{
		$result = array("error" => array("code" => 400,"reason" => "Bad Request",));
		echo json_encode($result, JSON_PRETTY_PRINT);
	}
?>