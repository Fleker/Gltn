LaTeX is a great, easy way to display math. 

`postLatex(txt)` - Commits that string to be converted
`getLatex()` - Returns HTML that is properly formatted

##### Text to LaTeX
These two functions will translate a command into formatted output.

```Javascript
    postLatex("$x^2$");
    var x = getLatex();
```
* postLatex(cmd, callback) - Receives a command as a string and translates it into formatted output. The MathJax library may take some time to process the input, so the output shouldn't be retrieved directly. Rather, you must call a separate function to access the output.
* getLatex() - Retrieves the formatted output as HTML

<img src='http://felkerdigitalmedia.com/gltn/images\blog\latex_popup.png'>


##### LatexAPI
You can access pieces of the LaTeX reference much like the Spreadsheet reference. They're also formatted the same
`window.LatexAPI`

<img src='http://felkerdigitalmedia.com/gltn/images\blog\latex_docs2.png'>
