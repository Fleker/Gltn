<!doctype html>
<html>
<!--manifest="null.appcache" -->
<head>
<meta charset="UTF-8">
<title>Gltn Editor</title>
<meta name="mobile-web-app-capable" content="yes">
<link rel="shortcut icon" sizes="196x196" href="gltn_f.png">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">

<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">

<script src="http://code.jquery.com/jquery-2.1.1.js"></script>
<script src="http://code.jquery.com/color/jquery.color-2.1.2.min.js"></script>
    
<!-- TODO Minify and look at just what parts of angular are good v. Polymer or other libraries -->
<script src='//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.13/angular.min.js' type='text/javascript'></script>
<script src='//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0-beta.13/angular-sanitize.min.js'></script>
<script src='//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.20/angular-route.min.js'></script>
    
<!--Polymer Data Bind-->
<script src='components/platform/platform.js'></script>
<link rel="import" href="components/polymer/polymer.html">
    
<!--Filepicker-->
<script type="text/javascript" src="https://api.filepicker.io/v1/filepicker.js"></script>

<script src="js/kernel.js"></script>
<script src="js/editor.js"></script>
<script src="js/file.js"></script>
<script src="js/format.js"></script>
<script src="js/panels.js"></script>
<script src="js/popup.js"></script>
<script src="js/build.js"></script>
<script src="js/holoribbon_foundation.js"></script>
<script src="store/secure/gltnstore.js"></script>

<script src="js/rangy-1.3alpha.772\rangy-core.js"></script>
<script src="js/rangy-1.3alpha.772\rangy-cssclassapplier.js"></script>
<script src="js/rangy-1.3alpha.772\rangy-textrange.js"></script>
<script src="js/rangy-1.3alpha.772\uncompressed\rangy-selectionsaverestore.js"></script>
<script src="js/json2xml.js"></script>
<script src="js/xmlToJson.js"></script>
    
<!--Timeago.js-->
<script src="http://timeago.yarp.com/jquery.timeago.js"></script>
    
<!--Spin.js-->
<script src="http://fgnass.github.io/spin.js/spin.min.js"></script>
<script src="http://fgnass.github.io/spin.js/jquery.spin.js"></script>
    
<!--Mathjax-->
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    showProcessingMessages: false,
    tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
  });
</script>
    
<!--Together.js-->
<script src="js/togetherjs/togetherjs.js"></script>
    <script>
      TogetherJSConfig_findRoom = {prefix: "togetherjsmadlibs", max: 5};
      TogetherJSConfig_autoStart = true;
      TogetherJSConfig_suppressJoinConfirmation = true;
      TogetherJSConfig_storagePrefix = "tjs_madlibs";
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

<link rel="stylesheet" type="text/css" href="css/standard.css">
</head>

<body ng-app="Gltn" ng-cloak data-controller="AppManager"><!--<template id='appDisplay' is='auto-binding'>-->
<div class="header" id="header" style="text-align:center;max-width:auto;"></div>

<div class="main row" style="min-width:100%;width:100%;">
	<div id="panel_content" class="small-12 columns">
        <div class="row">
            <div class="small-12 medium-6 large-3 column">
                <label><span id='meta_format'></span>{{HELLO}}:
                    <input type="text" id="file_format" list="gluten_formats" value="MLA">
                </label>
            </div>
            <div class="small-12 medium-6 large-3 column">
                <label><span id='meta_lang'></span>{{NOLO}}:
                    <input type="text" id="file_language" list="gluten_languages" value="English (US)">
                </label>
            </div>
            <div class='small-6 large-6 column'>
                <label><span id='meta_tags'></span>:
                    <input type="text" id="file_tags" class="small-9 columns" placeholder="{{MATYPL}}">
                </label>
            </div>

            <div id="file_metadata" class='small-12 column'>
            
            </div>
        </div>
      </div>
      
      <div id="panel_plugin" class="small-0 columns">  
        <div class="panel_plugin_title" style="margin-top:-10px"></div>
        <div class="panel_plugin_content"></div>
      </div>
</div>
    
<div class="build" id="build">

</div>
<div id="build_blob" style='display:none'>
       
</div>
<div class="draft">
<!--This section will be a place between the original content and the final build where HTML tags will still exist-->
</div>
<div class="scale">
.
</div>

<div class="popup reveal-model" id="popup" data-reveal></div>
    
    <div id="myModal" class="reveal-modal" data-reveal>
</div>
<div class="fullscreenui" style="display:none;"><button class="fullscreenexit" onclick="normalscreen()"><span class="fa fa-times"/></button><br><br><br><br><button class="fullscreennight" onclick="nightscreen()"><span class='fa fa-adjust'></span></button> <div class="fullscreencount" style="position:fixed;bottom:1%;left:0px;text-align:center;font-size:10pt;width:45px;"></div></div>
<span class='panelIntent'></span>
    
<div class="footer"></div>

<datalist id="gluten_formats"></datalist>
<datalist id="gluten_languages"></datalist>
    
<iframe id="themeframe" src="" style="visibility:collapse;width:1px;height:1px;"></iframe>


        
    
<!--</template>-->
<!--TODO Mark as Offline -->
<script src="js/foundation/foundation.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/foundation/5.3.0/js/foundation/foundation.reveal.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/foundation/5.3.0/js/foundation/foundation.tooltip.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/foundation/5.3.0/js/vendor/fastclick.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/foundation/5.3.0/js/vendor/modernizr.js"></script>
<link rel="stylesheet" href="css/normalize.css">
<link rel="stylesheet" href="css/foundation.css">    
</body>
</html>
