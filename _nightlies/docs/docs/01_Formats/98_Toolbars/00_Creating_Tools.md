## Custom Tools
A tool is a button that appears in the toolbar, above the content box. A tool is a persistent shortcut to an action, whether that opens a <a href='?Plugins/Panels_API'>panel</a>, a <a href='?User%20Interfacing/Popups'>popup</a>, or does something else. A tool is directly tied to the content below, usually going as far as to add data into the content box. A tool will not always be accessible to the user. Either the format may not allow a tool to appear, or due to device size, the tool may be hidden in the overflow menu.

<img src='http://felkerdigitalmedia.com/gltn/images\blog\toolbar.png'>

A tool can be constructed as such:
```Javascript
    var character = new Tool("character", "Character", function() {
            panelManager.run("Main_Character");
        }); 
```

### Constructor
`new Tool(id, name, function)`

* id - The unique name for this tool
* name - The name that will be displayed in the toolbar
* function - The function that runs when this tool is clicked

### Installing
Tools may be added to the list of tools using a `ToolbarManager`, accessed with the variable `toolbarManager`.

`toolbarManager.addTool(character);`

This method also will update the toolbar if necessary.

### Downloading
The best way to install one or more tools is to create a service. This service will, on initialization, install the tools and then do nothing else. The method provided below is recommended for tools that will be available in the <a href='?Gltn%20Store/Welcome'>Gltn Store</a>.
```Javascript
    var s = new Service("myservice", "js/myservice.js");
    s.onInit = function() {
        var t = new Tool("mytool", "My Tool", function() {
            alert("Hello");
        });
        toolbarManager.addTool(t);
    };
```

## Custom Actions
The toolbar contains actions for directly modifying content.

###`contentAddSpan(obj)`
Creates element at the cursor position (or surrounds selected text??)

* `obj.node` - Input: HTML element name (like `'span'`)
* `obj.class` - Input: Class name for this object
* `obj.id` - ID for this object
* `obj.leading_quote` - Internal Use Only

## Examples
### Character
```Javascript
    var character = new Tool("character", "Character", function() {
        panelManager.run("Main_Character");
    })
```
It is easy to open a  <a href='?Plugins/Panels_API'>panel</a> from a tool. The Character Panel contains the code to insert data into the content box using a larger user interface.

### Heading
```Javascript
    var heading1 = new Tool("heading1", "H1", function() {
        contentAddSpan({node:"span", class:"heading1 heading"});
        hovertagManager.refresh();
    })
```
Here, a heading is inserted directly into the content and then the `HovertagManager` is refreshed so that a <a href='?User%20Interfacing/Hovertag'>hovertag</a> will appear in that area. If a <a href='?User%20Interfacing/Hovertag'>hovertag</a> is not implemented yet, it should be done before refreshing. Ideally, it should be done when the page loads.

### Image
```Javascript
    var image = new Tool("image", "Image", function() {
        var imid = getObjectSize('img');
        contentAddSpan({node:"div", class:"img inline img"+imid, ce: false});
        imgDetails(imid);
        hovertagManager.refresh();
    })
```
This example is a little more complicated. A `div` is inserted into the content. It gets a specific id. Also a function is called, `imgDetails`, which opens an image picker. The image properties are tied to the `imid`. The function `getObjectSize` essentially gets the length of an array of that class. However, it does make sure that deleted images are also taken into consideration. 

##Reference
###*Class Tool*
The class `Tool` is responsible for creating a tool and doing something when acted upon by user input.

| Properties   | Return  | Description                           |
| ----------   | :-----: | ------------------------------------: |
| `id`| String   | Unique identifier for the tool     |
| `name`        | String     | Displayed name of the tool |
| `action`     | Function    | Function that is run when the button is clicked |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.toHtml()` | HTML    | A rendered version of that tool to place in the toolbar          |

###*Class ToolbarManager*
The class `ToolbarManager` gives the values for each popup size and manages a few popup related elements. It can be accessed using the variable `toolbarManager`

| Properties | Value          | Description                             | 
| ---------- | -------------: | ---------------------------------------: |
| `availableTools`    | {Tool}  | A JSON object of all tools that may be used       |
| `stockTools`    | {Tool} | A JSON object of all tools that appear by default, so the system can easily figure out which ones are custom |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.getAvailableTools()` | {Tool}    | Returns a JSON object of all tools that may be used |
| `.addTool(Tool)` | void   | Adds a given `Tool` to an object of all installed tools |

