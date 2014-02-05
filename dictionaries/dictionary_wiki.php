<?php
$w = $_GET['word'];
$w = str_replace(" ", "%20", $w);
$opts = array(
  'http'=>array(
    'user_agent'=>'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
	'method'=>"GET",
    'header'=>"Accept-language: en\r\n" .
              "Cookie: foo=bar\r\n"
  )
);

$context = stream_context_create($opts);
$check = get_headers('http://en.wikipedia.org/wiki/'.$w);
//print_r($check);
if(strpos($check[16], "404") === false && strpos($check[0], "404") === false) {
	$out = file_get_contents('http://en.wikipedia.org/wiki/'.$w, false, $context);
	//$out = str_replace('<a href="/wiki', '<a href="http://en.wikipedia.org/wiki', $out);
	$out = str_replace('<a href="/wiki/', '<a href="http://felkerdigitalmedia.com/gltn/dictionary_wiki.php?word=', $out);
}
else
	$out = "404";	
	
	//$out = $check;
echo $out;
?>