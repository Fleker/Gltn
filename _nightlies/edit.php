<!doctype html>
<html>
<!--manifest="null.appcache" -->
<head>
<meta charset="utf-8">
<title>Gltn Editor</title>
<meta name="mobile-web-app-capable" content="yes">
<link rel="shortcut icon" sizes="196x196" href="gltn_f.png">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">

<link href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

<script src="http://code.jquery.com/jquery-2.1.0.js"></script>
<script src="http://code.jquery.com/color/jquery.color-2.1.2.min.js"></script>

<script src="js/format.js"></script>
<script src="js/panels.js"></script>
<script src="js/popup.js"></script>
<script src="js/file.js"></script>
<script src="js/build.js"></script>
<script src="js/hammer.js"></script>
<script src="js/holoribbon_foundation.js"></script>
<script src="js/kernel.js"></script>
<script src="js/editor.js"></script>
<script src="js/gltnstore.js"></script>


<script src="js/rangy-1.3alpha.772\rangy-core.js"></script>
<script src="js/rangy-1.3alpha.772\rangy-cssclassapplier.js"></script>
<script src="js/rangy-1.3alpha.772\rangy-textrange.js"></script>
<script src="js/rangy-1.3alpha.772\uncompressed\rangy-selectionsaverestore.js"></script>
<script src="js/json2xml.js"></script>
<script src="js/xmlToJson.js"></script>
<script src="http://timeago.yarp.com/jquery.timeago.js"></script>
<script src="http://fgnass.github.io/spin.js/spin.min.js"></script>
<script src="http://fgnass.github.io/spin.js/jquery.spin.js"></script>
    
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
    
<!-- Mark as Offline -->
    <script src="js/foundation/foundation.js"></script>
    <script src="js/foundation/foundation.reveal.js"></script>
    <script src="js/foundation/foundation.tooltip.js"></script>
    <script src="js/foundation/vendor/fastclick.js"></script>
    <script src="js/foundation/vendor/modernizr.js"></script>
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/foundation.min.css">
    
<link rel="stylesheet" type="text/css" href="css/standard.css">
</head>
<body>

<div class="header" id="header" style="text-align:center;max-width:auto;">

</div>

<div class="main row" style="min-width:100%;width:100%;">
	<div id="panel_content" class="small-12 columns">
        <div class="row"><!--<fieldset><legend>Start Your Document</legend>-->
            <div class="small-12 medium-6 large-3 column">
                <label>Format:
                    <input type="text" id="file_format" list="gluten_formats" value="MLA">
                </label>
            </div>
            <div class="small-12 medium-6 large-3 column">
                <label>Language:
                    <input type="text" id="file_language" list="gluten_languages" value="English (US)">
                </label>
            </div>
            <div class='small-6 large-6 column'>
                <label>Tags:
                    <input type="text" id="file_tags" class="small-9 columns" placeholder="Comma Separated Tags">
                </label>
            </div>

            <div id="file_metadata" class='small-12 column'>
            
            </div>
        <!--</fieldset>--></div>
      </div>
      
      <div id="panel_plugin" class="small-0 columns">  
        <div class="panel_plugin_title" style="margin-top:-15px"></div>
        <div class="panel_plugin_content"></div>
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
.
</div>

<div class="popup reveal-model" id="popup" data-reveal></div>
    
    <div id="myModal" class="reveal-modal" data-reveal>
  <h2>Awesome. I have it.</h2>
  <p class="lead">Your couch.  It is mine.</p>
  <p>Im a cool paragraph that lives inside of an even cooler modal. Wins</p>
  <button class="close-reveal-modal">&#215;</button>
</div>

<div class="hovertag">

</div>
<div class="fullscreenui" style="display:none; opacity:.1" onMouseOver="$('.fullscreenui').css('background-color', fsuo).css('opacity',1)" onMouseOut="$('.fullscreenui').css('background-color', fsuo).css('opacity', '.1');"><div class="fullscreenexit" onclick="normalscreen()"><br><span class="fa fa-times"/><br><br><br></div><div class="fullscreennight fa fa-adjust" onclick="nightscreen()"><br><br><br><br></div> <div class="fullscreencount" style="position:fixed;bottom:1%;left:0px;text-align:center;font-size:10pt;width:45px;"></div></div>
<span class='panelIntent'></span>
    
<div class="footer"></div>

<datalist id="gluten_formats"></datalist>
<datalist id="gluten_languages"></datalist>
    
<iframe id="themeframe" src="" style="visibility:collapse;width:1px;height:1px;"></iframe>
<script>
	
</script>
<script type="text/javascript" src="https://api.filepicker.io/v1/filepicker.js"></script>
</body>
</html>
