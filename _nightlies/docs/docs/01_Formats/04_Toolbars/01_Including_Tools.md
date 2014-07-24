## Populating Toolbars
The code used to initiate controls for the toolbar is done inside the function
`onInitToolbar() { ... }`

A sample function would look like this:

```JavaScript
    function onInitToolbar() {
        var tools = ["citation", "heading1", "image", "longquote"];
        post_toolbar(tools, true);
    }
```

You provide an array of tool ids that you wish to be accessed. If you want, you can also include custom tools both in the format script, or just by showing the id. If the user does not have that tool installed, it will not be displayed. Also, if the tool is installed but not processed by the system yet, the toolbar will later reload when that tool is ready.

You state which tools should be displayed in the toolbar, then you commit these changes by using `post_toolbar({Array}, freeform)`.

`freeform` is a boolean. If it is false (which it is by default), then the only tools that will appear in your toolbar are ones you have specifically chosen to be there, including custom tools. If it is true, any custom tool that is installed will appear in the toolbar even if it was not included in your array.

**Note**: The character palette and fullscreen will always be available in the toolbar.

### Default Tools
* `citation` - Creates a citation
* `heading1` - Adds a top-level heading
* `heading2`
* `heading3`
* `heading4`
* `heading5` 
* `image` - Allows users to add an image
* `table` - See [Spreadsheets API](http://felkerdigitalmedia.com/gltn/docs/index.php?Advanced/Spreadsheets_API) for more information about the table tool
* `reftext` - Copies text from elsewhere in a programmable way
* `LaTeX` - Allows users to insert custom LaTeX markup and have it render in HTML utilizing MathJax
* `pbreak` - A page break in the paper. A new page is started at this point.

### Else
The following tools can't be chosen as they appear anyway; they are here for reference.

* `character` - Opens the character panel
* `fullscreen` - Puts in the editor in fullscreen mode.
