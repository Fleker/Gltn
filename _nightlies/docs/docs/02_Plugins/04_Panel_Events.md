## Key Press Event
Your panel is able to respond to global user key events with a simple integration much like responding to a popup close.

```Javascript
    $('.PanelKeyEvent').on('click', function() {
        if($(this).attr('data-keycode') == 13) {
	        contentAddText(character);
	        $(this).attr('data-keycode', '');	
	    }
    });
```

Possible attributes from the element:

* `data-keycode` - The Javascript keycode of the key being pressed
* `data-alt` - The alt key is being pressed
* `data-ctrl` - The ctrl key is being pressed
* `data-shift` - The shift key is being pressed

*Notes*:
You cannot prevent default actions at this time, nor for the foreseeable future, so do not try to override default actions.

Also, as in the example above, you may wish to reset the `data-keycode` attribute if you do not wish to receive more than one click event for a single key press.

## Panel Close Event
A panel can add an event that occurs when the panel is closing.

```Javascript
    $('#PanelCloseEvent').on('click', function() {
            {code}
    });
```

## Document Build Event
Some panels may want to have access to the built document instead of the default. If so, a build event may be called and once completed notify the panel to do something else.

```Javascript
    startBuild();
    $('#PanelBuildEvent').click(function() {
        {do something}
    });
```

## Maximizing and Minimizing
If the attribute is properly set in the Get function, the panel can hide the content and take control of the whole screen. While this alone may be effective, your layout and function may need to shift to take advantage of the increased real estate. To do so, create an event listener for a specific panel event.

```Javascript
     $('.PanelMaximizeEvent').on('click', function() {
        if($(this).attr('data-status') == 1) {
            /** Code to execute when the panel is becoming maximized **/
        } else {
            /** Code to execute when the panel is becoming minimized **/
        }
    });
```

<img src='http://felkerdigitalmedia.com/gltn/images\blog\maximize_no.png'>
<img src='http://felkerdigitalmedia.com/gltn/images\blog\maximize_yes.png'>