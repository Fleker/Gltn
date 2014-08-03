Gltn provides basic spreadsheet software accessible in some formats with the "Table" tool. By default, users can supply raw data, numbers and strings, and equations (starting with the equals sign) that is a Javascript statement.

Users can use any javascript command or HTML tag, plus access specific cells in the format `A1` where A is a row and 1 is a column. Formulas may be nested (ie. `A1: 5` -- `A2: =A1+1` -- `A3: =A2+A1+5` as long as it isn't recursive.

Additional spreadsheet commands can be added through a service that the user may install. Some basic commands are included by default.

## A Spreadsheet Function
ID: function( ... )

## Installing Library
Create a service, add functions there

## Documentation
It's good to let users learn more
FNC-DOC is the syntax for a LatexDoc

## Naming Convention
All caps because consistent and different

//FIXME Remove bottom, extend top

### Custom Spreadsheet Commands
To include a function, append an object to the variable Spreadsheet that dictates the function and an object dictating how it should be used for inclusion into the user manual. This should be done on your service's initialization.

```Javascript
    InitPanel{Service_Name} {
        Spreadsheet.myFunction = function(x,y) {
             return x * y;
        }
        SpreadsheetAPI.myFunction = {id: "If", 
            tags: "conditional if boolean", 
            cmd: "IF(bool, true, false", 
            param:[{id:"bool", des:"A conditional statement"}, {id:"true", des:"The value to return if true"}, {id:"false", des:"The value to return if false"}], 
            des: "The value is different depending on the conditional statement"}
    }
```

### User Manual
The manual exists as a reference guide for users. It includes every instance in the global SpreadsheetAPI variable. When it is opened, users are able to search for specific commands or search for what they want to happen (using the tags). When a given command is found, it is displayed in the popup to give users an idea of how the function should be called.

* id - The title of the function
* tags - Natural language tags, space separated, to facilitate search
* cmd - A preview of how the command will look in the formula bar
* param - An array of parameters for the given function. `id` is the name of the parameter and `des` is a short description of what the parameter's value should be
* des - A description of what the function will do

### User Experience
Users are able to call your function from the formula bar. `=myFunction(B1,B2)` is input and the system will add in the necessary variable calls to generate a legal statement. Thus, the user's function is automatically turned into `=Spreadsheet.myFunction(Spreadsheet.B1,Spreadsheet.B2)` and stored in that format. When the formula bar populates the equation again, the "Spreadsheet." pattern is removed from the formula to return to its original input.

### Naming Convention
There is no mandatory way to name functions. However, it is recommended that the function name is completely capitalized. This will bring attention to the fact that it is a function rather than plain text. Also, it will distinguish itself from regular javascript functions. `if() { }` is a conditional in regular Javascript. A user may find it easy to instead choose `IF(1==1, "True", "False")`