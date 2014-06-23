## Toolbar
The code used to initiate controls for the toolbar is done inside the function
`onInitToolbar() { [code] }`

A sample function would look like this:

```JavaScript
function onInitToolbar() {
    var tools = ["citation", "heading1", "image", "longquote"];
    post_toolbar(tools);
}
```

You state which tools should be displayed in the toolbar, then you commit these changes by using `post_toolbar({Array})`.

**Note**: The character palette and fullscreen will always be available in the toolbar.

### Available Tools
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
* `break` - A page break in the paper. A new page is started at this point.

### Custom Tools
Like all functions in Gltn, tools can be customized by the format and placed in the system like any other tool. Instead of adding a string, enter an object.

`var tools = [{id: 'email' ...`

An object contains 3 parameters
* `id` - The internal object name
* `label` - The name that will be displayed
* `fnc` - Code that will be executed when the tool is chosen

### Appendix

The following tools can't be chosen as they appear anyway; they are here for reference.
* `character` - Opens the character panel
* `fullscreen` - Puts in the editor in fullscreen mode.


## Custom Actions

The toolbar contains actions for directly modifying content.

###`contentAddSpan(obj)`
Creates element at the cursor position (or surrounds selected text??)

* `obj.node` - Input: HTML element name (like `'span'`)
* `obj.class` - Input: Class name for this object
* `obj.id` - ID for this object
* `obj.leading_quote` - Internal Use Only

###`formatHovertag(classname, title, action)`
Enables a class to display hovertags when the item is hovered over.

* `classname` - Name of the class that this feature will be enabled for
* `title` - Returned in '"Name"' (double quotes). This will run a javascript command so you can create custom code to personalize the contents
* `action` - Javascript that is run when the hovertag is selected

**Note** - Titles and actions must be enclosed in double quotes and then single quotes in order to place nice with the hovertagregistry
`formatHovertag("img", "'Image Details'", "'imgDetails('+$(this).attr('data-id')+');'");`

Make sure that you use this format, otherwise the system will break when trying to display that hovertag.
