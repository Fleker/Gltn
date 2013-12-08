<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Project Gltn</title>
<link href='http://fonts.googleapis.com/css?family=Roboto:400,400italic,700,700italic' rel='stylesheet' type='text/css'>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>
<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
<link href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>

<body>
 <div class="collapse navbar-collapse naving" id="bs-example-navbar-collapse-1" style="background-color:#ddd">
    <ul class="nav navbar-nav">
      <li><a href="#panels">Panels</a></li>
      <li><a href="#immersion">Immersion</a></li>
      <li><a href="#intuitiveness">Intuitiveness</a></li>
      <li><a href="#open">Open Source</a></li>
      </ul></div>
<div class="container center-block row">
	<h1><span class="fa fa-file"></span>&nbsp;Gltn <br><small>Don't Live Gluten Free Any Longer!</small></h1>
	<button type="button" class="btn btn-success btn-large" onclick="window.location='edit.php?file=abc'">Check it Out</button>
    <table><tr><td style="text-align:justify"><h5>Gluten is an end-to-end document editor made for students, businessmen, and anyone else who wastes time with fomrats. With a simple GUI, it automatically generates a paper that is completely formatted. Come on, that's pretty awesome.<br><br><br><span style="font-size:9pt">Gltn is still in development. Some parts of it may drastically change as it continues to grow and add more features. This is a beta version. Not everything may work all the time. Alert <a href="mailto:handnf+gluten@gmail.com">the developer</a> or message me <a href="http://twitter.com/handnf" target="_blank">@HandNF</a> (preferrably with a console output) if there is a bug or feature you want.</span></h5></td>
    
    <td style="padding-left:10px"><div class="center"><iframe width="560" height="315" src="//www.youtube.com/embed/u8pWw-RAQEk" frameborder="0" allowfullscreen></iframe></td></tr></table>  
    </div>
     <!-- <div id="citations" style="background-color:#09f;height:100%;">
    	<h1>Citations<br><small>In-Line Citations and Bibliographies automatically generated</small></h1>
        <div class="center"><img src="ideapanel.png" style="max-height:85%"></div>
    </div>-->
    <div id="panels" class="page row" style="background-color:#e7842c;">
    	<h1>Panels<br></h1><h3>Side-by-Side Content; Yep, it's that easy.</h3>
        <div class="center"><img src="ideapanel.png" class="promo"></div>
        <h4><b>Idea Panel</b>- You can write down notes for each source when you're doing research. Later, you can elaborate on your ideas while looking at your original notes.</h4>
    </div>
    <div id="immersion" class="page row" style="background-color:#7f8c8d;">
    	<h1>Immersion<br></h1><h3>Fullscreen Mode? Check. Night Mode? Also Check.</h3>
        <div class="center"><img src="darkfullscreen.png" class="promo"></div>
        <h4><b>Fullscreen</b>- Instead of buttons and icons, get rid of the UI and focus just on what you're writing.</h4>
    </div>
    <div id="intuitiveness" class="page row" style="background-color:#e74c3c;">
    	<h1>Intuitiveness<br></h1><h3>Plug and Play Essays; Never simpler</h3>
        <div class="center"><img src="intuitive.png" class="promo"></div>
        <h4><b>Plug and Play</b>- You know your name. Don't fret the small formatting issues. You focus on writing, and we'll take care of the small stuff.</h4>
    </div>
    <div id="open" class="page row" style="background-color:#2ecc71;">
    	<h1>Open Source<br></h1><h3>Let's All Make it Better</h3>
        <!--<div class="center"><img src="intuitive.png" class="promo"></div>-->
        <h4><b>Help Wanted!</b>- I believe in this project, but to get the growth it needs, I'll need your help. Everything is available to use on GitHub. Build panels, design formats, do anything you want. Just contribute your improvements back to the community.</h4><br><br>
        <a href="https://github.com/Fleker/Gluten" target="_blank">Gltn @ GitHub</a>
        <br>
       	It's very easy to get started! Plus, the Wiki is filled with documentation, so you won't get lost.<br>
        <h4>Create a Panel</h4>
        <pre>
        function getPanel{name}() {
            	return {title: "Document Notes", bordercolor: "#f1c40f", width: 40};	
            }
            function runPanel{name}() {
            	postPanelOutput("Hello World");
            	//code here
            }	
        </pre>
        <h4>Design a Format</h4>
        <pre>
        function onInitFormat() {
            new_format();
            new_format_item("text", {label: "Your Name", id:"Author"});
            new_format_item("text", {label: "Title", id: "Title"});
            new_format_item("text", {label: "Professor/Teacher", id:"Professor"});
            new_format_item("text", {label: "Class", id: "Class"});
            new_format_item("date", {label: "Date Due", id: "DueDate"});
            new_format_item("content");
            post_format();		
        }
        </pre>
    </div>
</div>	
<style>
body {
	overflow-x:hidden;	
}
pre {
	width:95%;	
}
.center {
	text-align:center;
}
a {
	color:#05a;	
}
.page {
	width: 102%;
left: -1%;
padding-left: 5%;
height:100%;
}
.promo {
	max-width:96%;	
	max-height:80%;
}
</style>
</body>
</html>