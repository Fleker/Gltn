### Function
The global JSON object `Spreadsheet` contains all the relevant formulas and documentation. To create your own, you can easily add a new attribute using a browser console.

`Spreadsheet.MYFUNC = function() { return "HELLO WORLD"; }`

Once that is applied, open the Grid plugin and `Spreadsheet` will be moved to a web worker to do background processing. 

Then you just need to focus on a cell and type in the command that will activate your function:
`=MYFUNC()`

The web worker will automatically that `MYFUNC` is the name of function and decide to compute the function.

If your function included parameters, you would type the parameters inside the parenthesis. Since your function does not have any parameters, a simple string, `"HELLO WORLD"` will be displayed in the cell.

### Constant
If, instead of a function, you wanted to create a constant, you would just set the JSON property to a constant value instead of a function.

`Spreadsheet.GRAVITY = 9.805`

Then, `=GRAVITY` would display `9.805`. This constant can be chained with other formulas. It can be treated just like a plain number. (This also applies to results returned from functions. If a function returns a String, it is the same thing as a String in Javascript)

Eg.

`=GRAVITY * 2`

`=GRAVITY ^ 3`

`=IF(GRAVITY == 9.805, MYFUNC(), MYFUNC().substring(0,5))`

### Return Types
A formula may return a String, a number, or HTML. HTML can be created an placed into a spreadsheet cell just like a table cell in HTML. You can also do so directly from the formula input: `<i>Hello</i>` will actually display the text in italics.

## Create a Series of Formulas
The best way to insert a series of Spreadsheet formulas to create a new Service and install these formulas on initialization.
```Javascript
    var s = new Service("PHYSICS", "js/physics.js");
    s.onInit = function() {
        Spreadsheet.GRAVITY = 9.805;
        Spreadsheet.GRAVITY_DOC = { ... };
    }
```

## Distribute a Library
When you have a series of formulas and accompanying documentation, you can submit it to the Gltn Store and it will show up as a Spreadsheet library. Users may install the library and then be able to use the formulas. If a user does not have the library installed and try to use a custom formula, they will receive an error that the variable is undefined. This will not impact the ability of the table to compile unless the table is opened. Then a compiled table will show errors.
