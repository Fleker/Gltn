<?php

// Add the correct Content-Type for the cache manifest
header('Content-Type: text/cache-manifest');
echo "CACHE MANIFEST\n";
echo "# version 1.1.1.4.AF".count($_GET)."\n\n";
echo "CACHE:\n";

echo "APA.js\n";
			//echo "null.js\n";
	echo "build.js\n";
	echo "file.js\n";
	echo "format.js\n";
echo "hammer.js\n";
echo "holoribbon.js\n";
echo "IntroJS/intro.js\n";
echo "IntroJS/introjs.min.css\n";
echo "json2xml.js\n";
	echo "kernel.js\n";
echo "MLA.js\n";
	echo "panels.js\n";
	echo "popup.js\n";
echo "standard.css\n";
echo "xmlToJson.js\n";

/* Other Javascript Files loaded elsewhere */
echo "http://code.jquery.com/jquery-2.0.3.min.js\n";
echo "http://code.jquery.com/color/jquery.color-2.1.2.min.js\n";
echo "rangy-1.3alpha.772/rangy-core.js\n";
echo "rangy-1.3alpha.772/rangy-cssclassapplier.js\n";
echo "rangy-1.3alpha.772/rangy-textrange.js\n";
echo "rangy-1.3alpha.772/uncompressed/rangy-selectionsaverestore.js\n";
echo "http://fgnass.github.io/spin.js/spin.min.js\n";
echo "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css\n";

//ALL THE FONT
echo "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/fonts/fontawesome-webfont.eot?v=4.0.3 \n";
echo "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/fonts/fontawesome-webfont.eot?#iefix&v=4.0.3 \n";
echo "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/fonts/fontawesome-webfont.woff?v=4.0.3 \n";
echo "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/fonts/fontawesome-webfont.svg?v=4.0.3#fontawesomeregular \n";  

$g = $_GET;
foreach($g as $i) {
	echo $i."\n";
}

echo "gltn_f.png\n";

echo "\nNETWORK:\n";
//Gather up all the other potential files
//echo "/ \n";
echo "* \n";

echo "\nFALLBACK:\n";
echo "panels_translate.js offlineload.js"

?>