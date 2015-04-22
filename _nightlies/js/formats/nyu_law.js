/*
    Metadata
        -Author
        -Title
        -Subtitle
        -Author's Footnote (before ToC)
        -Quote (text, author, src, year)
    */
//TODO Quote Number/Int
function onInitFormat() {
    new_format();
    new_format_item("text", {id: AUTHOR, label: "Your Name", description:"If several authors, separate each by a comma"});
    new_format_item("text", {id: TITLE, label:"Title"});
    new_format_item("text", {id: "Subtitle", label:"Subtitle"});
    new_format_item("mltext", {id:ABSTRACT, label:"Abstract", mtype:"w", min: 50, max:250});
    new_format_item("mltext", {id:"AuthorFootnote", label:"About the Author", description:"This will appear as a footnote", mtype:"w", min: 25, max:100});
    new_format_item("label", {label:"Quote", description:"You may include a short quote before the beginning of the document"});
    new_format_item("text", {id:"QuoteAuthor", label:"Quote's Author"});
    new_format_item("text", {id:"QuoteSource", label: "Source"});
    new_format_item("text", {id: "QuoteYear", label:"Year"});
    new_format_item("mltext", {id:"QuoteText", label:"Write Quote Here:"});
    new_format_item("content");
    post_format();
}
function onStylePaper() {
    enable_format("double space");   
}
function onBuildFormat(d) {
    console.log(d);
    d.add("<div style='font-size:18pt;text-transform:uppercase;text-align:center;'>"+valMetadata(TITLE)+" "+valMetadata("Subtitle")+"</div><br>");
    d.add("<div style='/*font-variant:small-caps*/'>"+valMetadata(AUTHOR)+(valMetadata("AuthorFootnote").length>0?"<sup>*</sup>":"")+"</div><br>");
    d.add("<div style='font-style:italics;font-size:12pt;margin-left:1em;margin-right:1em;'>"+valMetadata(ABSTRACT)+"</div>");
    //ADD AUTHORS FOOTNOTE TO FOOTER
    var afp = d.find('Primary_0');
    afp.addFooter("<sup>*</sup>&nbsp;"+valMetadata("AuthorFootnote"));
//    d.add("<div id='table_of_contents'></div>");
    d.newSection("Body");
    d.newPage();
    console.log(valMetadata("QuoteYear"));
    d.add("<div style='text-align:right;font-style:italics;'>"+'"'+valMetadata("QuoteText")+'"'+"</div><div style='text-align:right;'>"+valMetadata("QuoteAuthor")+", <i>"+valMetadata("QuoteSource")+"</i>, "+valMetadata("QuoteYear")+"</div><br>");
    return d;
}
function onSetHeader(doc) {
    //TODO
}
function onGetFormats() { 
    var obj = {};
	obj.heading1 = "<div style='font-weight:bold; text-align:center; width:100%;'>LISTI.<br>TEXT</div>";
	obj.heading2 = "<div style='font-style:italics'>&emsp;LISTA. TEXT</div>";
	obj.heading3 = "<div style='font-style:italics;text-align:center'>LIST1. TEXT</div>";
	obj.heading4 = "<div style='font-style:italics;text-align:center'>LISTi. TEXT</div>";
	obj.heading5 = "<div style='text-decoration:underline'>LISTa. TEXT</div>";
	obj.paragraph_indent = "&emsp;";
    obj.table = function(table,row,col) {
        out = "<br><span style='display:block;text-align:center'>Table FIGN. TEXT</span><table style='border-collapse:collapse;border:solid 1px black;width:100%;'>";
        for(i="A".charCodeAt();i<col.charCodeAt();i++) {
            out += "<tr>";
            for(j=1;j<=row;j++) {
                var v = table[String.fromCharCode(i)+j];
                out += "<td data-theme='false' style='border:solid 1px black'>"+v+"</td>";
            }
            out += "</tr>";
        }
		out += "</table>";
		return out;
	};
	
	obj.citation = "(AUTHOR_LAST PAGE)";
	obj.citation_main = "(PAGE)";
	obj.citation_noauthor = '("TITLE" PAGE)';
	obj.citation_twolastnames = '(AUTHOR_FIRST_I. AUTHOR_LAST PAGE)';
	obj.citation_twoauthors = '(AUTHOR_LAST and AUTHOR_LAST PAGE)';
	obj.citation_threeauthors = '(AUTHOR_LAST, AUTHOR_LAST, and AUTHOR_LAST PAGE)';
	obj.citation_manyauthors = '(AUTHOR_LAST et al. PAGE)';
	obj.citation_sameauthorarticle_main = '("TITLE" PAGE)';
	obj.citation_sameauthorbook_main = '<div style="display:inline">(<i>TITLE</i> PAGE)</div>';
	obj.citation_sameauthorarticle = '(AUTHOR_LAST, "TITLE" PAGE)';
	obj.citation_sameauthorbook = '(AUTHOR_LAST, <i>TITLE</i> PAGE)';
	obj.citation_multivolume = '(VOLUME: PAGE)';
	obj.citation_bible = '<div style="display:inline">(<i>TITLE,</i> BIBLEBOOK. BIBLECHAPTER.BIBLEVERSE)</div>';
	obj.citation_bible_main = '(BIBLEBOOK. BIBLECHAPTER.BIBLEVERSE)';
	obj.citation_editions = "";
    
    obj.footnoteDivider = "<hr style='width:2in;display:block;'></hr>";
    obj.footnote = "&emsp;<sup>INDEX</sup>&nbsp;NOTE";
    obj.inlineFootnote = "<sup class='footnote' data-note='NOTE'>INDEX</sup>";
    return obj;
}
//NOTE
function onGetToolbar() {
    return {tools: ["citation", "heading1", "heading2", "heading3", "heading4", "heading5", "footnote"], allowCustom: false};   
}
//NOTE
function onFinishBuild(doc) {
    //TODO
    //Runs when pages finish compiling, can be used for last minute adjustments
    //Table of contents
    console.log(doc);
    var s = doc.sections['Primary'];
//    s.addBody("<b>Table of Contents</b>");
    //Add headings first, pages on second run
    var h1 = 0;
    var h2 = 0;
    var h3 = 0;
    var h4 = 0;
    var h5 = 0;
    console.log("Start Table of Contents Generation");
//    return;
    $(doc.getHtml()).filter('.heading').each(function(n, e) {
        if(e.classList.contains("heading1")) {
            h1++;
            s.addBody("<div id='"+e.className.split(' ').join('_')+">"+numToRoman("I", h1)+".&nbsp;"+$(e).html()+"</div>");
        } else if(e.classList.contains("heading2")) {
            h2++;   
            s.addBody("<div id='"+e.className.split(' ').join('_')+">"+numToLetter("A", h2)+".&nbsp;<i>"+$(e).html()+"</i></div>");  
        } else if(e.classList.contains("heading3")) {
            h3++;   
            s.addBody("<div id='"+e.className.split(' ').join('_')+">&emsp;"+h3+".&nbsp;<i>"+$(e).html()+"</i></div>");  
        } else if(e.classList.contains("heading4")) {
            h4++;   
            s.addBody("<div id='"+e.className.split(' ').join('_')+">&emsp;&emsp;"+numToRoman("i", h4)+".&nbsp;<i>"+$(e).html()+"</i></div>");  
        } else if(e.classList.contains("heading5")) {
            h5++;   
            s.addBody("<div id='"+e.className.split(' ').join('_')+">&emsp;&emsp;"+numToLetter("a", h5)+".&nbsp;<i>"+$(e).html()+"</i></div>");  
        }
    });
    doc.assignPages();
    var LINE_LENGTH = 24;
    $(doc.getHtml()).filter('.heading').each(function(n, e) {
        //Get previously created element
        var el = $('#'+e.className.split(' ').join('_'));
        //Get the page that is on
//        var pg = $(e.parentElement.parentElement).attr('data-page-num');
        var pg = $(e.parentElement).attr('data-page-num');
        //Get the original text
        var og = $(el).html();
        //Now let's add n periods
        var og_h = $(el).height();
        var periods = 0;
        if($(el).height() > LINE_LENGTH) {
            $(el).append(pg);
        } else {
            while($(el).height() <= LINE_LENGTH) {
                $(el).html(og);
                for(i=0;i<periods;i++) {
                    $(el).append("&nbsp;");
                }
                $(el).append(pg);
                periods++;
            }   
        }
        //So, we can use n-1 periods
        $(el).html(og);
            for(i=0;i<periods-1;i++) {
                $(el).append("&nbsp;");
            }
            $(el).append(pg);
    });
}