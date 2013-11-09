<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>HTML Parser For Use in the Gluten Core</title>
<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>

</head>

<body>
<div id="a"><i>Hello My</i> World. <span style="color:red">How are you?</span><div style="font-style:italic">A. Using Money to Buy Politicians</div></div>

<script>
/*** Replace output function so that it places every item into an array instead of just outputting ***/
function c(s) {
	console.log(s);	
	s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	$('body').append(s+"<br>");
}
function output(e, tag, w) {
	var out = "";
	if(e.substr(-1) != ">")
		e = e+">";
	if(w.length) {
		if(tag.length) {
			c("Output: "+tag+w+"</"+e.substr(1)+" ");
			out = tag+w+"</"+e.substr(1)+" ";
			//return tag+w+"</"+e.substr(1)+" ";
		} else {
			c("Output: "+w+" ");
			out = w+" ";
			//return w+" ";
		}
	} else {
		//return "";
	}
	if(out.length)
		d.push(out);
	return out;
	
}
//div joiner
$('#a > div').html( $('#a > div').html().replace(/ /g, '---'));

var a = document.getElementById('a').innerHTML;
var b = a.split('');
var d = new Array();
var e = '';
var w = '';
var tag = '';
var intag = false;
var inend = false;
var ine = false;
var out = "";
var breakk = false;
$('body').append("<hr>");
for(i in b) {
	var b1 = (parseInt(i)+1);
	c(": "+b[i]);
	breakk = false;
    if(b[i] == "<") {
        if(b[b1] == "/") {
			 /***/
			 out = out + output(e, tag, w);
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c(tag+", "+e+"; "+w);
            w = '';
			
            inend = true;  
			intag = false;
			ine = false;
            tag = "";
            e = "";
			c("End of tag");
        } else {
             /***/
			 out = out + output(e,  tag, w);
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c(tag+", "+e+"; "+w);
            w = '';
			
			 intag = true;
             ine = true;
			 tag = "";
			 e = "";
			
        }
		c("<"+b[b1]+" !");
    }
    if(b[i] == " ") {
        if(ine) {
            ine = false; 
			c("ine "+e);  
        }
        if(!intag) {
            out = out + output(e, tag, w);
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c("___"+tag+", "+e+"; "+w);
            w = '';
            breakk = true;
        }
    }
	if(!breakk) {
		if(intag) {
			tag = tag + b[i]; 
			c("tag "+tag);
		} else {
			 w = w + b[i];
			 c("w "+w);
		}
		if(ine) {
			e = e + b[i];
			c("E "+e);
		}
		
		if(b[i] == ">") {
			intag = false;
			ine = false;
			c("Intag is off");
		}
	}
}
 /***/
	 out = out + output(e, tag, w);
	//$('body').append(tag+",<br>"+e+"; "+w+"<br>");
	c(tag+", "+e+"; "+w);
	w = '';
//div splitter
out = out.replace(/---/g, ' ');
$('body').append('<hr>'+out);
</script>
</body>
</html>