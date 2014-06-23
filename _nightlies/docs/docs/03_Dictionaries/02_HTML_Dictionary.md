### HTML
This set of guidelines are for the HTML format for dictionaries

#### Request
The dictionary sends a GET request to the url provided with the single parameter of word with a value of the current search contents. A PHP page should be created that will take `$_GET['word']` and search for the given request, returning a webpage at the end.

#### Generating HTML
In the url provided, the current HTML must be generated. An iframe will be generated with the url provided in the form {url}?word={search}.

You may consider altering the user agent to return a mobile version of the site is returned in order to take advantage of the smaller screen size of the dictionary panel.

```PHP
$w = $_GET['word'];
$w = str_replace(' ', '%20', $w);

$opts = array(
    'http' => array(
        'user_agent' => 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML,     like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
        'method' => 'GET',
        'header' => 'Accept-language: en' . "\r\n" . 
                    'Cookie: foo=bar' . "\r\n",
    )
);
$context = stream_context_create($opts);

$out = file_get_contents('http://en.wikipedia.org/wiki/' . $w, false, $context);
```

#### Error Handling
If a given word is not available in your dictionary, instead of returning HTML, return "404" instead. This will indicate to the dictionary manager that a word is not available. The manager will move on to the next dictionary or return no results.