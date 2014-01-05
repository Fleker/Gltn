<?php
$w = $_GET['word'];
$opts = array(
  'http'=>array(
    'user_agent'=>'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5',
	'method'=>"GET",
    'header'=>"Accept-language: en\r\n" .
              "Cookie: foo=bar\r\n"
  )
);

$context = stream_context_create($opts);
$out = file_get_contents('http://en.wikipedia.org/wiki/'.$w, false, $context);
echo $out;
?>