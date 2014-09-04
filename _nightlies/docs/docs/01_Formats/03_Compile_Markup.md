When using the `onGetFormats()` function, a developer can customize the way that a paper looks to a high degree of precision. This guides you on how the markup established for each type of item. As each type of object is different, the rules for each are slightly different.

### General
The following are a list of functions that will create specific outputs.
For these functions, the first input is the text you want returned. The second input is optional, it is the size of the font you want returned.

* `centerText(txt, size)` - Centers text in boundary (includes borders)
* `boldText(txt, size)` - Makes text bold
* `italicizeText(txt, size)` - Makes text italicized 
* `boldItalicizeText(txt, size)` - Makes text bold and italicized
* `sizeText(txt, size)` - Makes text a specific size
* `oneColumnText(txt)` - Makes text in a single column
* `twoColumnText(t1, t2)` - Places text in two columns
* `threeColumnText(t1, t2, t3)` - Places text in three columns

### Headings
* `obj.heading1` 
* `obj.heading2`
* `obj.heading3`
Each item takes a string, usually a `<div>` that will be the HTML output for the heading.

#### Markup
You may use any of the following markup to dynamically modify the output.

* `TEXT` - The heading name
* `TEXT%sc` - The heading name using small capital letters in place of lowercase letters
* `LISTA` - The position of the heading represented by a capital letter
* `LISTa` - The position represented as a lowercase letter
* `LIST1` - The position represented as a number
* `LISTI` - The position represented as an uppercase roman numeral
* `LISTi` - The position represented as a lowercase roman numeral

### Figure Number
In many cases, you will want to label images and other figures with a numerical representation. You can give elements a figure number using this function and you can recall it later when marking up the object.

```JavaScript
    obj.figure = function x() {
        var i = 1;
        $('.draft .table, .draft .img').each(function() {
            $(this).attr('data-figure-number', i);
            i++;
        });
    };
```

### Images

* `obj.image` - The markup for displaying the image and attributes related to it
* `obj.imagestyle` - An array of CSS commands to style the image itself

#### Markup - Image

* `IMG` - Places the image, styled with `imagestyle` commands
* `FIGN` - The figure number
* `TEXT` - The description of the image

`obj.img = "IMG Fig. FIGN. TEXT";`

#### Imagestyle
This is an array containing the property and its value
`obj.imgstyle = new Array('width','100%','text-align','center','font-size','8pt','display','block');`

### Tables
`obj.table` - A function that displays the table using the specified rules

This function has three parameters. The first JSON object of the table. The second and third are the number of rows and columns in the table. The column parameter is a letter, so it must be converted between an integer and a character where necessary. The example below shows how to label the table as well as render the table in HTML. For your own purposes you may want to adjust some of the style options.

```JavaScript
    obj.table = function(table,row,col) {
        out = "<br><span style='display:block;text-align:center'>Table FIGN. TEXT</span><table style='border-collapse:collapse;border:solid 1px black;width:100%;'>";
        for(i="A".charCodeAt();i<col.charCodeAt();i++) {
            out += "<tr>";
            for(j=1;j<=row;j++) {
                var v = table[String.fromCharCode(i)+j];
                out += "<td style='border:solid 1px black'>"+v+"</td>";
            }
            out += "</tr>";
        }
		out += "</table>";
		return out;
	};
```

To refer to a specific table cell using the table object, you must call `table['row'][row #]['cell'][col #]`

#### Markup
* `FIGN` - The figure number of the table if it has one
* `TEXT` - The title of the table
* `TEXT%sc` - The title in small caps

### Variables
* `nptfont` - The default font-size in the paper
* `column` - The number of columns in the paper