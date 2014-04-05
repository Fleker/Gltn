function refTextDetails(id) {

    ht = "<span style='font-size:14pt'>Pick an Object. The text will use the figure number of this object. (Just the number)</span><br><div id='Popup'></div>";

    $('.reftext'+id).attr('data-id', id);

    ht += "<input type='hidden' id='PopupId' value='"+id+"'>";

    fnc = function x() {

        id = $('#PopupId').val();

        function populate(ind) {

//            console.log("populate {"+ind+"}");

            var a = $('.img');

            out = "<table style='width:90%'>";

            var i = 0;

            $('.content_textarea .img').each(function() {
                if(ind == i && $('.reftext'+id).attr('data-ref').indexOf('img') > -1)
                    bg = "rgba(0,255,0,.5)";
                else
                    bg = "rgba(0,0,0,0)";
                out += "<tr style='border:solid 1px black;background-color:"+bg+";cursor:pointer;' class='PopupImg' data-i='"+i+"'><td style='text-align:center'><img src='"+$(this).attr('data-src')+"' style='width:50%'></td><td style='vertical-align:center'>&emsp;"+$(this).attr('data-des')+"</td></tr>";     
                i++;
            });
            i = 0;
            $('.content_textarea .table').each(function() {
                if(ind == i && $('.reftext'+id).attr('data-ref').indexOf('table') > -1)
                    bg = "rgba(0,255,0,.5)";
                else
                    bg = "rgba(0,0,0,0)";
                out += "<tr style='border:solid 1px black;background-color:"+bg+";cursor:pointer;' class='PopupTable' data-i='"+i+"'><td style='text-align:center'><td>"+$(this).attr('data-title')+"&emsp;<span style='font-size:10pt'>"+$(this).attr('data-col')+" x "+$(this).attr('data-row')+"</span></td></tr>";     
                i++;
            });$('.content_textarea .latex').each(function() {
                if(ind == i && $('.reftext'+id).attr('data-ref').indexOf('latex') > -1)
                    bg = "rgba(0,255,0,.5)";
                else
                    bg = "rgba(0,0,0,0)";
                out += "<tr style='border:solid 1px black;background-color:"+bg+";cursor:pointer;' class='PopupLatex' data-i='"+i+"'><td style='text-align:center'><td>"+$(this).html()+"</span></td></tr>";     
                i++;
            });

            out += "</table><button class='PopupSave'>Save</button>";

            $('#Popup').html(out);

            $('.PopupImg').on('click', function() {
                $('.reftext'+id).attr('data-ref', 'img'+$(this).attr('data-i')); 
                $('.reftext'+id).attr('data-refid', $(this).attr('data-i')); 
                populate($(this).attr('data-i'));
            });
            $('.PopupTable').on('click', function() {
                $('.reftext'+id).attr('data-ref', 'table'+$(this).attr('data-i')); 
                $('.reftext'+id).attr('data-refid', $(this).attr('data-i')); 
                populate($(this).attr('data-i'));
            });
            $('.PopupLatex').on('click', function() {
                $('.reftext'+id).attr('data-ref', 'latex'+$(this).attr('data-i')); 
                $('.reftext'+id).attr('data-refid', $(this).attr('data-i')); 
                populate($(this).attr('data-i'));
            });

            $('.PopupSave').on('click', function() {

                closePopup(); 

                markAsDirty();

            });

        }

        if($('.reftext'+id).attr('data-ref') != undefined) {

            populate($('.reftext'+id).attr('data-refid'));

        } else {

            populate(-1);

        }

    };

    initiatePopup({title: "Ref Text", bordercolor:"#09f", ht: ht, fnc: fnc});

}



function LatexGreek(char) {

    return {id:char, keywords: char+" "+char.toLocaleLowerCase(), cmd:"\\"+char.toLowerCase(), param:[], des:"Displays the letter "+char};

}



 window.LatexAPI = {

        /*** LATEX TEXT MARKUP ***/

        Bar: {id:"Bar", keywords:"bar", cmd:"\\bar{x}", param:[{id:"x", des:"Value to get bar placed over it"}], des:"Places a bar over the input value"},

        Subscript: {id:"Subscript", keywords:"element sub subscript", cmd:"_{exp}", param:[{id:"exp", des:"The expression you want subscripted"}], des:"Subscripts a specific input"},

        Superscript: {id:"Superscript", keywords:"exponent sup superscript", cmd:"^{exp}", param:[{id:"exp", des:"The expression you want superscripted"}], des:"Superscripts a specific input"},

        

        /*** LATEX MATH MARKUP ***/

        Fraction: {id:"Fraction", keywords:"frac, fraction, divide, division", cmd:"\\frac{n}{d}", param:[{id:"n", des:"Numerator"},{id:"d", des:"Denominator"}], des:"Displays a fraction"},

        Sum: {id:"Sum", keywords:"sum, summation, sigma", cmd:"\\sum\\limits_{i}^{k}", param:[{id:"i", des:"The initial value"},{id:"k", des:"The final value"}],des:"Shows a summation using a sigma"},

        Root: {id:"Root", keywords:"square root radical", cmd:"\\sqrt[root]{exp}", param:[{id:"root", des:"Opt. The root of the radical"},{id:"exp", des:"The expression you want under the radical"}], des:"Shows an expression under a radical"},

            

        /*** LATEX CONSTANTS: GREEK ***/

            

        Alpha: LatexGreek("Alpha"),

        Pi: LatexGreek("Pi"),

        Omega: LatexGreek("Omega"),

        /*** LATEX SYMBOLS & CONSTANTS ***/

        Times: {id:"Times", keywords:"multiplication multiply times", cmd:"\\times", param:[], des:"Displays the times symbol, often used for multiplication"},

        Space: {id:"Space", keywords:"space tab whitespace", cmd:"\\, or \\: or \\;", param:[], des:"Displays a space that is thin, medium, or wide respectively."},

        Bullet: {id:"Bullet", keywordS:"bullet dot times product", cmd:"\\bullet", param:[], des:"Displays a bullet"}

};









function latexDetails(id) {

    ht = "<table style='width:100%'><tr><td style='vertical-align:top;width:50%;'>LaTeX is a form of markup that, among other features, allows for rich math formatting. <br><br>Help:&nbsp;<input type='search' style='width:50%' id='latexSearch' placeholder='Search for something...'><br><span style='font-size:9pt'>Note that mathematical formulas must be placed between \"$\"</span></td><td width:50%;>";

    ht += "<div id='latexRef' style='display:none;background-color: rgba(255,255,255,.1);padding:5px;'></div></td></tr></table>";

   // ht += "<button id='latexPrev'>Preview</button>";

    ht += "<table style='width:99%'><tr><td style='width:50%'><div id='latexCmd' style='height:4em;width:95%;border: solid 1px rgba(0,129,255,1);background-color:"+theme.normfsui+";margin-top:5px;margin-left:5px;margin-bottom:10px;' contenteditable='true'></div></td>";

    

    ht += "<td style='width:50%'><div id='latexView' style='height:4em;width:95%;border: solid 1px;background-color:"+theme.normfsui+";margin-top:5px;margin-left:5px;margin-bottom:10px;'></div></td></tr></table>";

    ht += "<div id='latexBuffer' style='visibility:hidden'></div>";

    ht += "<button id='latexSave'>Save</button>";

    $('.latex'+id).attr('data-id', id);

    ht += "<input type='hidden' id='PopupId' value='"+id+"'>";

    fnc = function x(){

        id = $('#PopupId').val();

        Preview.Init();

        function populate(cmd) {

            var preview = false;

            if(cmd != -1) {

                $('#latexCmd').html(cmd);

                Preview.Update();

            }

            $('#latexPrev').on('click', function() {

                if(preview) { 

                    $('#latexCmd').fadeIn(300);

                    $('#latexView').fadeOut(300);

                    $('#latexPrev').html('Preview');

                    preview = false;

                } else {

                    $('#latexCmd').fadeOut(300);

                    $('#latexView').fadeIn(300);

                    $('#latexPrev').html('View Commands');

                    preview = true;

                }

            });

            $('#latexCmd').on('input', function() {

                $('.latex'+id).html($('#latexView').html());

                $('.latex'+id).attr('data-cmd', $('#latexCmd').text());

                console.log('latexing');

                Preview.Update();

            });

            $('#latexSave').on('click', function() {

                Preview.Update();

                setTimeout(function() {

                    console.log($('#latexView').html());

                    if($('#latexView').html().length < 1)

                        $('#latexView').html("LaTeX")

                    $('.latex'+id).html($('#latexView').html());

                    markAsDirty();

                    closePopup();

                }, 250);

            });

            $('#latexSearch').on('input', function() {

                showLatexReference($(this).val());

            });

        }

        



        

       

        

        

        if($('.latex'+id).attr('data-cmd') != undefined) {

            populate($('.latex'+id).attr('data-cmd'));

        } else {

            populate(-1);

        }  

    };

    initiatePopup({title: "Insert LaTeX", bordercolor: "#f1c40f", ht: ht, fnc: fnc, size: "large"});

}

function showLatexReference(str) {

    function showReference(item) {

        console.log(item);

        out = "<b>"+item.id+"</b><br>";

        out += "<span style='font-family:monospace'>"+item.cmd+"</span>";

        out += "<div style='margin-left:35px;font-size:10pt'><ul>";

        for(i in item.param) {

            out += "<li>"+item.param[i].id+": "+item.param[i].des+"</li>";

        }

        out += "</ul>"+item.des+"</div>";

        $('#latexRef').html(out);

        return out;

    }

    var v = str;

    if(v.length) {

        $('#latexRef').fadeIn(300);

        for(i in LatexAPI) {

            if(v == LatexAPI[i].id) {

//                            console.log(v, console[i].id);

                showReference(LatexAPI[i]); 

                return;

            }

            

            if(LatexAPI[i].keywords.indexOf(v) > -1) {

                showReference(LatexAPI[i]); 

                return;

            }

        }

        $('#latexRef').html("<span style='font-size:11pt'>&emsp;Sorry, that could not be found.</span>");

    } else {

        $('#latexRef').fadeOut(300);   

    }

}

/*** HOLORIBBON ***/

/*newRibbon('.header', {

       'File': new Array(

			   {'text': 'Back', 'img': '', 'action': 'returnHome();'},

               {'text': 'Download', 'img': '', 'action': "convertToPreview();pdf.save(o.title+'.pdf');"}

           

       ),

	   'View': new Array(

			   {'text': 'Edit', 'img': '', 'action': 'convertToInput()'},

               {'text': 'View XML', 'img': '', 'action': 'convertToXML()'},

			   {'text': 'Preview', 'img': '', 'action': 'convertToPreview()'},

			   {'text': 'Print', 'img': '', 'action': 'print();'}



		),

       'Options': new Array(

                {'group': 'Words', 'value': 'Min: <input type="number" id="count_words_min" value="0" oninput="wordCount()" min="0" class="countinput"><br>Max: <input type="number" id="count_words_max" value="0" oninput="wordCount()" min="0" class="countinput">'},

                {'group': 'Timer', 'value': 'Minutes: <input type="number" id="timer_minutes" value="0" min="0">'}

           

       ),

	   'Panels': new Array (

			   {'text': 'Citations', 'img': '', 'action': 'panelCitation()'},

			   {'text': 'Ideas', 'img': '', 'action': 'panelIdea()'}

	   )

    });*/

function setHeader() {

	console.log('Header set');

	window.holoribbon_std =  {

		Home: new Array(

//            {text: "Start the Tour", img: "<span class='fa fa-home' style='font-size:18pt'></span>", action: "alert('TBD')", key:"Alt+T"}, 
            {text: "Create a File", img: "<span class='fa fa-file' style='font-size:18pt'></span>", action: "createNewFile()", key:"Alt+N"},
            {group: "", value:"<span style='font-size:16pt'>Welcome to Gltn!</span>"},
            {text: "Explore Files", img: "<span class='fa fa-folder-open' style='font-size:18pt'></span>", action: "runPanel('main_Filesys')", key: "Alt+O"} 

		//	{group: '', value: '<font size="4" id="temp_header" >Welcome to Gluten!</font><br><table style=\'width:40%;margin-left:30%\'><tr><td><button onclick="window.introdisabled = true;introJsStart();"><span class=\'fa fa-home\'></span>&nbsp;Start the Tour!</button></td><td><button id="iFILESYS" onclick="runPanel(\'main_Filesys\')"><span class=\'fa fa-folder-open\'></span>&nbsp;Explore Files</button></td></tr></table>'}

		),

		File: new Array(

			{group: "File Name", value:"<input type='text' id='file_name' style='width:7em'><button id='file_name_con' disabled='true'>Save As</button><input type='hidden' id='file_name_internal'>"},

			{text: 'Publish & Export', img: '<span style="font-size:18pt" class="fa fa-file"></span>', action: "startBuild();setTimeout('exitintro();', 1000);", key: "Alt+B"},

			{text: 'Share', img: '<span style="font-size:18pt" class="fa fa-code-fork"></span>', action: "exportFile();"}

		),

		Panels: new Array(

			{text: 'Gltn Store', img: '<span style="font-size:18pt" class="fa fa-shopping-cart"/>', action: "launchStore()", key: "Alt+S"},

			{text: 'Outline', img: '<span style="font-size:18pt" class="fa fa-list"></span>', action: "runPanel('main_Outline');"},

			{text: 'Citations', img: '<span style="font-size:18pt" class="fa fa-book"></span>', action: "runPanel('main_Citation');"},

			{text: 'Ideas', img: '<span style="font-size:18pt" class="fa fa-lightbulb-o"></span>', action: "runPanel('main_Idea');"},

			{text: 'Style Guide', img: '<span style="font-size:18pt" class="fa fa-info-circle"/>', action: "runPanel('main_Guide');"}

		),

		Tools: new Array(

			{text: 'Find', img: '<span style="font-size:18pt" class="fa fa-search"></span>', action: "runPanel('main_Find');", key: "Alt+F"},

			{text: 'Dictionary', key:"Alt+D", img: '<span style="font-size:18pt" class="fa fa-quote-left"></span>', action: "runPanel('main_Dictionary');"},

			{text: 'Themes', img: '<span style="font-size:18pt" class="fa fa-picture-o"></span>', action: "runPanel('main_Themes')"}

		),

		About: new Array(

			{text: 'Open Source', img: '<span style="font-size:18pt" class="fa fa-github-alt"></span>', action: "window.location='http://www.github.com/fleker/gltn'"},

			{text: 'Send Feedback', img: '<span style="font-size:18pt" class="fa fa-envelope"></span>', action: "window.location='mailto:handnf+gltn@gmail.com'"},

			{text: 'Gltn Blog', img: '<span style="font-size:18pt" class="fa fa-bullhorn"></span>', action:"window.location='http://gltndev.wordpress.com/'"},

			{text: 'Credits', img: '<span style="font-size:18pt" class="fa fa-legal"></span>', action: 'postLegal()'}

		),

		Me: new Array(

			{group: 'Name', value:'<input id="me_name" type="text">'}

		)

	};

	newRibbon('.header', holoribbon_std);

	ribbonSwitch(0,false);

	ribbonLoad();

}

function ribbonLoad() {

	//$('#file_name').val(fileid);

	$('#file_name').attr('value', fileid);

	$('#file_name').attr('defaultValue', fileid);

	$('#file_name_internal').val(fileid);

	$('#file_name').on('input', function() {

		console.log('file_name oninput');

		$('#file_name_con').attr('disabled', false);

	});

	$('#file_name_con').on('click', function() {

		var v = $('#file_name').val();

		v = v.replace(/ /g, "");

		//console.log(v, localStorage[v]);

        ovr = true;

		if(localStorage[v] != undefined) {

			ovr = confirm('This file already exists: '+v+'; Overwrite the contents of this file?');	

		}

		if(ovr) {

			if(v.substr(-2) == "_c")

				v = v.substr(0,v.length-2)+"c";

			$('#file_name_con').attr('disabled', true);

			$('#file_name_internal').val(v);

			setTimeout('window.location = "?file='+v+'";', 250);

		}

	});

	//$('#me_name').val(window.settings.me_name);

	$('#me_name').attr('value', settings.me_name);

	$('#me_name').attr('defaultValue', settings.me_name);

	$('#me_name').on('input', function() {

		writeToSettings('me_name', $('#me_name').val());		

	});

}

function postLegal() {

	out = "�2014 Made by Nick Felker<br>(@HandNF)<br>";

    out += "Made using libraries from Mathjax, Font Awesome, jQuery, Rangy, InkFilepicker, and others<br>";

    out += "Shoutout to everyone who posted online about stuff like replacing text nodes and the ample amount of help from Stacked Overflow.<br>";

    out += "Loader was created by TaniaLD";

	f = function x() { };

	initiatePopup({title:'Credits', value: out, fnc: f});

}

currentpanel = "";

function install_panel(id, name, img, url, service, key, num) {
	if(service == undefined)
		service = false;
	if(key == undefined)
		key = " ";
	img = img.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
	if(service != true) {
		if(key != undefined && key.length > 0 && key != "[object Object]")
            holoribbon_std['Panels'].push({text: name, img: img, action: "runPanel('"+id+"')", key:key});
		else
			holoribbon_std['Panels'].push({text: name, img: img, action: "runPanel('"+id+"')"});
		newRibbon('.header', holoribbon_std);
		console.log("Installing "+name+"...  "+num);
		ribbonSwitch(ribbon_index,false);
		ribbonLoad();
	}
    if(typeof(service) == "string")
        service = service.replace(/,/, "");
	if(window.settings.panels.indexOf(id) == -1) {
		window.settings.panels += ", "+id;
	}
	window.settings['panels_'+id] = id+", "+name+", "+img+", "+url+", "+service+", "+key;

	if(window.offline != true) {

	//Now store script offline - this really sucks though

		loadjscssfile(url, "js");

		//$('body').append('');

		$('#themeframe').attr('src', url);

        window.setTimeout(function() {download_panel(id,num)}, 200);

        

//        console.log(localStorage['zpanels_'+id]);

//		setTimeout("localStorage['zpanels_"+id+"'] = $('#themeframe').contents().text();", 1000);

	//} else {

	}
}

function download_panel(id,num) {
    if(currentpanel != id) {
        console.log(id, currentpanel);
        if(!currentpanel.length)
            return;
        window.setTimeout(function() {download_panel(id,num)}, 100);
    } else {
        console.log("Installed");
        localStorage['zpanels_'+id] = $('#themeframe').contents().text();  
        console.log("eval('InitPanel"+id+"();');  "+num);
	    setTimeout("eval('InitPanel"+id+"();');", 100);	
        initPanels(num+1)
    }
}

function uninstall_panel(id) {

	//alert('Fix ribbon');

	//For removing the ribbon, need to compare the name of the ribbon with the name of the panel

	var a = window.settings['panels_'+id].split(', ');

	var b = new Array();

	for(i in holoribbon_std['Panels']) {

		var j = holoribbon_std['Panels'][i];

		//console.log(a[1],i, j);

		if(j.text != a[1]) {

			b.push(j);

			//console.log('Found '+j.text+' as '+id);	

			

		}

	}

	holoribbon_std['Panels'] = b;

	newRibbon('.header', holoribbon_std);



	//Now we can set up a way for panels to turn off stuff

	//We set a short timer so that if it doesn't exist, it doesn't ruin the flow of the function

	setTimeout("eval('RemovePanel"+id+"();');", 1);

	var a = window.settings.panels.split(', ');

	var b = new Array();

	for(i in a) {

		if(a[i] != id) {

			b.push(a[i])

		}	

	}	

	window.settings.panels = b.join(', ');

	window.settings['panels_'+id] = undefined;	

	if(localStorage['zpanels_'+id] != undefined) 

		localStorage.removeItem('zpanels_'+id);

}

function appendHoloSelection() {

	var selection = {

		Selection: new Array(

			{text: '', img: '<span style="font-size:18pt" class="fa fa-bold"></span>', action: "toggleBold()"},

			{text: '', img: '<span style="font-size:18pt" class="fa fa-italic"></span>', action: "toggleItalics()"},

			{text: '', img: '<span style="font-size:18pt" class="fa fa-underline"></span>', action: "toggleUnder()"},

			{text: '', img: '<span style="font-size:18pt" class="fa fa-strikethrough"></span>', action: "toggleStrike()"}

		)

	};

	newRibbon('.header', $.extend({}, holoribbon_std, selection));

	ribbonSwitch(ribbon_index, false);

}

function doesThisWork() {

	var flag = new Array();

	if (window.File && window.FileReader && window.FileList && window.Blob) {

	  // Great success! All the File APIs are supported.

	} else {

	  alert('The File APIs are not fully supported in this browser.');

	  flag.push('The File APIs are not fully supported in this browser.')

	}

	

	if(window.localStorage) {

		

	} else {

		alert('Local Storage is not supported in this browser.');

		flag.push('Local Storage is not supported in this browser.')

	}	

	try {

		$('#header').attr('id');

	} catch(e) {

		alert('jQuery does not work');

		flag.push('jQuery does not work');		

	}

	try { var isFileSaverSupported = !!new Blob(); } catch(e){

		alert('Blobs are not supported');

		flag.push('Blobs are not supported');	

	}

	if(window.applicationCache == undefined) {

		alert('You do not have Application Cache in your browser. You may still use Gltn, but it will not work offline.');	

	}

	return !flag.length;

}

function closeButton(i) {

	if(i == 1)

		return "<span class='fa fa-times'/>"

	else

		return '<span class="fa fa-times"/>'	

}

/*** Custom Theming ***/

function initTheme() {

	window.theme = {};	

	//set theme colors/css

	//set theme variables

	//fullscreen variables

	theme.darkbg = "rgb(0, 0, 0)";

	theme.normcolor = "rgb(0, 0, 0)";

	theme.normbg = "rgb(255, 255, 255)";

	theme.darkcolor = "rgb(200, 200, 200)";

	theme.coloralt = '#222';

	theme.normfsui = "rgb(204, 204, 204)";

	theme.darkfsui = "rgb(41, 41, 41)";

	theme.darkfsuicolor = 'white';

	theme.normfsuicolor = 'black';

	theme.ribbonhighlight = 'rgba(44, 62, 80,1.0)';

	theme.ribbonplain = 'rgba(0,0,0,0)';
	$('.popupcontent').css('padding-left','15px');

}

initTheme();

function themeCss(rule, val) {

	$('body').css(rule, val);	

}

function writeCss(rules) {

	$('body').append('<style>'+rules+'</style>');

}

function startThemer() {

	//isn't called until settings are grabbed because otherwise window.settings.theme wouldn't exist

	//grab current theme

	//if not set reset themes

	var url = undefined;

	if(window.settings.theme == undefined) {

		window.settings.theme = "default, blackout";

		window.settings.currenttheme = "default";

		window.settings.theme_default = "default, Default, js/themes/kernel.js, <span class='fa fa-heart-o'></span>";

		window.settings.theme_blackout = "blackout, Blackout, js/themes/theme_blackout.js, <span class='fa fa-heart'></span>";

	} //else {

		var a = window.settings.theme.split(', ');

		var b = window.settings['theme_'+window.settings.currenttheme].split(', ');

		url = b[2];

	//}

	//if not default insert JS

        

	if(url != undefined && b[0] != "default") {

		console.log("Loading theme "+b[1]+" @ "+url);

		console.log(window.offline != true)

		if(window.offline != true) {

			loadjscssfile(url, 'js');

			//Load script and save it

			//Now store script offline - this really sucks though

			$('#themeframe').attr('src', url);		

			setTimeout("localStorage['ztheme_"+id+"'] = $('#themeframe').contents().text();", 1000);

		}

		//JS will have same function and call that script

	} else if(b[0] == "default") {

		initTheme();

      		 setLoaderColor('32,32,32');
		writeCss('@import url(http://fonts.googleapis.com/css?family=Lato:100,300,400);');
		themeCss('font-family', '"Lato", sans-serif');
		themeCss('font-size', '10pt');
		writeCss("button { font-family:Lato,sans-serif;background-color:rgba(255,255,255,0.01);border-radius:3;text-indent:0;border:0px solid #888;display:inline-block;color:#333333;font-weight:bold;font-style:normal;text-decoration:none;text-align:center;padding:5px;min-width:30px;} button:hover { background-color: #34495e; color: #ecf0f1; } button:active {position:relative;top:1px;}");

    	}

}

function setLoaderColor(col) {

    writeCss('@-webkit-keyframes loader10g{	0%{background-color: rgba('+col+', .2);} 25%{background-color: rgba('+col+', 1);} 50%{background-color: rgba('+col+', .2);} 75%{background-color: rgba('+col+', .2);} 100%{background-color: rgba('+col+', .2);} }');

    writeCss('@keyframes loader10g{0%{background-color: rgba('+col+', .2);} 25%{background-color: rgba('+col+', 1);} 50%{background-color: rgba('+col+', .2);} 75%{background-color: rgba('+col+', .2);} 100%{background-color: rgba('+col+', .2);} }');

    

     writeCss('@-webkit-keyframes loader10m{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', 1);}	75%{background-color: rgba('+col+', .2);}	100%{background-color: rgba('+col+', .2);}}');

    writeCss('@keyframes loader10m{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', 1);}	75%{background-color: rgba('+col+', .2);}	100%{background-color: rgba('+col+', .2);}}');

    

     writeCss('@-webkit-keyframes loader10d{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', .2);}	75%{background-color: rgba('+col+', 1);}	100%{background-color: rgba('+col+', .2);}}');

    writeCss('@keyframes loader10d{	0%{background-color: rgba('+col+', .2);}	25%{background-color: rgba('+col+', .2);}	50%{background-color: rgba('+col+', .2);}	75%{background-color: rgba('+col+', 1);}	100%{background-color: rgba('+col+', .2);}}');

    /*

@keyframes loader10m{

	0%{background-color: rgba(255, 255, 255, .2);}

	25%{background-color: rgba(255, 255, 255, .2);}

	50%{background-color: rgba(255, 255, 255, 1);}

	75%{background-color: rgba(255, 255, 255, .2);}

	100%{background-color: rgba(255, 255, 255, .2);}

}



@-webkit-keyframes loader10d{

	0%{background-color: rgba(255, 255, 255, .2);}

	25%{background-color: rgba(255, 255, 255, .2);}

	50%{background-color: rgba(255, 255, 255, .2);}

	75%{background-color: rgba(255, 255, 255, 1);}

	100%{background-color: rgba(255, 255, 255, .2);}

}

@keyframes loader10d{

	0%{background-color: rgba(255, 255, 255, .2);}

	25%{background-color: rgba(255, 255, 255, .2);}

	50%{background-color: rgba(255, 255, 255, .2);}

	75%{background-color: rgba(255, 255, 255, 1);}

	100%{background-color: rgba(255, 255, 255, .2);}

}');   */

}

function install_theme(id, name, url, icon) {

	if(window.settings.theme.indexOf(id) == -1) {

		window.settings.theme += ", "+id;

		window.settings['theme_'+id] = id+', '+name+', '+url+', '+icon;	

	}

	if(offline != true) {

		//Now store script offline - this really sucks though

		$('#themeframe').attr('src', url);

		setTimeout("localStorage['ztheme_"+id+"'] = $('#themeframe').contents().text();", 1000);

	}

}

function uninstall_theme(id) {

	var a = window.settings.theme.split(', ');

	var b = new Array();

	for(i in a) {

		if(a[i] != id)

			b.push(a[i]);	

		if(a[i] == settings.currenttheme)

			settings.currenttheme = a[i-1];

	}

	window.settings.theme = b.join(', ');

	localStorage.removeItem('theme_'+id);

	if(localStorage['ztheme_'+id] != undefined)

		localStorage.removeItem('ztheme_'+id);

}

function selectTheme(id) {

	var a = window.settings.theme.split(', ');

	var b = new Array();

	for(i in a) {

		if(a[i] == id)

			window.settings.currenttheme = id;	

	}

	//startThemer();

	saveFile();

	setTimeout("window.location.reload();", 150);

}

function onUpdateReady() {

	appcache();

  //window.appcachestatus = "Found new version - Refresh to update";

  console.log('Found new version!');



}

window.applicationCache.addEventListener('error', function() {

	console.error("Error caching files for offline use.");

	if(window.offline != true) {

		window.appcachestatus = "Error caching files for offline use";

		initService("main_Offline", "App caching", "&nbsp;");

	} else {

		window.appcachestatus = "You are currently working offline";

		setTimeout('initService("main_Offline", "App available offline", "<span class=\'fa fa-plane\'></span>");', 2000);

	}

});

window.appcachestatus = "App available offline";

function appcache() {

	console.log("App is now available for offline use.");

	//if($('.contentmain_Offline').length == 0)

		setTimeout('initService("main_Offline", "App available offline", "<span class=\'fa fa-plane\'></span>");', 2000);

	//hot swap	

	try {

		window.applicationCache.swapCache();

	} catch(e) {

		

	}

	return false;

}

function GetPanelmain_Offline() {

	return {title: "<span class='fa fa-plane'></span>&nbsp;Offline", bordercolor:"#ff9900", width: 15};	

}

function RunPanelmain_Offline() {

	out = "<span style='font-size:16pt'>This App is Available Offline</span><br>What Does this Mean?<br><br>If your device is not connected to the Internet, you can still open Gltn in your browser. Of course, not every feature will be available such as the Dictionary and the Gltn Store, but you will be able to edit and build documents like always.<br><br><span style='font-weight:bold;font-size:10pt;color:#ff9900'>"+window.appcachestatus+"</span>";

	postPanelOutput(out);

}

window.applicationCache.oncached = appcache();

window.applicationCache.onupdateready = onUpdateReady();

//window.applicationCache.onerror = console.log('ACE');

//

window.applicationCache.onprogress = function(e) {

    // The event object should be a progress event (like those used by XHR2)

    // that allows us to compute a completion percentage, but if not,

    // we keep count of how many times we've been called.

    var progress = "";

    if (e && e.lengthComputable) // Progress event: compute percentage

        progress = " " + Math.round(100*e.loaded/e.total) + "%"

    else                         // Otherwise report # of times called

        progress = " (" + ++progresscount + ")"



   // console.log("Downloading new version" + progress);

	initService("main_Offline", "App caching", "<span class='fa fa-plane'></span>"+progress);

	window.appcachestatus = "Found new version - Refresh to update";

    postNotification("appcache", "A new version of the app was downloaded. Click to update.", "window.location.reload()");

    return false;

};

function initNotifications() {

	//Notifications live, send out requests?	

	if(window.notifications == undefined) {

		window.notifications = new Array();		

	}

    postNotificationsIcon();

	

	//since appcache is too fast:

	console.log(appcachestatus);

	if(appcachestatus == "Found new version - Refresh to update")

		postNotification("appcache", "A new version of the app was downloaded. Click to update.", "window.location.reload()");

}

function postNotificationsIcon() {

    if(notifications.length == 0)

        initService("main_Notifications", "Notifications (0)", "<span class='fa fa-bell-o'></span>");

    else

        initService("main_Notifications", "Notifications ("+notifications.length+")", "<span class='fa fa-bell'></span>&nbsp;"+notifications.length);

}

function InitPanelmain_Notifications() {

	

}

function GetPanelmain_Notifications() {

	return {title: "Notifications", bordercolor: "#666", width:25};	

}

function RunPanelmain_Notifications() {

	//get window.notifications

	var nonotes = "You have no new notifications";

	var out = "";

	if(notifications.length) {

		for(i in notifications) {

			out += "<div class='notification' style='background-color: rgba(0,255,0,.3);cursor:pointer;padding-left: 5px;padding-top: 5px;border: solid 1px "+theme.coloralt+";' data-id='"+notifications[i].id+"' data-i='"+i+"'><div class='notification_delete fa fa-times' style='width:21px;text-align:center;' data-id='"+notifications[i].id+"'></div>&nbsp;&nbsp;<div style='display:inline-table' onclick='"+notifications[i].action+"' >"+notifications[i].text+"</div></div><br>";

		}

		postPanelOutput(out);

        

        $('.notification_delete').off().hover(function() {

			$(this).css('color', theme.normbg).css('background-color', '#f44').css('border-radius', 100);

		}, function() {

			$(this).css('color', theme.normcolor).css('background-color', 'inherit');

		}).on('click', function() {

            

            for(i in notifications) {

                if(notifications[i].id == $(this).attr('data-id')) {

                    notifications.splice(i);

                    $('.notification[data-i='+i+']').animate({

                        width:'0%',

                        opacity:0

                    }, 300);

                    postNotificationsIcon();

                }   

            }

        });

        

        

	} else {

		postPanelOutput(nonotes);	

	}

}

function postNotification(id, text, action) {

    if(notifications == undefined)

            initNotifications();

	var npush = -1;

	for(i in notifications) {

		if(notifications[i].id == id)

			npush = i;

	}

	if(npush == -1) {

		notifications.push({id:id, text:text, action:action});

		postNotificationsIcon();

	} else {

		notifications[npush] = {id:id, text:text, action:action};

		postNotificationsIcon();

	}

}



/*** Context API ***/
function initContext() {
	if(window.context == undefined)
		window.context = new Array();
	parseCT();
		//formatHovertag("img", "'Image Details'", "'imgDetails('+$(this).attr('data-id')+');'");
	$('.content_textarea').on('keydown', function( event ) {
        console.log("Keyin "+event.which);
	  if (event.which == 32 || event.which == 8 || event.which == 46 || event.which == 13) {
          console.log("parse context");
	  	setTimeout("parseCT();",20);
		//contentAddText(' ');
	  	//event.preventDefault();
	  }
	});
    
    var exists = false;
    for(i in hovertagRegistrar) {
//        console.log(hovertagRegistrar[i].classname);
        if(hovertagRegistrar[i].classname == "context")
            exists = true;
    }
    if(!exists)
        formatHovertag('context', "window.context[parseInt($(this).attr('data-i'))].type", "'contextPanel('+$(this).attr('data-i')+')'");
}

function parseCT() {
	var r = new RegExp('<span class="context" [^>]*>([\\s\\S]+?)</span>', 'gi');
	try {
		saveSelection();
		var a = $('.content_textarea').html();
//        console.log(a);
   		a = a.replace(r, '$1');
        //Infamous White background bug DIES
        a = a.replace(/<span style="line-height: 1.3em; background-color: white;">([^<]*)<\/span>/g, "$1");
       		a = a.replace(/<\/span><\/div>/g, "</span>&nbsp;</div>");
       		a = a.replace(/<\/span><\/kbd>/g, "</span>&nbsp;</kbd>");
       		a = a.replace(/<\/kbd><\/kbd>/g, "</kbd>&nbsp;</kbd>");
        	a = a.replace(/<\/span>([\w])/g, "</span>&nbsp;$1");
        	a = a.replace(/<\/kbd>([\w])/g, "</span>&nbsp;$1");
        	a = a.replace(/<\/div>([\w])/g, "</span>&nbsp;$1");
		a = a.replace(/(<span [^<]+? class="rangySelectionBoundary" [^<]+?>........)&nbsp;/g, "$1"); 
        	a = a.replace(/<\/kbd><\/div>/g, "</kbd>&nbsp;</div>");
        	a = a.replace(/<\/div><\/div>/g, "</div>&nbsp;</div>");

		$('.content_textarea').html(a);

//		console.log(a, r);

	} catch(e) {

		console.error(e.message);

		var a = $('.content_textarea').html();

		a = a.replace(r, '$1');

		$('.content_textarea').html(a);

	}

	//findTextReplaceText(r, '$1');

	//Now we ping other functions, one internal and one by {fofrmat}.js to set up stuff

	contextMarkup();

	//console.log($('.content_textarea').html());	

	try {

		onStyleMarkup();

	} catch(e) {

		

	}

	try {

		restoreSelection();	

	} catch(e) {

		

	}

	//Now we do a jQuery event

}

function contextPanel(e) {

	//occurs when item is clicked

	

	//Create intent

	var f = $('.context[data-i='+e+']');

	create_panel_data({html:f.html(), index:f.attr('data-i')});

	//Launch panel

	runPanel('main_Context');

	//In panel, populate data and organize it

	console.log(f.html());



}

function apply_context(text, d) {

	//Finds text (or HTML unfortunately FTM) and replaces it

	var a = $('.content_textarea').html();

	var r = new RegExp('('+text+')', 'gi');

	var b = a.match(r);

	if(b != null) {

		//a = a.replace(r, "<span class='context' data-i='"+window.context.length+"'>$1</span>");

		//$('.content_textarea').html(a);

		if(d.type == "Don't Overuse") {

			var wc = $('.content_textarea').text().split(' ').length;

			var ac = a.match(r);

			if(ac != null) {

				if((ac.length / wc) > d.limit) {

					findTextReplaceText(r, "<span class='context' data-i='"+window.context.length+"'>$1</span>");

					window.context.push(d);

				}

//				console.log(ac.length, wc, (ac.length/wc),d.limit);

			}

		} else {

			findTextReplaceText(r, "<span class='context' data-i='"+window.context.length+"'>$1</span>");

			window.context.push(d);

		}

	}

	//Hovertag - use d.type

}

function contextMarkup() {

	//Markup the paper with all these issues, tied with a content object that will give users a recommendation

	function getStrunkTips(note) {

		return "From William Strunk Jr:<br><i style='font-size:10pt'>"+note+"</i>"

	}

	var revise = "Consider Revising";

	var syn = "Suggested Synonym";

	var remove = "Remove Word";

	var overuse = "Don't Overuse";

    var chars = "Replace Characters";

	/***/

	var simplify = "Simplify your sentence by using just one word.";

	var preposition = "You don't need a prepositional phrase to give a specific meaning.";

	var nouning = "A noun should not necessarily be turned into a verb.";

	var overusetip = "Don't overuse this word in your writing.";

	/***/

	var rare = .05;

	var urare = .005;

	

	apply_context("[sS]tudent [bB]ody", {type:"Consider Revising", replacement:"studentry", text: getStrunkTips("Use the word studentry instead of the two word phrase 'student body'. It is cleaner.")});
	apply_context("[Tt]he question as to whether", {type: "Consider Revising", replacement:"whether", text: getStrunkTips(simplify)});
	apply_context("[Tt]he fact that", {type: "Consider Revising", replacement:"", text: getStrunkTips("Don't overcomplicate your sentence. Get rid of this phrase. You don't need it.")});
	apply_context("[Nn]ot honest", {type: "Consider Revising", replacement:"Dishonest", text: getStrunkTips(simplify)});
	apply_context("[Nn]ot important", {type: revise, replacement: "trifling", text: getStrunkTips(simplify)});
	apply_context("[Dd]id not remember", {type: revise, replacement: "forgot", text: getStrunkTips(simplify)});
	apply_context("[Dd]id not pay any attention to", {type: revise, replacement: "ignored", text: getStrunkTips(simplify)});
	apply_context("[Dd]id not have any confidence in", {type: revise, replacement: "distrusted", text: getStrunkTips(simplify)});
	apply_context("[Hh]e is a man who", {type: revise, replacement: "he", text: getStrunkTips(simplify)});
	apply_context("[Tt]here is no doubt but that|[Tt]here is no doubt that", {type: revise, replacement: "no doubt", text: getStrunkTips("You can simplify this phrase by stating 'no doubt' or 'doubtless'.")});
	apply_context("[Ii]n a hasty manner", {type: revise, replacement: "hastily", text: getStrunkTips(simplify)});
	apply_context("[Tt]he reason why is that", {type: revise, replacement: "because", text: getStrunkTips(simplify)});
	apply_context("[Tt]his is a reason that", {type: revise, replacement:"this subject", text: getStrunkTips(simplify)});

    apply_context("[Cc]ope", {type: syn, replacement:"cope with", text: getStrunkTips("Including 'with' will improve the sentence's flow.")});
	apply_context("[Aa]nticipate", {type: syn, replacement:"expect", text: getStrunkTips("Don't use fancy words when a simpler word works much better.")});
	apply_context("[Uu]tilize", {type: syn, replacement: "use", text: getStrunkTips("Don't use fancy words when a simpler word works much better.")});
	apply_context("[Oo]wing to the fact that", {type: revise, replacement: "since", text: getStrunkTips("This phrase can be replaced with 'since' or 'because' and retain the same meaning.")});
	apply_context("[Ii]n spite of the fact that", {type: revise, replacement: "although", text: getStrunkTips(simplify)});
	apply_context("[Cc]all your attention to the fact that", {type: revise, replacement: "remind you", text: getStrunkTips("You can easily replace that whole phrase with two words. Why overcomplicate things?")});
	apply_context("I was unaware of the fact that", {type: revise, replacement: "I was unaware that", text: getStrunkTips("You can remove the phrase 'of the fact' and the meaning won't change.")});
	apply_context("[Tt]he fact that he had not succeeded", {type: revise, replacement: "his failure", text: getStrunkTips("Be direct with your sentences. Don't overcomplicate things.")});
	apply_context("[Tt]he fact that I had arrived", {type: revise, replacement: "my arrival", text: getStrunkTips("Don't state 'the fact that' because it becomes too wordy. 'My arrival' has the same meaning.")});
	apply_context("[Ww]ho is a member of", {type: revise, replacement: "a member of", text: getStrunkTips("Using the word 'who' in a non-question makes the sentence overly complicated.")});
	apply_context("[Aa]s to whether", {type: revise, replacement: "whether", text: getStrunkTips(preposition)});
	apply_context("[Aa]s yet|[Aa]s of yet", {type: revise, replacement: "yet", text: getStrunkTips(preposition)});
	apply_context("[Ee]nthuse", {type: remove, replacement: "", text: getStrunkTips(nouning)});
	apply_context("[Ff]acility", {type: revise, text: getStrunkTips("This is a very broad word. You should consider being more specific to help the reader understand and create more sophisticated imagery.")});
	apply_context("[Ff]olk", {type: revise, text: getStrunkTips("This word is very colloquial. You should consider changing the word to be more sophisticated.")});
	apply_context("[Pp]ersonalize", {type: revise, text: getStrunkTips("You should consider changing the word. It has a pretentious connontation.")});
	apply_context("[Tt]he foreseeable future", {type: revise, text: getStrunkTips("What is the definition of 'foreseeable'? This phrase is vague and should be replaced by something more specific.")});
	apply_context(" [Tt]ry and", {type: revise, replacement: "try to", text: getStrunkTips("If you're going to 'try and' do something else, then you're doing two separate actions. If so, 'try' isn't very specific and should be improved. If you're doing a single action, you'll 'try to' do that one thing.")});
	apply_context("[Ee]ach and every one", {type: revise, text: getStrunkTips("Unless this is said in conversation, it should be removed. This phrase is very wordy and could easily be simplified to a single word.")});
    apply_context("--", {type: chars, text: "Use this character instead", replacement:"—"});
    apply_context("[.][.][.]", {type: chars, text: "Use this character instead", replacement:"…"});

    /*** Overused Words ***/
	apply_context("[Vv]ery", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Pp]rodigious", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Cc]urvaceous", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Dd]iscombobulate", {type: overuse, text: getStrunkTips(overusetip), limit: urare});
	apply_context("[Rr]eally", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
	apply_context("[Ii]ncredibly", {type: overuse, text: getStrunkTips(overusetip), limit: rare});
}

function GetPanelmain_Context() {	
	return {title: "Writing Tips", bordercolor:"#16a085", width:25};	
}

function RunPanelmain_Context() {
	var d = grab_panel_data();	
	var e = window.context[d.index];
	out = '<br><span style="font-size:15pt;font-style:italics;">"'+d.html+'"</span>';
	out += '<br>&emsp;(<b style="font-size:10pt">'+e.type+'</b>)<br><br>'+e.text+'<br>';

	if(e.replacement != undefined) {
		//Create option to replace all values (or just that one)
		//$('span[data-i=0]')
		out += '<br><br><br><b>What to Do</b><br>&emsp;<span style="font-size:11pt; cursor:pointer;border-bottom:solid 1px '+theme.normcolor+'" class="contextReplaceA">Replace all with "'+e.replacement+'"</span>';	
		//<span style="font-size:11pt; cursor:pointer;border-bottom:solid 1px '+theme.normcolor+'" class="contextReplace">Replace this with "'+e.replacement+'"</span><br><br>&emsp;
	}
	postPanelOutput(out);
	$('.contextReplace').on('click', function() {
		//Global and singular
		console.log($('.context[data-i='+d.index+']'));
		$('.context[data-i='+d.index+']').html(e.replacement);
		parseCT();
	});
	$('.contextReplaceA').on('click', function() {
		//Global and singular
		var re = new RegExp(d.html, 'gi');
		console.log(re, e.replacement);
		findTextReplaceText(re, e.replacement);
		parseCT();
	});
}

/*** Still Important Div Cursor Restore

-Thanks to Rangy ***/

var savedSel = null;

var savedSelActiveElement = null;



function saveSelection() {

	// Remove markers for previously saved selection

	if (savedSel) {

		rangy.removeMarkers(savedSel);

	}

	savedSel = rangy.saveSelection();

	savedSelActiveElement = document.activeElement;

	//gEBI("restoreButton").disabled = false;

//	console.log($('.content_textarea').html());

}



function restoreSelection() {

	if (savedSel != null) {

		rangy.restoreSelection(savedSel, true);

		savedSel = null;

		//gEBI("restoreButton").disabled = true;

		window.setTimeout(function() {

			if (savedSelActiveElement && typeof savedSelActiveElement.focus != "undefined") {

				savedSelActiveElement.focus();

			}

			//saveSelection();

//			console.log($('.content_textarea').html());

		}, 1);

	}

}





/*** Sync Service - Not directly related to files ***/

function GetPanelmain_Sync() {

    return {title: "Sync", bordercolor: "#34495e", width:20};   

}

function RunPanelmain_Sync() {

    out = "<span style='font-size:15'>Sync is On</span><br>This file is currently saved somewhere online. You can access it from a different computer.";

    postPanelOutput(out);

}

function initMathjax() {

    window.Preview = {

  delay: 150,        // delay after keystroke before updating



  preview: null,     // filled in by Init below

  buffer: null,      // filled in by Init below



  timeout: null,     // store setTimout id

  mjRunning: false,  // true when MathJax is processing

  oldText: null,     // used to check if an update is needed



  //

  //  Get the preview and buffer DIV's

  //

  Init: function () {

    this.preview = document.getElementById("latexView");

    this.buffer = document.getElementById("latexView");

  },



  //

  //  Switch the buffer and preview, and display the right one.

  //  (We use visibility:hidden rather than display:none since

  //  the results of running MathJax are more accurate that way.)

  //

  SwapBuffers: function () {

    var buffer = this.preview, preview = this.buffer;

    this.buffer = buffer; this.preview = preview;

    buffer.style.visibility = "hidden"; buffer.style.position = "absolute";

    preview.style.position = ""; preview.style.visibility = "";

  },



  //

  //  This gets called when a key is pressed in the textarea.

  //  We check if there is already a pending update and clear it if so.

  //  Then set up an update to occur after a small delay (so if more keys

  //    are pressed, the update won't occur until after there has been 

  //    a pause in the typing).

  //  The callback function is set up below, after the Preview object is set up.

  //

  Update: function () {

    if (this.timeout) {clearTimeout(this.timeout)}

    this.timeout = setTimeout(this.callback,this.delay);

  },



  //

  //  Creates the preview and runs MathJax on it.

  //  If MathJax is already trying to render the code, return

  //  If the text hasn't changed, return

  //  Otherwise, indicate that MathJax is running, and start the

  //    typesetting.  After it is done, call PreviewDone.

  //  

  CreatePreview: function () {

      //console.log(this);

    Preview.timeout = null;

    if (this.mjRunning) return;

    var text = document.getElementById("latexCmd").innerHTML;

      console.log(this.oldtext, text);

    if (text === this.oldtext) return;

    this.buffer.innerHTML = this.oldtext = text;

    this.mjRunning = true;

      console.log(text);

    

    MathJax.Hub.Queue(

      ["Typeset",MathJax.Hub,this.buffer],

      ["PreviewDone",this]

    );

  },



  //

  //  Indicate that MathJax is no longer running,

  //  and swap the buffers to show the results.

  //

  PreviewDone: function () {

    this.mjRunning = false;

    this.SwapBuffers();

  },

        

  doNothing: function() {

        

    }

};



//

//  Cache a callback to the CreatePreview action

//

Preview.callback = MathJax.Callback(["CreatePreview",Preview]);

Preview.callback.autoReset = true;  // make sure it can run more than once

   

//Initialize all the LaTeX attributes because they look ugly at first (this is seriously going to hurt sync though)

    $('.latex').each(function() {

        $(this).html($(this).attr('data-cmd'));

        console.log($(this).html());

        //console.log(MathJax.Hub);

        MathJax.Hub.Queue(

          ["Typeset",MathJax.Hub,this],

          ["doNothing",Preview]

        );

    });

}

function postLatex(cmd, callbackFnc) {

    if($('#latexdummy').length == 0) {

        $('body').append("<span id='latexdummy' style='display:none'></span>");   

    }

    $('#latexdummy').html(cmd);

    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"latexdummy"], 'getLatex');

    

    

    

//    setTimeout(function() { return $('.latexdummy').html() }, 200);

}



function getLatex() {

    return $('#latexdummy').html();

}



//function doNothing() {

//    

//}

function getLoaderOpts() {

    return {

          lines: 7, // The number of lines to draw

          length: 7, // The length of each line

          width: 8, // The line thickness

          radius: 26, // The radius of the inner circle

          corners: 1, // Corner roundness (0..1)

          rotate: 12, // The rotation offset

          direction: 1, // 1: clockwise, -1: counterclockwise

          color: theme.coloralt, // #rgb or #rrggbb or array of colors

          speed: 1.3, // Rounds per second

          trail: 65, // Afterglow percentage

          shadow: false, // Whether to render a shadow

          hwaccel: false, // Whether to use hardware acceleration

          className: 'spinner', // The CSS class to assign to the spinner

          zIndex: 5, // The z-index (defaults to 2000000000)

          top: 'auto', // Top position relative to parent in px

          left: 'auto'   // Left position relative to parent in px

        };

}   

function getLoader(query, m) {
	$('.spinner').remove();

    var opts = {

          lines: 7, // The number of lines to draw

          length: 7, // The length of each line

          width: 8, // The line thickness

          radius: 26, // The radius of the inner circle

          corners: 1, // Corner roundness (0..1)

          rotate: 12, // The rotation offset

          direction: 1, // 1: clockwise, -1: counterclockwise

          color: theme.coloralt, // #rgb or #rrggbb or array of colors

          speed: 1.3, // Rounds per second

          trail: 65, // Afterglow percentage

          shadow: false, // Whether to render a shadow

          hwaccel: false, // Whether to use hardware acceleration

          className: 'spinner', // The CSS class to assign to the spinner

          zIndex: 5, // The z-index (defaults to 2000000000)

          top: $('#'+query).height()/2-26, // Top position relative to parent in px

          left: $('#'+query).width()/2-26 // Left position relative to parent in px

        };

    var target = document.getElementById(query);

    var spinner = new Spinner(opts).spin(target); 
	console.log($('#'+query).width()/2-26, $('#'+query).height()/2-26);
	$('.spinner').css('position', 'relative').css('left', '50%').css('top', '95px');
	return "";
}

    /*

    return null;

    return new Spinner().spin().el.outerHTML; 

    if(mL == undefined)

        return "<div class='loader10'></div>"; 

    else if(mT == undefined)

        return "<div class='loader10' style='margin-left:"+mL+"px'></div>"; 

    else

         return "<div class='loader10' style='margin-left:"+mL+"px;margin-top:"+mT+"'></div>";
	}

         */
