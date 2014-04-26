
## Sample XML Dictionary

```PHP
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
	
	foreach($jsond->word as $i) {
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
```

### $plural_array
If the word doesn't match exactly, then it shouldn't fail. It should check if your word is a plural of a given word. After all, octopi is the same thing as octopus.

### Die
This PHP script searches through every item in the xml file. If it discovers the correct word, then it returns a JSON representation of that word and exits the script. If, at the end, there is no word found, it returns the error variable.