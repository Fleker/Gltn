While you may know all of the great formulas you've created, it won't do any good if a user is unable to know what they are and how to use them. In addition to creating your formulas, you should also create documentation that explains how to use the formula.

The formula guide will appear in the ribbon, using the <a href='?User%20Interfacing/Holoribbon'>Holoribbon API</a>.
<img src="http://felkerdigitalmedia.com/gltn/images\blog\grid_search.png">

## DOC Properties
First, to add a doc, you add another property to the `Spreadsheet` object in the form of [formula]_DOC

ie.
`MYFUNC_DOC`
Properties with this type of name are filtered to find documentation and for custom operators.

## Property Value
A doc should be set to an object of class `SpreadsheetDoc`.

`SpreadsheetDoc(id, keywords, script, parameters, description, title, regexpIn, regexpOut)`

* id - The expression id, `MYFUNC`
* keywords - Tags that can be used to help find the doc, `function mine`
* script - An example of the code to be used, `MYFUNC(param)`
* parameters - An array of `Parameter` objects, each one used to describe a parameter, `[new Parameter("param", "A String used for the function")]`
* description - Description of what the formula does or returns, `Returns some text`
* title - The title for this document, `How to Display Myfunction`
* regexpIn / regexpOut - Look at the article "Custom Operations" for more detail on how to use these parameters. They are both optional.

### Parameter Class
`Parameter(id, description)`

* id - The name of the parameter
* description - What the parameter represents

## Examples
### IF Formula
```Javascript
    IF: function(bool, tr, fl) {
            if(bool) {
                return tr;    
            } else {
                return fl;   
            }
        },
    IF_DOC: new SpreadsheetDoc("IF", "if conditional then else boolean", "IF(bool, true, false)", [new Parameter("bool", "A conditional statement"), new Parameter("true", "The value to return if true"), new Parameter("false", "The value to return if false")], "Changes the output depending on the conditional statement", "How to Create a Conditional"),
```
### Subscript
```Javascript
    SUB: function(str) {
            return "<sub>"+str.toString()+"</sub>";   
        },
    SUB_DOC: new SpreadsheetDoc("SUB", "element sub subscript", "SUB(str)", [new Parameter("str", "The string to display in a subscript")], "Displays a subscript", "How to Create a Subscript"),
```