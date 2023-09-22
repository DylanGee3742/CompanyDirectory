<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertPersonnel.php?firstName=John&lastName=Doe&jobTitle=Manager&email=exampleemail@gmail.co.uk&departmentID=2

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	// this includes the login details
	
	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	


	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	//Check if the person already exists using email (should be unique)
	$alreadyExists = $conn->prepare('SELECT * FROM personnel WHERE email = ?');
	$alreadyExists->bind_param("s", $_REQUEST['email']);
	$alreadyExists->execute();

	if (false === $alreadyExists) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "alreadyExists failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	} else {

		$result = $alreadyExists->get_result();

   		$person = mysqli_fetch_assoc($result);


		//If there are any results then user already exists 
	if (!empty($person)) {

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = 'User already exists';
	
	mysqli_close($conn);

	echo json_encode($output); 

	exit;

	} else {

		//User doesnt exist, insert them into personnel table
	$query = $conn->prepare('INSERT INTO personnel (`firstName`, `lastName`, `jobTitle`, `email`, `departmentID`) VALUES (?,?,?,?,?)');

	$query->bind_param("ssssi", $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['jobTitle'], $_REQUEST['email'], $_REQUEST['department_id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = 'Query Failed';

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = 'User Successful Added';
	
	mysqli_close($conn);

	echo json_encode($output); 

	}

}

?>