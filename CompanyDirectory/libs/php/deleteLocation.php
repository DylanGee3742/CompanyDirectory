<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

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

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production
	$containsDepartment = $conn->prepare('SELECT * FROM department WHERE locationID = ?');
	$containsDepartment ->bind_param("i", $_REQUEST['id']);
	$containsDepartment ->execute();

	if (false === $containsDepartment ) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "containsDepartment failed";	
		$output['data'] = 'Query Failed';

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	} else {

		$result = $containsDepartment->get_result();

   		$containsDepartmentResult = mysqli_fetch_assoc($result);

		if (!empty($containsDepartmentResult)) {
			
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "Integrity Constraint Violation";
			$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
			$output['data'] = 'Integrity Constraint Violation';
	
		mysqli_close($conn);

		echo json_encode($output); 

		exit;
		
	} else {

	$query = $conn->prepare('DELETE FROM location WHERE id = ?');
	
	$query->bind_param("i", $_REQUEST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = 'Location Successfully Deleted';
	
	mysqli_close($conn);

	echo json_encode($output); 

	}

}

?>