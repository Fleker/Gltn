﻿<!doctype html>
<html manifest="offline.php">
<!--manifest="null.appcache" -->
<head>
<meta charset="utf-8">
<title>Gltn</title>
<meta name="mobile-web-app-capable" content="yes">
<link rel="shortcut icon" sizes="196x196" href="gltn_f.png">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">

<link rel="stylesheet" type="text/css" href="css/standard.css">
<link rel="stylesheet" type="text/css" href="js/IntroJS/introjs.min.css">
<link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
<!--<?php
/*
$server=$_SERVER['HTTP_HOST'];
if(strpos($server, "felkerdigitalmedia") > -1) {
	echo "<script>";
	echo file_get_contents("http://code.jquery.com/jquery-2.0.3.min.js");
	echo file_get_contents("http://code.jquery.com/color/jquery.color-2.1.2.min.js");
	echo file_get_contents("format.js");
	echo file_get_contents("panels.js");
	echo file_get_contents("popup.js");
	echo file_get_contents("file.js");
	echo file_get_contents("build.js");
	echo file_get_contents("hammer.js");
	echo file_get_contents("holoribbon.js");
	echo file_get_contents("kernel.js");
	echo file_get_contents("rangy-1.3alpha.772/rangy-core.js");
	echo file_get_contents("rangy-1.3alpha.772/rangy-cssclassapplier.js");
	echo file_get_contents("rangy-1.3alpha.772/rangy-textrange.js");
	echo file_get_contents("json2xml.js");
	echo file_get_contents("xmlToJson.js");
	echo file_get_contents("IntroJS/intro.js");	
	echo file_get_contents("http://fgnass.github.io/spin.js/dist/spin.min.js");
	echo "</script>";
}
*/
?>-->

<script src="http://code.jquery.com/jquery-2.1.0.js"></script>
<script src="http://code.jquery.com/color/jquery.color-2.1.2.min.js"></script>

<script src="js/format.js"></script>
<script src="js/panels.js"></script>
<script src="js/popup.js"></script>
<script src="js/file.js"></script>
<script src="js/build.js"></script>
<script src="js/hammer.js"></script>
<script src="js/holoribbon.js"></script>
<script src="js/kernel.js"></script>
<script src="js/kernel2.js"></script>
<script src="js/panels_translate.js"></script>
<script src="js/gltnstore.js"></script>


<script src="js/rangy-1.3alpha.772\rangy-core.js"></script>
<script src="js/rangy-1.3alpha.772\rangy-cssclassapplier.js"></script>
<script src="js/rangy-1.3alpha.772\rangy-textrange.js"></script>
<script src="js/rangy-1.3alpha.772\uncompressed\rangy-selectionsaverestore.js"></script>
<script src="js/json2xml.js"></script>
<script src="js/xmlToJson.js"></script>
<script src="js/IntroJS/intro.js"></script>
<script src="http://fgnass.github.io/spin.js/spin.min.js"></script>
<!--<script src="http://fgnass.github.io/spin.js/jquery.spin.js"></script>-->
<script src="http://timeago.yarp.com/jquery.timeago.js"></script>
    
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    showProcessingMessages: false,
    tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
  });
</script>

<link rel="icon" 
      type="image/png" 
      href="images/gltn_f.png">
     
 <script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-24228980-2', 'felkerdigitalmedia.com');
ga('send', 'pageview');

</script>
</head>
<body>

<div class="header" id="header" style="text-align:center">

</div>

<div class="body">
	<div id="panel_content" class="panel">
        <div>
            <!--<i>What Kind of Document do You Want to Create?</i><br>-->
            <!--File Name: <input type="text" id="file_name"><br><span style="font-size:9pt">Your file will be available at edit.php?file={file_name}. This is for the alpha version testing. To access a document, go to that URL. This WILL overwrite existing files so please be careful. Do not use spaces.</span><br>-->
            Format:<input type="text" id="file_format" list="gluten_formats" value="">&emsp;&emsp;Language:<input id="file_language" list="gluten_languages" value="English (US)"><br>
            Tags:<input id="file_tags" placeholder="Comma Separated Tags">
            
            <div id="file_metadata">
            
            </div>
        </div>
      </div>
      
      <div id="panel_plugin" class="panel">  
      	<div class="panel_plugin_title"></div>
        <div class="panel_plugin_content">
    
        </div>
      </div>
</div>
<div class="build" id="build">

</div>
<div id="build_blob" style='display:none'>
       
</div>
<!--<div class="build_progress">

</div>-->
<div class="draft">
<!--This section will be a place between the original content and the final build where HTML tags will still exist-->
</div>
<div class="scale">
<!--This section is used for "Build". It uses pixels to see how high the paper is in inches using this scale-->
LOREM IPS/um o
</div>

<div class="popup " style="display:none">
  
</div>

<div class="hovertag">

</div>
<div class="fullscreenui" style="display:none; opacity:.1" onMouseOver="$('.fullscreenui').css('background-color', fsuo).css('opacity',1)" onMouseOut="$('.fullscreenui').css('background-color', fsuo).css('opacity', '.1');"><div class="fullscreenexit" onclick="normalscreen()"><br><span class="fa fa-times"/><br><br><br></div><div class="fullscreennight fa fa-adjust" onclick="nightscreen()"><br><br><br><br></div> <div class="fullscreencount" style="position:fixed;bottom:1%;left:0px;text-align:center;font-size:10pt;width:45px;"></div></div>
<span class='panelIntent'></span>
<div class="footer">

</div>

<datalist id="gluten_formats"></datalist>

<datalist id="gluten_languages"></datalist>
<iframe id="themeframe" src="" style="visibility:collapse;width:1px;height:1px;"></iframe>
<script>
	
</script>
<script type="text/javascript" src="https://api.filepicker.io/v1/filepicker.js"></script>
</body>
</html>
