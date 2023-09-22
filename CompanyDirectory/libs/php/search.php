<?php


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

	$searchQuery = '%'. $_REQUEST['query']. '%';

	$queryPersonnel = $conn->prepare('SELECT p.* FROM personnel p JOIN department d ON p.departmentID = d.id JOIN location l ON d.locationID = l.id WHERE CONCAT(p.firstName, p.lastName) LIKE ? OR p.firstName LIKE ? OR p.lastName LIKE ? OR d.name LIKE ? OR l.name LIKE ?');

    $queryPersonnel->bind_param("sssss", $searchQuery, $searchQuery, $searchQuery, $searchQuery, $searchQuery);

	$queryPersonnel->execute();
	
	if (false === $queryPersonnel) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = 'Query Personnel Failed';

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

    $resultPersonnel = $queryPersonnel->get_result();

    $searchResultsPersonnel = [];

	while ($rowPersonnel = mysqli_fetch_assoc($resultPersonnel)) {

		array_push($searchResultsPersonnel, $rowPersonnel);

	}

	
	$queryDepartment = $conn->prepare('SELECT d.* FROM department d JOIN location l ON d.locationID = l.id WHERE d.name LIKE ? OR l.name LIKE ?');

    $queryDepartment->bind_param("ss", $searchQuery, $searchQuery);

	$queryDepartment->execute();
	
	if (false === $queryDepartment) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = 'Query Department Failed';

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

    $resultDepartment = $queryDepartment->get_result();

    $searchResultsDepartment = [];

	while ($rowDepartment = mysqli_fetch_assoc($resultDepartment)) {

		array_push($searchResultsDepartment, $rowDepartment);

	}

	$queryLocation = $conn->prepare('SELECT * FROM location WHERE name LIKE ?');

    $queryLocation->bind_param("s", $searchQuery);

	$queryLocation->execute();
	
	if (false === $queryLocation) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = 'Query Location Failed';

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

    $resultLocation = $queryLocation->get_result();

    $searchResultsLocation = [];

	while ($rowLocation = mysqli_fetch_assoc($resultLocation)) {

		array_push($searchResultsLocation, $rowLocation);

	}


	if (empty($searchResultsPersonnel)) {
		$searchResultsPersonnel = false;
	}
	if (empty($searchResultsDepartment)) {
		$searchResultsDepartment = false;
	}
	if (empty($searchResultsLocation)) {
		$searchResultsLocation = false;
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['personnel'] = $searchResultsPersonnel;
	$output['data']['department'] = $searchResultsDepartment;
	$output['data']['location'] = $searchResultsLocation;
	
	
	mysqli_close($conn);

	echo json_encode($output); 

?>