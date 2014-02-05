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
$check = get_headers('http://translate.google.com/m/translate');
//print_r($check);
if(strpos($check[16], "404") === false && strpos($check[0], "404") === false) {
	$out = file_get_contents('http://translate.google.com/m/translate', false, $context);
	//$out = str_replace('<a href="//en.wikipedia.org/wiki/', '<a href="http://felkerdigitalmedia.com/gltn/dictionary_wiki.php?word=', $out);
	$out = str_replace('/translate/', 'http://translate.google.com/translate/', $out);
	$out = str_replace('/translate_a/', 'http://translate.google.com/translate_a/', $out);
	$p = '<script src="http://translate.google.com/translate/releases/twsfe_w_20140127_RC01/r/js/translate_m.js"></script>';
	$q = '<style>#og_head { opacity:0;visibility:hidden;height:0px} body { background-color:#eee } .CSS_IMG_TTS_BUTTON { opacity: 0}</style>';
	$out = str_replace($p, '<script src="panels_translaters.js"></script>'.$q, $out);
}	
else
	$out = "404";	
	
	//$out = $check;
echo $out;
?>