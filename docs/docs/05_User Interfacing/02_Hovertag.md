###Hovertagging
Hovertags are a simple way to display hints to the user about the kind of content they are selecting without having to force them into bulky menus and spending time in navigation. It keeps a writer in the same mindset, without screwing up their concentration.

What is this? 

*simple hover*

Oh, that's what it is.

It is not too difficult to customize the message displayed. Ordinarily, an underlined item will give a hovertag containing the type of item it is. However, a citation hovertag gives you the title of the cited work.

Closing the hovertag is left to the system.

###Display Hovertag
Here's how to integrate the hovertag into your function. 

`formatHovertag(classname, textcode, action)`

* classname - This is the class that will be receiving the hovertag integration
* textcode - The text, or function that will display the text on the hovertag
* action - A function that will run when the hovertag is clicked

All other properties, such as integrating with the registry, and binding hovertags to these elements, is handled by the system.

###Advanced Cases
**Note this is now deprecated. You must use `formatHovertag` to generate tags**
This will show you how to make richer hovertags than are possible using the basic API. 
####Core Hovertag Function

`displayHovertag(text, data, fnc)`

* text - The text that will be displayed by the hovertag
* data
* data.ypos - Used to position the hovertag's vetical position. You can easily get this using this function:
`$(this).offset().top`
* fnc - This is a function that will be run when clicking on the hovertag, initiating whatever action may be linked. (If there is no function, clicking on the hovertag will have no action and the cursor will not change.)

####Hovertag Registry
In order to preserve hovertags inbetween sessions, all hovertags should write to the hovertag registry in their function. This can be done using the function:

`hovertagRegistry(c, t, a)`

* classname - The classname for the elements that are getting hovertags
* text - The text that will be displayed 
* action - The function that will run

*Note*: If you leave text and action blank, you can enter a custom function into the classname and it will run as desired.

####Recall Parameter
If the function to write to the registry is in the same function as the hovertag setter,

```JavaScript
function hovertagSetter() {
    displayHovertag("Hello", {ypos: $(this).offset().top}, "alert('Hi!')");
    hovertagRegistry("hovertagSetter()");
}
```

not only will the hovertag display again when the session resumes, but an *additional* hovertag entry will be written to the registry. This creates a large bulk which may bloat the project and slow down load times. This can be solved easily be adding a "recall" parameter which you can set a value to only through the registry.

```JavaScript
function hovertagSetter(recall) {
    displayHovertag("Hello", {ypos: $(this).offset().top}, "alert('Hi!')");
    if(recall == undefined) {
        hovertagRegistry("hovertagSetter(true)");
    }
}
```

Now, when this function is called once, one entry will be written. When this is called again on the next session, still only one entry will exist.

####Display Hovertag
Please note that if you were to use the advanced API, you will have to manually display the hovertag using various events. It is recommended that you be consistent with regular Gluten hovertags. This can easily be implemented with a jQuery event.

```JavaScript
$('.citation').on('mouseenter', function() {
    displayHovertag("Hello", {ypos: $(this).offset().top}, "alert('Hi!')");
});
if(recall == undefined) {
    hovertagRegistry("hovertagSetter(true)");
}
```

