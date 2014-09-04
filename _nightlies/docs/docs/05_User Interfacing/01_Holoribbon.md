The holoribbon is the name for the header that sits at the top of the screen and allows users to select various actions that appear in separate categories.

## Managing the Categories
In Gltn, the `holoribbon_std` is a variable that is the Holoribbon. It contains every category as a key, with each value being an array of JSON objects. Each object is an element in the menu. The user can flip between categories.

### A JSON Object
A Group just has a label predetermined. Otherwise you may include any HTML to be displayed.
`{group: 'Group Name', value: 'Custom HTML output'}`

A Button has several predetermined attributes that display and run a button, which optional keyboard shortcut text (this just displays text, not the actual code for shortcuts)
` {text: 'Name of Item', image: 'Image or icon for this item', action: 'Function to run when clicked', key: 'Optional small label for a description or key combination'}`

### Panels with Menus
```Javascript
    var p = new Panel(...);
    p.onRun = function() {
        p.setMenu( [ {text: 'Click Me', image: '<span style="font-size:18pt" class="fa fa-book"></span>', action: function() {
            alert("Hello World");
        }, key:'Ctrl + S'} ] );
    }
    p.onRibbonRefresh = function() {
        //Nothing to do here since I'm just using buttons
    };
```
<img src="http://felkerdigitalmedia.com/gltn/images\blog\grid_search.png">
This code will create and display a new menu in the Holoribbon for the duration of the panel's lifetime. When the <a href='?Plugins/Panels_API'>panel</a> is closed, the menu will disappear as well.

If you use a group, you may want to have some Javascript execute after the ribbon refreshes. A <a href='?Plugins/Panels_API'>panel</a> may override the method `.onRibbonRefresh` to provide event listeners for the elements you create. 

## *Reference*
* `holoribbonRefresh()` - Updates the HTML ribbon with new properties in the variable (this is not necessary for `Panel.setMenu(...)`)
* `ribbonSwitch(num, !transition)` - Switches the category seen by the user

## Using it in a Different Project
This can be separately used for a different project.

`newRibbon(classname, ribbonobj)`
* Classname - The element where the ribbon will appear
* Ribbonobj - The object that contains the items and categories

    { CATEGORYNAME: 
      new Array( {group: 'Group Name', value: 'Custom HTML output'} ),
    CATEGORYNAME2: 
      new Array( {text: 'Name of Item', image: 'Image or icon for this item', action: 'Code to run when    
      clicked', key: 'Optional small label for a description or key combination'} ) }


`ribbonSwitch(num, !transition)`
* num - The category number that you wish to select
* !transition - If false, the holoribbon will transition to its new position. If true, the holoribbon will NOT transition