##Using Popups
Popups are used to draw attention away from the main UI and show them special information pertaining to content they selected.

##Initiating Popup
`initiatePopup(data)`

This function will set up a popup for you to use. Everything must be supplied in a JSON object.

If you wish to use Gluten's built in card interface, you may do so through the attributes specified in the object. You do not have to. Instead, you can supply all of the hypertext yourself and ignore a few fields. Gluten will only show the attributes you've input.
* title - The title of the popup
* subtitle - A smaller but important item relating to the popup
* img - An image justified right of the popup
* value - Content that will be displayed underneath the subtitle and left of the image
* bordercolor - Color of the border surrounding the popup
* ht - Pure HTML that will be displayed underneath the "value" and "image" (if those attributes exist). Otherwise it will be displayed fully inside of the popup.
* fnc - Javascript that can be run in conjunction with the popup. Like with panels, functions and variables cannot be accessed by outside functions. Keep this in mind as you develop your framework.
* size - Allows the popup to be "large", taking up more of the screen than a standard popup

###Setting up the function
You must use the following syntax in generating your function and passing it to the initiate function. jQuery is ideal for writing function that rely on input.

`function x() {`

The function must be called x and have no parameters.

####Using jQuery Example
Let's say your popup includes a button.

`ht = '<button id="popup_button_name">Press Me</button>';`

A simple mouse click event can be generated in jQuery and placed in the function in order to complete an action related to it.

```JavaScript
    fnc = function x() {
      $('#popup_button_name').on('click', function() {
         alert("Hello");
         closePanel();
      });
    }
```

Any jQuery event can be used in conjunction with the elements created in the hypertext parameter.

####Passing parameters
There is a workaround if you wish to pass parameters to the popup.
In generating the hypertext that you wish to display on your popup, add an input of type hidden with the value that you want to pass.

```JavaScript
    param = 15;
    ht = '<input type="hidden" id="popup_parameter_name" value="'+param+'">';
    fnc = function x() {
      param = $('#popup_parameter_name').val();
    }
```

##Close Panel
The panel can be programmed to close by the following function:

`closePopup();`

##Saving
If you are adding or replacing data that is meant to exist in the document, it is recommended that you save that data to storage right after closing a popup. By marking the file as dirty, the appropriate save action will occur (whether it needs to be saved locally or synced).

`markAsDirty();`