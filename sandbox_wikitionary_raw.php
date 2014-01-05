<html>
<head>
<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
  <script type="text/javascript">
var baseURL = 'http://en.wiktionary.org';
function showPage(page,text) {
  var sourceurl = baseURL + '/wiki/' + page;
  $('#pagetitle').text(page);
  $('#wikiInfo').html(text);
  $('#sourceurl').attr('href',sourceurl);
  $('#licenseinfo').show();
 
  // now you can modify content of #wikiInfo as you like
  $('#wikiInfo').find('a:not(.references a):not(.extiw):not([href^="#"])').attr('href',
    function() { return baseURL + $(this).attr('href');
  });
  // ...
}
$(document).ready(function() {
  $('#pagetitle').hide();
  $('#word').on('input', function() {
    var page = this.value;
    $('#wikiInfo').html('...please wait...');
	console.log(baseURL+'/w/?action=raw&title='+page);
    $.getJSON(baseURL+'/w/?action=raw&title='+page,
    function(json) {
		window.json = json.parse.text;
      if(json.parse.revid > 0) {
        showPage(page,json.parse.text['*']);
      } else {
        $('#wikiInfo').html('word not found');
        $('#licenseinfo').hide();
      }
    });
  });
});
  </script>
</head>
<body>
  Lookup a word: <input type="text" id="word" />
  <h1 id='pagetitle'></h1>
  <div id="wikiInfo"></div>
  <div id="licenseinfo" style="font-size:small; display:none;">
    Modified original content <a id='sourceurl'>from Wiktionary</a>.
    Text available under <a href="http:Content is available under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution/Share-Alike License</a>.
  </div>
</body>
</html>