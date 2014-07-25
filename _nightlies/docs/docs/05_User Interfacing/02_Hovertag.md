###Hovertagging
Hovertags are a simple way to display hints to the user about the kind of content they are selecting without having to force them into bulky menus and spending time in navigation. It keeps a writer in the same mindset, without messing up their concentration.

What is this? 

*simple hover*

Oh, that's what it is.

It is not too difficult to customize the message displayed. Ordinarily, an underlined item will give a hovertag containing the type of item it is. However, a citation hovertag gives you the title of the cited work.

Closing the hovertag is left to the system.

###Display Hovertag
Here's how to integrate the hovertag into your function. You must create an object of class `Hovertag`

```Javascript
    var citation = new Hovertag('citation', function(element) {
            return citation[$(element).attr('data-id')].Title;
        }, function(element) {
            initiateCitationEditor(undefined, $(element).attr('data-i'));
        })
``1

#### Constructor
`new Hovertag(classname, textcode, action)`

* classname - This is the class that will be receiving the hovertag integration
* textcode - The text, or function that will display the text on the hovertag
* action - A function that will run when the hovertag is clicked

#### `element` Parameter
When you use a function, the parameter `element` is passed. This is the HTML object that is affected. Imagine it to be like `this`. You can use this parameter to determine which element is active and pull specific data from that element to use in your display or action.

All other properties, such as integrating with the registry, and binding hovertags to these elements, is handled by the system.