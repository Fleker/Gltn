<?php
	$word = $_GET['word'];
	$url = 'dictionarydb.xml';
	
	$fileContents = file_get_contents($url);
	$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
	$fileContents = trim(str_replace('"', "'", $fileContents));
	$simpleXml = simplexml_load_string($fileContents);
	$json = json_encode($simpleXml);
	$jsond = json_decode($json);
	$error = '{"error":"404"}';
	
	//echo $json."<br><br>";	
	//print_r($jsond);
	//echo "<br><br>Searching for $word...";
	foreach($jsond->word as $i) {
		//echo "<br>is it $i->name ?";
		if(strtolower($i->name) == strtolower($word)) {
			$i->credit = $jsond->credit;
			echo json_encode($i);	
			die();
		}
		$plural_array = explode(";", $i->plural);
		foreach($plural_array as $plural) {
			if(strtolower($plural) == strtolower($word)) {
				echo json_encode($i);	
				die();
			}
		}
	}
	echo $error;
?>