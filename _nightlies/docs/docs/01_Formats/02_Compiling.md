The compile APIs are explained here, showing you how to create the perfect paper.

## `onStylePaper()`
This function is the first one called. This sets up all of the preliminary settings that apply to the entire paper.

Any code can technically be run here, but this is the spot where `enableFormat("")` is called. This function can be used to set up a variety of global attributes.

When the name of the setting is passed, this turns it on. There is no off.
* "double space" - Turns on double spacing. [Default is single space]
* "[n] columns" - Sets the body to be equal to n columns (currently only works for 2 and 3) [Default is one column]

## `onBuildFormat()`
This is the second function that is called. This is where the bulk of the work is done in actually designing and implementing the paper.

There are several functions that you will use in this function.

* `add_new_section(sectionname)`
This function will add a new section with a single page in it. Sections can contain multiple pages instead of just one. (There is currently no getter for sections yet.)

* `add_new_page([pagename])`
This function creates a new page. (By default, you will not have any pages, so you'll need to create one in order to display content on it.) You may give a name to this page to find it quicker later. Otherwise, this will just default to the page number it is on.

* `add_to_page(content, [pageno, pagename])`
This function will be used most of the time. It adds content, an image, text, etc. to a page. By default it will add this to the last page, but you may specify either the number of a page or the name of a page to put content in there. (It will be placed at the bottom of that page.)

* `pasteContent()`
This command MUST be placed last in order for the paper to render properly. It will deposit all the text from the content box to the paper, formatting it properly using the established settings.

If you don't know the page number, you can find it:

* `find_page(pagename)`
This returns the id of the page.

Other functions are useful for quick access to things.

* `grabMetadata(i)` 
Using the metadata you created earlier, you may grab attributes from it using this function. In addition to the attributes above, you may also get the 'value' property which contains the user input value. This function returns a JSON object of all the properties.

If you don't know the id number of the metadata, you may search for it.

* `searchMetadata(name)`
Search for the metadata using its id or label property. This returns the i of the data which you can then use with grabMetadata().

If you just want to get the value of a data, you can use this function:

* `valMetadata(id)`
This returns just the value of the specified metadata id.

For example, if I used the command `valMetadata("Title");`, it would just return the title that the user typed. 

## Formatting
When you are adding small blocks of text to the paper, there are a few simple functions to simplify common styles. *These work for ALL build functions*

* `centerText(text, size)` - Returns a div with the chosen text centered
* `boldText(text, size)` - Returns a span with the chosen text bold
* `italicizeText(text, size)` - Returns a span with the chosen text italicized
* `boldItalicizeText(text, size)` - Returns a span with the chosen text bolded and italicized
* `sizeText(text, size)` - Returns a span with the chosen text in the desired font size
* `newline()` - Just returns a newline
* `lcr_split(a, b, c)` - Returns a full-width table with text on the left, center, and right sides respectively
* `oneColumnText(a)` - Returns text in a single column
* `twoColumnText(a, b)` - Returns text in two columns
* `threeColumnText(a, b, c)` - Returns text in three columns (all left-aligned)


## `onSetHeader()`
There are two simple commands to customize header text.

* `push_header(text)` 
Adds a header to every page. 
**Note**: You should call this command first, before any other header command. Otherwise your customization will be overwritten.

* `customize_this_header(pageid, text)`
For the given page id (use `find_page()` if you don't know the id), you can customize the displayed text. This is useful for documents in APA format, which require "Running Head: " on the first page but not on any other page.

## `onGetFormats()` 
This function sets up all of the in-text formatting commands in a JSON object, then it will be returned as a JSON object to a built-in function. Each type of object is supplied as a property in the object. These are represented as strings and follow the various markup rules. ([Here is the guide](https://github.com/Fleker/Gluten/wiki/Format-Markup))

Use divs for objects that are meant to exist as a block.

```JavaScript
function onGetFormats() {
    obj = {};
    obj.citation = "(AUTHOR_LAST PAGE)";
    obj.heading1 = "<div style='font-style:italic'>LISTI:  TEXT</div>";
    obj.heading2 = "<div style='font-size:10pt'>TEXT (LIST1)</div>";
    obj.heading3 = "<div style='margin-left:0.5in'>LISTa. TEXT</div>";
    obj.paragraph_indent = "&emsp;"; //The paragraph indent is placed at the beginning of each paragraph, determined by the system 
    post_content_formatting(obj);
}
```

### Full list of format Options
* heading1 - Top heading
* heading2
* heading3
* heading4
* heading5
* paragraph_indent - What to begin each paragraph with; often you'd want an &emsp; indent

#### Heading Options
* `LISTA` / `LISTa` -  Returns heading position as a capital or lowercase letter
* `LISTI` / `LISTi` - Returns heading position as a capital or lowercase roman numeral
* `LIST1` - Returns heading position
* `TEXT%sc` - Returns indescribable output

### Inline Citation Options
Below are all of the current specifications that can be created for inline-citations.  

* citation - Default
* citation_main - When the user refers to the author in the sentence, you do not need to mention the author's name inline
* citation_noauthor - When no author is mentioned
* citation_twolastnames - When two authors have the same last name
* citation_twoauthors - When a source has two authors. (In this case using AUTHOR_LAST is not global ie. use it twice to get both last names)
* citation_threeauthors - When a source has three authors. (In this case using AUTHOR_LAST is not global ie. use it thrice to get all three last names)
* citation_manyauthors - When a source has four or more authors
* citation_sameauthorarticle_main - A Main version if an author wrote more than one article
* citation_sameauthorarticle - When an author writes more than one article
* citation_sameauthorbook_main - A Main version if an author wrote more than one book
* citation_sameauthorbook - When an author writes more than one book
* citation_multivolume - When a source has multiple volumes being cited
* citation_biblemain - A Main version for a bible entry
* citation_bible - When a source is a bible quote
* citation_editions - INTERNAL USE ONLY

### Number Display
The following functions format a number

* `numToLetter(cap, num)` - Returns a number as a letter
If cap is "A", then the number is uppercase; otherwise it is lowercase

* `numToRoman(cap, num)` - Returns a roman numeral
If cap is "I", then the number is uppercase; otherwise it is lowercase

* `numToOrdinal(num)` - Returns an ordinal number

## `onBuildBibliography()`
This function is used to customize the bibliography. It creates a bibliography section. You can customize it in a mix of page building and format posting. Do the custom text input before you post the bibliography. There can be no custom post-text at the moment.

Example:

```JavaScript
function onBuildBibliography() {
    add_new_section('bibliography');
    add_to_page(centerText('Works Cited'));

    obj = {};
    cob = {};
    obj.def = "AUTHOR_LAST, AUTHOR_FIRST_I. (YEAR). TITLE. (Ed EDITION., Vol. VOLUME, p. PAGE). PUBCITY: PUBCOMP. DOI: URL";
    obj.style = "text-indent:-.5in;margin-left:.5in";
    post_bibliography(obj, cob);        
}
```

These bibliography formats use the same markup as for citation formatting.
Another object property is `obj.style` which is the style for each citation. If you want to indent each citation, you can customize the CSS here.
  
### Citation Object
There are two objects you should pass in a bibliography. Using the example above, there is no check to make sure the given attribute exists. For example, if there was no year, the citation would not look proper.

"Smith, John. (). Dante's Inferno. (Ed ., Vol. , p. ). New York: Harper. DOI: http://www.google.com"
By passing a citation object (`cob`) along with your specifications, the cob properties will check to make sure the value exists before adding it. Then you call this value in your spec with `cAUTHOR` (or c along with the attribute's name)

To make sure YEAR only appears when there is one, you do these two-steps:

1. Add it to the citation object.
`cob.year = "(YEAR).";`

2. Add the above parameter to the citation.
`obj.def = "AUTHOR_LAST, AUTHOR_FIRST. cYEAR ...";`

This way, if the year is not included, that part of the citation is removed without any lingering issues. Using this method works for any type of citation property, and it's encouraged to do in order to prevent certain scenarios from ruining the accuracy of the paper.

#### Cob Properties
All author modifications. The system chooses the optimal value for author 

* author
* twoauthors
* threeauthors
* manyauthors
* sameauthor
* firstonlyauthor
Other properties

* medium
* pubcity
* publisher - Called by `cPUBCOMP`
* year
* translator
* editor
* edition
* title
* description
* govnation
* govbranch
* govcomm
* govsess
* university
* universityyear
* pubdate
* accdate
* website
* webpub

#### Citations
Below are a list of things that can be included in the citation. Note that as time goes on, the list will grow.
As of 20 Dec 2013:

* def - Whenever a different citation appears that doesn't meet any other criteria, or you don't have the every citation included, this is used as the default.
* book
* bible
* government
* pamphlet
* dissertation
* msthesis
* mathesis
* magazine
* newspaper
* editorial
* lettertoeditor
* journal
* web - Default for web related sources

#### Annotation
If an annotated bibliography is turned on, you may include the gap between the citation and the annotation with `obj.annotation`. 
`obj.annotation = "<br>";`
After the line break, the annotation will be placed