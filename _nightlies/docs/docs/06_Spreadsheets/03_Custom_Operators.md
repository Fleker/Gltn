The standard function syntax is great. It's easy to follow, it encapsulates information, and it's very extendable. However, for simple operations, it becomes way more text than is necessary. For example, what if a language used this syntax for arithmetic:

`var a = multiplication(addition(1,2),3);`

Instead of making things easier to follow, it's much more complicated and harder to read than using common operators: `(1+2)*3`

There's advantages to each, but often developers don't get a choice. In most occasions, there's no way to create a custom operator. However, developers can create operators to use for spreadsheet formulas. This means that functions can be created faster and read easier. Just keep in mind the balance. Don't override stock operators and don't use operators that may be accidentally created (like letters). Also, don't use operators that may be almost impossible to create (like ☃).

Even if you use an operator, a user may use the longform of the formula to get the same result.

## DOC Parameters
The operator using regular expressions to detect an expression and replace it with your longform formula internally which the correct data provided. In your documentation, there are two parameters at the end which are used. `regexpIn` is the operator pattern to detect. `regexpOut` is the expression that will replace the operator.

`Spreadsheet.MYFUNC_DOC = new SpreadsheetDoc( ..., "(m)&(m)", "Spreadsheet.MYFUNC($1, $2)");`

## Example
Let's explore how this can be done using the provided exponent formula.

In Javascript, there is no exponent operator. Instead, users must write `Math.pow`. This isn't a particularly simple function, so I'd like to create an exponent formula and use a carat as the operator like in other languages.

First, I create the formula:

```Javascript
     EXP: function(base, pow) {
            return Math.pow(base, pow);   
     },
```

Now users can type `=EXP(5,3)` which is faster and feels a little more consistent, but I'd still like an easier way to do it.

Below is the formula's documentation:
```Javascript
    EXP_DOC: new SpreadsheetDoc("EXP", "exponent to square", "EXP(base, power)", [new Parameter("base", "The number to be given an exponent"), new Parameter("power", "The power of the exponent")], "Exponent of a number", "How to Create Exponents");
```

Now I just add two additional parameters to this in order to create an operator:
```Javascript
    EXP_DOC: new SpreadsheetDoc("EXP", "exponent to square", "EXP(base, power)", [new Parameter("base", "The number to be given an exponent"), new Parameter("power", "The power of the exponent")], "Exponent of a number", "How to Create Exponents", "(\\d+)\\^(\\d+)", "Spreadsheet.EXP($1, $2)")
```

*Note:* Be sure to use two backslashes in place of a single backslash so that the regular expression is formed correctly.