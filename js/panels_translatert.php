<?php
$url = "?";
foreach($_GET as $key => $val) {
	$url .= $key."=".$val."&";
}
$url = substr($url, 0, -1);
$url = str_replace(" ", "%20", $url);
echo file_get_contents('http://translate.google.com/translate_a/t'.$url);
?>