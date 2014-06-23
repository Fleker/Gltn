Gltn provides an API to give a rough estimate of the page count for a given document as a guide to the user. Although there is a function built-in, a format can override it and use its own method for determining the page count. This may include the length of a bibliography, the initial height of any headers (such as name and date), or a full page to include a cover letter. 

### Sample
Here's a sample version of the method to override, based on the MLA format

```Javascript
    function onGetPageCount() {
        //Based on MLA procedures
        var a = getWords();
        return a.length*2/700;
    }   
```
In this example, the function `onGetPageCount()` would be called, either this default function or the format function that is overriden. A list of words is taken from the content field. From this list, it is easy to determine the number of words. The word count is doubled because the paper is double spaced. (In a single spaced paper, don't double the word count.) Finally, this number is divided by 700, the average number of words per page.

There's no need to round. That happens automatically. Just return a float giving the rough number of pages.