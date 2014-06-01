<?php
	header('Content-type: application/json');
	
	if(isset($_GET['username']))
	{ 
		$username = $_GET['username'];

		$db = new PDO('mysql:host=localhost;dbname=sdisdb;charset=utf8', 'root', 'sdis2048');
		
		$ourQuery = "SELECT * FROM users WHERE username=" . $username;

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
			echo json_encode($result, JSON_PRETTY_PRINT);
		}
	} 
	else 
	{
		$result = array("error" => array("code" => 400,"reason" => "Bad Request",));
		echo json_encode($result, JSON_PRETTY_PRINT);
	}
?>