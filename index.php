<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Gltn - Write Better</title>
<meta name="mobile-web-app-capable" content="yes">
<link rel="shortcut icon" sizes="196x196" href="gltn_f.png">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">

<link href='http://fonts.googleapis.com/css?family=Roboto:400,400italic,700,700italic' rel='stylesheet' type='text/css'>
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap-theme.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
<script src="https://netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>
<script src="xmlToJson.js"></script>
<link href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
<link rel="icon" 
      type="image/png" 
      href="gltn_f.png">
      
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-24228980-2', 'felkerdigitalmedia.com');
  ga('send', 'pageview');

</script>
</head>

<body>
<div id="filesys" style="width:100%;margin-left:0px;margin-top:0px;background-color:rgba(0,128,255,0.5);height:75%;visibility:collapse;padding-left:15px;overflow-y:auto">

</div>
<script>
function post(out,term,kb) {
		if(kb > 0)
			$('#filesys').html(out).css('visibility', 'visible').css('height', (window.innerHeight*.55)+"px");
		$('#filesys_s').on('input', function() {
			console.log(1);
			resetFolder($('#filesys_s').val());
		});
		$('#filesys_s').focus();
		$('#filesys_s').val(term);	
		$('.tfile').on('click', function() {
			if($('.Filesys_delete').attr('data-end') != "true")
				wl($(this).attr('data-v'));
		});
}
function wl(i) {
		c('?file='+i);
		window.location = 'edit.php?file='+i;	
	}
function c(t) {
	console.log(t);
}	
function resetFolder(term) {
		if(term == undefined)
			sterm = "";
		else
			sterm = term.toLowerCase();
		out = "&emsp;You already have files. Access them below.<br><span class='fa fa-search'></span>&nbsp;<input type='search' id='filesys_s' style='width:85%' value='"+sterm+"'><table style='width:100%'>";
		fstotal = 0;
		for(i in localStorage){
			c(i);
			if(localStorage[i] != undefined && localStorage[i+"_c"] != undefined) {
				//We've got something!
				var title = "";
				try {
					var xx = $.xml2json(localStorage[i]);
					title = localStorage[i].indexOf("<id>Title</id>");
				} catch(e) {
					c(e.message);
					continue;
				}
				if(title > -1) {
					var title2 = localStorage[i].substring(title);
					var t3 = title2.indexOf("<value>")+7;
					var t4 = title2.indexOf("</value>");
					var t5 = title2.substring(t3,t4);
					c(title2);
					c(t3);
					c(t4);
					c(t5);
				}
				if(t5 == undefined)
					t5 = "";
				bgc = '#ecf0f1';
				var fsi = localStorage[i].length;
				var fsci = localStorage[i+"_c"].length;
				fstotal += fsi;
				fstotal += fsci;
				var fsout = Math.round((fsi+fsci)/100)/10+"KB";
				//console.log(xx.file.tags.split(','),sterm)
				if(sterm == undefined || (sterm != undefined  && (t5.toLowerCase().indexOf(sterm) > -1) || i.toLowerCase().indexOf(sterm) > -1 || xx.file.tags.indexOf(sterm) > -1)) {
					try {
						var y = xx.file.format;
					} catch(e) {
						console.error(e.message);
						continue;
					}
					out += "<tr><td class='tfile' style='background-color:"+bgc+";border:solid 1px #2c3e50;padding-bottom:8px;width:98%;cursor:pointer;' data-v='"+i+"'><table style='font-size:7pt;font-family:sans-serif;width:100%;'><tr><td style='text-align:left'><span style='font-size:8pt' class='fa fa-file-text'></span>&nbsp;"+i+".gltn</td><td style='text-align:center;width:20px' class='Filesys_delete' data-f='"+i+"'><!--X--></td></tr></table>";
					if(t5 != undefined)
						out += "<div style='margin-left:3px'><b>"+t5+"</b></div>";	
					out += "<span style='font-size:8pt'>&emsp;"+xx.file.format+"&nbsp;&nbsp;"+xx.file.language+"&nbsp;&nbsp;"+fsout+"</span>";	
					out += "</td></tr>";	
				}
			}	
		}
		out += "</table>";
		fstotal += localStorage['settings'].length;
		fstotalout = "<span style='font-size:10pt'>&emsp;"+Math.round(fstotal/100)/10+"KB stored</span>"
		out += fstotalout;
		post(out,term,fstotal);
		//setTimeout("post(out);", 50);
	}	
	resetFolder();
</script>
 <div class="collapse navbar-collapse naving" id="bs-example-navbar-collapse-1" style="background-color:#ddd">
    <ul class="nav navbar-nav">
      <li><a href="#intelligence">Intelligence</a></li>
      <li><a href="#citations">Citations</a></li>
      <li><a href="#panels">Panels</a></li>
      <li><a href="#immersion">Immersion</a></li>
      <li><a href="#intuitiveness">Intuitiveness</a></li>
      <li><a href="#html">Web App</a></li>
      <li><a href="#open">Open Source</a></li>
      <li><a href="http://www.github.com/Fleker/Gluten">GitHub</a></li>
      </ul></div>
      <a style="visibility:collapse" href="https://plus.google.com/110319342351519403865" rel="publisher">Google+</a>
<div class="container center-block row">
	<h1><img src='gltn.png' style='height:48px'></span>&nbsp;Gltn <br><small>Don't Live Gltn-Free Any Longer!</small></h1>
	<button type="button" class="btn btn-success btn-large" onclick="window.location='edit.php?file=abc'">Check it Out</button>
    <div class=''><table class=''><tr><td style="text-align:justify"><h5>Gltn is an end-to-end document editor made for students, businessmen, and anyone else who wastes time with formats. With a simple interface, it generates a paper that is completely formatted. Come on, that's pretty awesome.</h5>
    <h5>Made by Nick, <a href="http://twitter.com/handnf" target="_blank">@HandNF</a></h5>  
    
    <br>
    <div class="g-follow" data-annotation="bubble" data-height="24" data-href="//plus.google.com/110319342351519403865" data-rel="publisher"></div>
<br>
    <div class="fb-like" data-href="http://facebook.com/gltndev" data-layout="standard" data-action="like" data-show-faces="true" data-share="true"></div>
    
    
    </td></tr><tr>
    
    <td style="padding-left:10px"><div class="center"><iframe src="//www.youtube.com/embed/C09PcdbR92A" frameborder="0" allowfullscreen></iframe>
    <br>
    </td>
    
    </tr></table> </div>
    </div>
    <div id="intelligence" class="page row" style="background-color:#f1c40f;">
    	<h1>Intelligence<br></h1><h3>Let's Have the Editor be as Smart as You</h3>
        <div class="center"><img src="name_collage.png" class="promo"></div>
        <h4><b>Headers</b>- Spreadsheet software is powerful. It lets you analyze the input and format the output the way you want. Why hasn't this been adapted to word processing? I tell the software my full name. From there, it knows my last name and automatically puts it in the top right of the header. It also knows what page it's on. That's the tip of the iceburg. Keep reading.</h4>
    </div>
    <div id="citations" class="page row" style="background-color:#09f;">
    	<h1>Citations<br></h1><h3>Move over RefWorks and EasyBib; It's time for innovation</h3>
        <div class="center"><img src="citations.png" class="promo"></div>
        <h4><b>Popups</b>- When you cite a source, you link the source to your citation. This allows the system to intelligently add inline citations as well as a bibliography. Of course, it's all formatted perfectly. It just works. Imagine all the time and effort you will save by not worrying about pointless things like missing a period in a source or not putting the title in quotes.</h4>
    </div>
    <div id="panels" class="page row" style="background-color:#e7842c;">
    	<h1>Panels<br></h1><h3>Side-by-Side Content; Yep, it's that easy.</h3>
        <div class="center"><img src="ideapanel2.png" class="promo"></div>
        <h4><b>Idea Panel</b>- You can write down notes for each source when you're doing research. Later, you can elaborate on your ideas while looking at your original notes.</h4>
    </div>
    <div id="immersion" class="page row" style="background-color:#7f8c8d;">
    	<h1>Immersion<br></h1><h3>Fullscreen Mode? Check. Night Mode? Also Check.</h3>
        <div class="center"><img src="darkfullscreen2.png" class="promo"></div>
        <h4><b>Fullscreen</b>- Instead of buttons and icons, get rid of the UI and focus just on what you're writing.</h4>
    </div>
    <div id="intuitiveness" class="page row" style="background-color:#e74c3c;">
    	<h1>Intuitiveness<br></h1><h3>Plug and Play Essays; It's never been this fast</h3>
        <div class="center"><img src="intuitive2.png" class="promo"></div>
        <h4><b>Plug and Play</b>- You know your name. Don't fret the small formatting issues. You focus on writing, and we'll take care of the small stuff. Why spend dozens of minutes formatting when a computer can do it perfectly in a few seconds?</h4>
        <span style="font-size:10px">Disclaimer: This was a five paragraph MLA essay with several citations and the build time ranged between one and two seconds on my laptop. Depending on the computer, it may actually be faster.</span><br><br>
    </div>
    <div id="html" class="page row" style="background-color:#9b59b6;">
    	<h1>Web App<br></h1><h3>It's HTML5 without the 3d Graphics</h3>
        <div class="center"><img src="upload.png" class="promo"></div>
        <h4><b>Cross-Platform</b>- The beauty of the web is being cross-platform; write once, run everywhere. With browsers improving their web technologies constantly, it is actually possible to build and use a full-fledged document editor online. Plus, it takes advantage of many new features such as FileReader, LocalStorage, ApplicationCache, new form events, along with a few external libraries that are icing on top of the cake.
        <br>That's not all. You can use InkFilePicker to access and save files to all kinds of online services. Google Drive? Box? SkyDrive? FTP? All accessible.
        </h4>
    </div>
    <div id="open" class="page row" style="background-color:#2ecc71;">
    	<h1>Open Source<br></h1><h3>Let's All Make it Better</h3>
        <!--<div class="center"><img src="intuitive.png" class="promo"></div>-->
        <h4><b>Help Wanted!</b>- I believe in this project, but to get the growth it needs, I'll need your help. Everything is available to use on GitHub. Build panels, design formats, do anything you want. Just contribute your improvements back to the community.</h4><br><br>
        <a href="https://github.com/Fleker/Gluten" target="_blank">Gltn @ GitHub</a>
        <br>
       	It's very easy to get started! Plus, the Wiki is filled with documentation, so you won't get lost. The framework is very extensive and gives developers control over what they want.<br>
        <h4>Create a Panel</h4>
        <pre>
        function getPanel{name}() {
            return {title: "Document Notes", bordercolor: "#f1c40f", width: 40};	
        }
        function runPanel{name}() {
        	//code here
            var output = "Hello World!"
            postPanelOutput(output);
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
    <span style="font-size:7pt;display:none;">Gltn is still in development. Some parts of it may drastically change as it continues to grow and add more features. This is a beta version. Not everything may work all the time. Alert <a href="mailto:handnf+gluten@gmail.com">the developer</a> or message me <a href="http://twitter.com/handnf" target="_blank">@HandNF</a> (preferrably with a console output) if there is a bug or feature you want. Also, there are a few things that may seem weird, like the Font Awesome icon being the logo. This is merely a placeholder, don't worry.</span>
</div>	
<style>
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
h4 {
	width:90%;	
}
</style>

<!-- Place this tag after the last widget tag. -->
<script type="text/javascript">
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/platform.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=456653801039439";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
</body>
</html>