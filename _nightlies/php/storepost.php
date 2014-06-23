<?php
//phpinfo();
error_reporting(E_ALL);
ini_set('display_errors','On');
//echo getcwd();

if(!isset($_GET['action'])) {
	$_GET['action'] = 'Uninstall';
}
if(!isset($_GET['item'])) 
	$_GET['item'] = 'Nothing';
$file = fopen("D:/Hosting/2425934/html/gltn/storedata.txt","a+");
/*
fwrite($file,$_GET['action'].":  ".$_GET['item'].", ".time()."\n\r");
*/

	$url = '../store/storebackend.xml';
	
	$fileContents = file_get_contents($url);
	$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
	$fileContents = trim($fileContents);
	$simpleXml = simplexml_load_string($fileContents);
	$json = json_encode($simpleXml);
	$jsond = json_decode($json);
	
	//echo $json."<br><br>";	
	//print_r($jsond);
	//echo "<br><br>Searching for $word...";
	$index = 0;
	foreach($jsond->app as $i) {
		//echo "<br>is it $i->name ?";
		if(strtolower($i->id) == strtolower($_GET['item'])) {
			if($_GET['action'] == 'Download')
				$jsond->app[$index]->install = $i->install+1;
			else
				$jsond->app[$index]->uninstall = $i->uninstall+1;
		}
		//print_r($jsond->app[$index]);
		//echo $index."; "."<br><br>";
		$index++;
	}
	//echo json_encode($jsond);	


echo $_GET['action'].":  ".$_GET['item'].", ".time()."<br><br><br><br>";

// creating object of SimpleXMLElement
$xml_student_info = new SimpleXMLElement("<?xml version=\"1.0\"?><gltn_store></gltn_store>");

// function call to convert array to xml
array_to_xml($jsond->app,$xml_student_info);

//saving generated xml file
$xml_student_info->asXML('storebackend.xml');


// function defination to convert array to xml
function array_to_xml($student_info, &$xml_student_info) {
    foreach($student_info as $key => $value) {
		if(is_object($value)) {
			$value = get_object_vars($value);	
		}
		//print_r($value);
		//echo "<br><br>";
		if(is_array($value)) {
			echo $key.":";
			print_r($value);
			echo "<br><Br><br>"	;
           if(!is_numeric($key)){
                $subnode = $xml_student_info->addChild("$key");
                array_to_xml($value, $subnode);
           }
           else{
               $subnode = $xml_student_info->addChild("app");
			   echo ":".$subnode."<br>";
               array_to_xml($value, $subnode);
            }
        }
        else {
            $xml_student_info->addChild("$key","$value");
        }
    }
}
echo "<br>".file_get_contents('file path and name.txt');
fclose($file);
?>