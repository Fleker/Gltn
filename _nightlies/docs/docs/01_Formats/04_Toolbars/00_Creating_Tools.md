## Custom Tools
A tool is a button that appears in the toolbar, above the content box. A tool is a persistent shortcut to an action, whether that opens a panel, a popup, or does something else. A tool is directly tied to the content below, usually going as far as to add data into the content box. A tool will not always be accessible to the user. Either the format may not allow a tool to appear, or due to device size, the tool may be hidden in the overflow menu.

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
The best way to install one or more tools is to create a service. This service will, on initialization, install the tools and then do nothing else. The method provided below is recommended for tools that will be available in the Gltn Store.
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

###`formatHovertag(classname, title, action)`
Enables a class to display hovertags when the item is hovered over.

* `classname` - Name of the class that this feature will be enabled for
* `title` - Returned in '"Name"' (double quotes). This will run a javascript command so you can create custom code to personalize the contents
* `action` - Javascript that is run when the hovertag is selected

**Note** - Titles and actions must be enclosed in double quotes and then single quotes in order to place nice with the hovertagregistry
`formatHovertag("img", "'Image Details'", "'imgDetails('+$(this).attr('data-id')+');'");`

Make sure that you use this format, otherwise the system will break when trying to display that hovertag.

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

