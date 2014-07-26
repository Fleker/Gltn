###Hovertagging
Hovertags are a simple way to display hints to the user about the kind of content they are selecting without having to force them into bulky menus and spending time in navigation. It keeps a writer in the same mindset, without messing up their concentration.

When you don't know what something is, a simple hover over that item will create a small textbox giving the user some extra information about the rich data.

It is not too difficult to customize the message displayed. Ordinarily, an underlined item will give a hovertag containing the type of item it is. However, a citation hovertag gives you the title of the cited work.

###Display Hovertag
Here's how to integrate the hovertag into your function. You must create an object of class `Hovertag`

```Javascript
    var citation = new Hovertag('citation', function(element) {
            return citation[$(element).attr('data-id')].Title;
        }, function(element) {
            initiateCitationEditor(undefined, $(element).attr('data-i'));
        })
    hovertagManager.implement(citation);
``1

#### Constructor
`new Hovertag(classname, textcode, action)`

* classname - This is the class that will be receiving the hovertag integration
* textcode - The text, or function that will display the text on the hovertag
* action - A function that will run when the hovertag is clicked

#### `element` Parameter
When you use a function, the parameter `element` is passed. This is the HTML object that is affected. Imagine it to be like `this`. You can use this parameter to determine which element is active and pull specific data from that element to use in your display or action.

All other properties, such as integrating with the registry, and binding hovertags to these elements, is handled by the system.

### When to Initiate
A hovertag is usually tied to a tool, as tools are the primary way to input rich data into the content box. The hovertag should be implemented at the same time that the tool is installed (at startup). Using a service is an easy way to do that.

```Javascript
    var s = new Service("myservice", "js/myservice.js");
    s.onInit = function() {
        var t = new Tool("mytool", "My Tool", function() {
            alert("Hello");
        });
        toolbarManager.addTool(t);
        var htag = new Hovertag('myclass', 'This is rich content', function(element) {
            alert($(element).attr('class'));
        })
        hovertagManager.implement(htag);
    };
```

## Examples
### Citation
```Javscript
    var citation = new Hovertag('citation', function(element) {
        return citation[$(element).attr('data-id')].Title;
    }, function(element) {
        initiateCitationEditor(undefined, $(element).attr('data-i'));
    })
```
For elements of class `citation`, it will show that citation's title on hover. When clicked, it opens an editor for that citation.