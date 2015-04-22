var p = panelManager.getAvailablePanels().NYU_Law;
var installed = true;
if(p === undefined) {
    p = new Panel('NYU_Law', 'js/panels/nyu_law.js');
    installed = false;
    panelManager.install(p);
}
//TODO NYU-Inspired Theme: http://www.nyu.edu/employees/resources-and-services/media-and-communications/styleguide/website/graphic-visual-design.html
//JPG of NYU Black Logo - http://nyulocal.com/wp-content/uploads/2010/10/NyuTorch.jpg
p.setManifest({
    bordercolor:'#57068c'    
});
p.onInit = function() {
    //Install format(s) if not already
    if(formatManager.getFormats().NYU === undefined) {
        var nyu = new GltnFormat("NYU", "NYU Law", "Article", "js/formats/nyu_law.js", false);
        formatManager.addFormat(nyu);
    }
    //In case it wasn't loaded, you must reshift the format so that it works.
    console.log(formatManager.getFormats().NYU);
    formatShift();
};
//NOTE Inkblob parameter, CC API
p.onImport = function() {
    return [{
        name: "NYU Law Article", icon: "http://nyulocal.com/wp-content/uploads/2010/10/NyuTorch.jpg", extension: "doc", convert: function(raw, inkblob) { //importedink.url
            cloudConvert("doc", "html", inkblob.url, function(outputdata) {
                window.rawimported = outputdata;
                //Here's where I'll do any type of smart regex to simplify stuff
                //Start ripping out content and inserting it into a file structure
                var imported = new File();
                imported.setLanguage(languageManager.getLanguages().en_us.name);
                var jsonfile = saveFile(imported)[1].gluten_doc;
                //FIXME 1 paragraph; that's not even true
                jsonfile.metadata = {};
                var i = outputdata.indexOf('<meta name="author"');
                outputdata = outputdata.substring(i+29);
                i = outputdata.indexOf('"/>');
                jsonfile.metadata.Author = outputdata.substring(0,i);
                outputdata = outputdata.substring(i);
                
                i = outputdata.indexOf('<div title="header">');
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('</div>');
                outputdata = outputdata.substring(i);
                //Title Grabber
                i = outputdata.indexOf('<br/>');
                var title_html = outputdata.substring(0,i);
                    //Title
                    var ii = title_html.indexOf('<b>')+3;
                    title_html = title_html.substring(ii);
                    ii = title_html.indexOf('</b>');
                    jsonfile.metadata.Title = title_html.substring(0,ii).replace(/\n/gi, " ");
                    ii = title_html.indexOf('<b>')+3;
                    title_html = title_html.substring(ii);
                    ii = title_html.indexOf('</b>');
                    jsonfile.metadata.Subtitle = title_html.substring(0,ii).replace(/\n/gi, " ");
                console.log(jsonfile.metadata.Title);
                
                //Remove ToC, but look for an author footnote first
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('<sup>');
                ii = outputdata.indexOf('<div id="Table');
                console.log((i < ii)+" author's footnote");
                AF = false;
                if(i < ii) {
//                    jsonfile.metadata.AuthorFootnote = true;
                    jsonfile.metadata.AuthorFootnote = $('#sdfootnote1').text().replace(/\n/g, " ").substring(1);
                    AF = true;
                }
                outputdata = outputdata.substring(ii);
                i = outputdata.indexOf('</div>');
                outputdata = outputdata.substring(i);
                
                //Grab Quote -- TODO If available
                i = outputdata.indexOf('<i>')+3;
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('</i>')-1; //-1 Because of loose end-quote.
                jsonfile.metadata.QuoteText = encodeURIComponent(outputdata.substring(0,i).replace(/\n/gi, " "));
                outputdata = outputdata.substring(i);
                
                i = outputdata.indexOf('<br/>')
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('<p>')
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('<font face') + 36;
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('<');
                jsonfile.metadata.QuoteAuthor = outputdata.substring(0,i).trim().replace(",", "");
                
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('<i>') + 3;
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('</i>');
                jsonfile.metadata.QuoteSource = outputdata.substring(0,i).replace(/\n/gi, " ");
                
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('>,')+2;
                outputdata = outputdata.substring(i);
                i = outputdata.indexOf('.<');
                jsonfile.metadata.QuoteYear = outputdata.substring(0,i).trim();
                outputdata = outputdata.substring(i+1);
                
                console.log(jsonfile);
                
                /*
                    Congratulations -- You have ripped out all the metadata (or you probably did :\  )
                    Now load this data into DOM and use jQ selectors to modify things to Gltn attributes.
                */
                $('#build_print').html(outputdata);
                if(AF)
                    $('#sdfootnote1').remove();

                $('#build_print > p > sup a, #build_print > h1 > sup a, #build_print > h4 > sup a, #build_print > h5 > sup a').each(function(n, e) {
                    //This anchor element has a href which is the id in the doc to grab the footnote
//                    console.log(e.name);
                    var footid = "#"+e.name.substring(e.name.indexOf('sdfootnote'),e.name.length-3);
//                    console.log(footid);
                    $(footid+" p a").remove();
                    $(footid+" p span").each(function(n, e) {
                        var t = e.innerHTML;
                        e.innerHTML = t;
                        e.outerHTML = "<font><font>"+e.outerHTML+"</font></font>";  
                    });
                    var out = "";
                    $(footid+" p > font > font").each(function(n, e) {
                        out += e.innerHTML.trim()+"&nbsp;";
                    });
                    $(footid).remove();
//                    console.log(out);
                    //Now to implement this in code...
                    var footnote = e.parentElement;
                    footnote.parentElement.outerHTML = "<span class='footnote footnote"+n+"' data-id='"+n+"' data-note='"+encodeURIComponent(out.replace(/\n/g, ""))+"'>*</span>";
                    
                });
//                return;
                //Modify all headers
                for(i=1;i<=5;i++) {
                    $('#build_print > h'+i).each(function(n, e) {
                        var t = e.textContent.replace(/([A-Za-z\d]+?)\./gi, "").trim();
                        e.outerHTML = "<span class='heading"+i+" heading'>"+t+"</span><br>"; /* Div of header with that text */
                    });
                }
                //Paragraphs
                $('#build_print > p > font').each(function(n, e) {
                    var t = e.textContent;
                    e.outerHTML = t;
                });
                $('#build_print > p > em').each(function(n, e) {
                    var  t = e.textContent;
                    e.outerHTML = "<i>"+t+"</i>";
                });
                //Now that everything is out of tags, remove p's themselves
                $('#build_print > p').each(function(n, e) {
                    var t = e.innerHTML;
                    e.outerHTML = t+"<br><br>";
                }); 
                
                var content = $('#build_print').html().trim();
                imported.jsonsave = {gluten_doc: jsonfile};
                window.importd = imported;
                window.insert = saveFile(imported)[0]+content;
                var title = imported.jsonsave.gluten_doc.metadata.Title;
                title = title.split(" ").slice(0,3).join("_")
                importGltnBlob(insert, title);
                console.log("Import Done");
            })
        }
    }];
};
p.activate();
/*p.onExport = function() {
    return [{
 
    }, {
        
    }];
};*/

/**
    _The order to do things_
    [x] Rip out content, put metadata in metadata blocks.
    [x] place things in tags where needed. 
    [x] Footnote API
    [x] Abstract
    [x] Fix builds
    [x] Now it is a Gltn file
    [x] Develop a format for it, allowing data to come back
    [ ] Finish format, export to style guide
    [ ] CloudConvert result
**/