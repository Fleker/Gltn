
## Wikipedia 
This is the PHP script that is used for the Wikipedia HTML Dictionary. This is the only file necessary for it to work.

```PHP
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
if(strpos($check[16], "404") === false && strpos($check[0], "404") === false) {
	$out = file_get_contents('http://en.wikipedia.org/wiki/'.$w, false, $context);
	$out = str_replace('a href="/wiki/', 'a href="http://felkerdigitalmedia.com/gltn/dictionaries/dictionary_wiki.php?word=', $out);
}
else
	$out = "404";	

echo $out;
?>
```

### User Agent
The User Agent is set to an Android device running Chrome. This means that Wikipedia should provide the mobile version of its site so users can get a more optimized interface.

### $check
The script checks the headers returned from the search query. If there is a 404 error, that means that Wikipedia doesn't have the query provided. Thus, an alternative to the 404 page should be returned

### /wiki/
An iframe issue is that unspecific links don't go to the website in the iframe but the website containing the iframe. Therefore, any Wikipedia links would try to go to felkerdigitalmedia.com/gltn/wiki/... 

A str_replace method is called to replace those instances with another PHP page.