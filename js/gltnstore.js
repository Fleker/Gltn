
/*** Store-Related Code ***/
function getBaseLog(y, x) {
    return Math.log(y) / Math.log(x);
}
function launchStore() {
	//Grab store data
	falseBuild(true);
	setTimeout('launchStore2()', 251);
}
function launchStore2() {
	console.log('ba');
	$('.build').append("<div style='background-color:"+theme.normbg+";width: 100%;margin-left: 0%;margin-top: 10px;padding-top: 10px;padding-bottom: 40px;color:"+theme.normcolor+"'><div style='font-size:18pt;color:"+theme.coloralt+"font-family:sans-serif;text-align:center;'>Gltn Plugin Store</div><br><div style='text-align:center; width:100% ;font-size:18pt; padding-bottom:20px;' class='fa-stack fa-lg'><span class='fa fa-circle-o fa-stack-2x'></span><span class='fa fa-shopping-cart fa-stack-1x'></span></div><input type='search' placeholder='Search for something...' style='width:75%;margin-left:15%;' id='store_search'><div id='build_inner' class='build_inner'>"+getLoader('build_inner')+"</div></div>");
	$('.build').css('line-height', '1em');
	function getIcon(datum) {
		if(datum.icon_fa != undefined) 
			return "<span class='fa fa-"+datum.icon_fa+"'></span>";
		else if(datum.icon_url != undefined)
			return "<img src='"+datum.icon_url+"'>";
		else if(datum.icon_text != undefined)
			return "&emsp;"+datum.icon_text+"&nbsp;";
		return "";
	}
	function getIconHD(datum) {
		if(datum.icon_fa != undefined) 
			return "<span style='font-size:18pt' class='fa fa-"+datum.icon_fa+"'></span>";
		else if(datum.icon_url != undefined)
			return "<img src='"+datum.icon_url+"'>";
		else if(datum.icon_text != undefined)
			return "<span style='font-size:18pt'>"+datum.icon_text+"&nbsp;";
		return "";
	}
	function isInstalled(datum) {
		return ((datum.type == "Panel" || datum.type == "Service") && window.settings.panels.indexOf(datum.id) > -1) || (datum.type == "Dictionary" && window.settings.dictionary.indexOf(datum.id) > -1) || (datum.type == "Theme" && window.settings.theme.indexOf(datum.id) > -1)
	}
	function getDownloadCount(number) {
		if(number < 10)
			return "A few downloads";
		else {
			//console.log(getBaseLog(number, 10),Math.floor(getBaseLog(number, 10)),Math.pow(10, Math.floor(getBaseLog(number, 10))),Math.floor(number/Math.pow(10, Math.floor(getBaseLog(number, 10)))));
			var n = Math.pow(10, Math.floor(getBaseLog(number, 10)))*Math.round(number/Math.pow(10, Math.floor(getBaseLog(number, 10))))
			return "About "+ n + " downloads";
			//Math.round(10*(n/Math.pow(10, Math.floor(getBaseLog(n,10)))))	
		}
	}
	function searchTermed(datum) {
		n = $('#store_search').val().toLowerCase();
		if(datum.name.toLowerCase().indexOf(n) > -1)
			return true;
		else if(datum.credit.toLowerCase().indexOf(n) > -1)
			return true;
		
		return false;
	}
	
	function grabStore() {	
	$.get('http://felkerdigitalmedia.com/gltn/php/storefront.php', {}, function(data) {
		d = $.parseJSON(data);
		//console.log(d)
        $('.loader10').remove();
        //Panels, Dictionaries, Themes, Plugins
		pout = "";
		dout = "";
		tout = "";
        lout = "";
		d = d.app;
		window.store = d;
		for(i in d) {
			out = "";
			//console.log(d[i], d[i].parent);
			//if(d[i].parent == "app") {
			if(searchTermed(d[i])) {
				out += "&emsp;"+getIcon(d[i]);
				out += "&nbsp;<b>"+d[i].name+"</b>";
				if(isInstalled(d[i])) {
					out += "&emsp;<span style='color:green;font-size:8pt' class='fa fa-check'></span><span style='font-size:6pt;color:green'>ADDED</span>";	
				}
				out += "<br>&emsp;&emsp;<i style='font-size:10pt'>"+d[i].credit+"</i>";
				if(d[i].description.length > 100)
					out += "<div style='font-size:8pt;padding-left:40px;padding-right:5px;padding-top:8px;'>"+d[i].description.substring(0,100)+"...</div>";	
				else
					out += "<div style='font-size:8pt;padding-left:40px;padding-right:5px;padding-top:8px;'>"+d[i].description+"</div>";
				
				outt = "<div style='border:solid 1px "+theme.coloralt+";font-size:13pt;cursor:pointer;background-color:"+theme.bgcolor+";padding-top:5px;margin-top:-1px;color:"+theme.coloralt+";min-height:100px;' class='store_item' data-id='"+i+"'>"+out+"</div>";
				//console.log(i, outt);
				if(d[i].type == "Panel")
					pout += outt;
				else if(d[i].type == "Dictionary")
					dout += outt;
                else if(d[i].type == "Theme")
                	tout += outt;
				else	
					lout += outt;
			}
			//}
		}
		var nosearch = "<div style='text-align:center'>No results</div>";
		if(pout.length == 0 && dout.length == 0 && tout.length == 0 && lout.length)
			dout = "<br><br><b>Sorry. No results for that search were found.</b>";
		else {
			if(pout.length == 0)
				pout = nosearch;
			if(dout.length == 0)
				dout = nosearch;
			if(tout.length == 0)
				tout = nosearch;
            		if(lout.length == 0)
				lout = nosearch;
		}
		
		$('.build_inner').html("<div class='store_submit' style='text-align:center; font-size:10pt; text-decoration:underline; cursor:pointer;'>Submit a Plugin</div><br><table style='width:80%;margin-left:10%;'><tr><td style='width:25%;vertical-align:top;'><u class='centerOfAttention'>Panels/Services</u>"+pout+"</td><td style='width:25%;vertical-align:top;'><u class='centerOfAttention'>Dictionaries</u>"+dout+"</td><td style='width:25%;vertical-align:top;'><u class='centerOfAttention'>Themes</u>"+tout+"</td><td style='width:25%;vertical-align:top;'><u class='centerOfAttention'>Plugins</u>"+lout+"</td></tr></table><br><br><br>");
		$('.store_item').on('click', function() {
			var i = store[$(this).attr('data-id')];
			title = getIcon(i)+"&emsp;"+i.name;
			ht = threeColumnText("<div style='padding-left:16px;opacity:0.7;'>"+i.type+"<br>"+i.credit+"</div>", "<div style='font-size:9pt;opacity:0.7;'>v "+i.version+"<br>"+getDownloadCount(i.install)+"</div>", "")+"<br>";
			ht += "<div style='margin-left:10%;width:80%;font-size:12pt;'>"+i.description+"</div>";
			if(isInstalled(i)) 
				ht += "<br><br><br>&emsp;<span style='color:green;font-size:12pt' class='fa fa-check'></span><span style='font-size:10pt;color:green'>&nbsp;You've already installed this.</span><br><button class='textbutton store_uninstall' data-id='"+$(this).attr('data-id')+"'>Uninstall</button>";	
			else
				ht += "<br><br><br>&emsp;<button class='textbutton store_install' data-id='"+$(this).attr('data-id')+"'>Install Now</button>";
			initiatePopup({title: title, ht: ht, bordercolor: '#222'});
			$('.store_install').on('click', function() {
				var i = store[$(this).attr('data-id')];
				y = confirm("Install "+i.name+"?");
				if(y == true) {
					if(i.type == "Panel" || i.type == "Service") {
						install_panel(i.id, i.name, getIconHD(i), i.url, (i.type != "Panel"), i.key);
						$.get('storepost.php', {item: i.id, action: 'Download'}, function() {
							console.log('Panel installed');
						});
						alert('Panel installed');
					}
					else if(i.type == "Dictionary") {
						install_dictionary(i.type_d, i.url, i.name, i.id, getIconHD(i));	
						$.get('storepost.php', {item: i.id, action: 'Download'}, function() {
							console.log('Dictionary installed');
						});
						alert('Dictionary added')
					}
					else if(i.type == "Theme") {
						install_theme(i.id, i.name, i.url, getIconHD(i));
						$.get('storepost.php', {item: i.id, action: 'Download'}, function() {
							console.log('Theme installed');
						});
						alert('Theme added');
					} else
						alert('Unknown data');
					closePopup();
					grabStore();
				}
			});
			$('.store_uninstall').on('click', function() {
				var i = store[$(this).attr('data-id')];
				y = confirm("Are you sure that you wish to uninstall "+i.name+"?");
				if(y == true) {
					if(i.type == "Panel" || i.type == "Service" || i.type == "Spreadsheet Library" || i.type == "Converter") {
						//install_panel(i.id, i.name, getIcon(i), i.url);
						uninstall_panel(i.id);
						$.get('storepost.php', {item: i.id, action: 'Uninstall'}, function() {
							console.log('Panel uninstalled');
						});
						alert('The panel was uninstalled.');
					}
					else if(i.type == "Dictionary") {
						uninstall_dictionary(i.id);	
						$.get('storepost.php', {item: i.id, action: 'Uninstall'}, function() {
							console.log('Dictionary uninstalled');
						});
						alert('The dictionary was removed.')
					}
					else if(i.type == "Theme") {
						uninstall_theme(i.id);
						$.get('storepost.php', {item: i.id, action: 'Uninstall'}, function() {
							console.log('Theme uninstalled');
						});
						alert('The theme was removed.');
					}
					else
						alert('Unknown data');
					closePopup();
					grabStore();
				}
			});
		});
		$('.store_submit').on('click', function() {
			//alert('Open rules');
			out = "<div style='margin-left:5%'>The plugin you submit must be uncondensed javascript so it may be reviewed. Your plugin must meet the following guidelines. Keep in mind that they may seem vague, and there is room to compromise.<br><ul><li><b>1. Integration</b> Your plugin may not secretly manipulate user data. This includes but isn't limited to deleting settings and files as well as adding settings and files without the user's consent or knowledge. Also, your plugin should use the APIs and procedures recommened.</li><li><b>2. Function</b> Your plugin must meet its specified function and not secretly run other code. This includes but isn't limited to attacking servers, running malicious code, or interfering with the user in a malicious way.</li><li><b>3. Classiness</b> Your plugin must be tastefully presented. This includes but isn't limited to showing pornography, insulting the user or any other individual, and presenting information in a tasteful manner.</li></ul></div><br>If your plugin meets these guidelines, <a href='mailto:handnf+gltn@gmail.com?subject=Gltn%20Store%20Submission&body=Please%20fill%20out%20the%20following%20information%20for%20appearing%20in%20the%20store%3A%0A%0AProject%20Name%3A%0AProject%20ID%3A%0ADeveloper%20Name%3A%0AIcon%20(Font-Awesome%2C%20IMG%2C%20or%20Text)%3A%0AGive%20a%20brief%20description%20of%20the%20project%3A'> Send an email</a> with the code attached for review.";
			initiatePopup({title: "Submit to Store", ht: out, bordercolor: '#222'});
		});
	})	
	.fail(function() {
		out = "<span style='font-size:20pt'>Sorry</span><br>The store is not available right now. Please try later.";
		$('.build_inner').html(out);
	});
	}
	grabStore();
	$('#store_search').on('input', function() {
		grabStore();
	});	
}