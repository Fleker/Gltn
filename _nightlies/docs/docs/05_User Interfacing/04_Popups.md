##Using Popups
Popups are used to draw attention away from the main UI and show the user ephemeral information that this pressing.

##Initiating Popup
`new Popup(data)`
First, a new object of class Popup must be created.

This function will set up a popup for you to use. Everything must be supplied in a JSON object.

If you wish to use Gluten's built in card interface, you may do so through the attributes specified in the object. You do not have to. Instead, you can supply all of the hypertext yourself and ignore a few fields. Gluten will only show the attributes you've input.

* title - The title of the popup
* subtitle - A smaller but important item relating to the popup
* img - An image justified right of the popup
* value - Content that will be displayed underneath the subtitle and left of the image
* bordercolor - Color of the border surrounding the popup
* ht - Pure HTML that will be displayed underneath the "value" and "image" (if those attributes exist). Otherwise it will be displayed fully inside of the popup.
* fnc - Javascript that can be run in conjunction with the popup. Like with panels, functions and variables cannot be accessed by outside functions. Keep this in mind as you develop your framework.
* size - Specifies the amount of screen space the popup should consume
    * The default size is "medium". You can retrieve values from the PopupManager Enum

Once the object is created, it can be displayed by calling the method `.show()`.

###Setting up the function
Set a function to the property `run` of your popup designating the code that should be run once the popup opens. jQuery is ideal for writing function that rely on input.

```Javascript
    var popup = new Popup({title: "Text", ht: "<span id='popup_span'></span>"});
    popup.run = function() {
        $('#popup_span').html("hello");
    }
    popup.show();
```

The function must have no parameters.

####Using jQuery Example
Let's say your popup includes a button.

`ht = '<button id="popup_button_name">Press Me</button>';`

A simple mouse click event can be generated in jQuery and placed in the function in order to complete an action related to it.

```JavaScript
    popup.run = function () {
      $('#popup_button_name').on('click', function() {
         alert("Hello");
         closePanel();
      });
    }
    popup.show();
```

Any jQuery event can be used in conjunction with the elements created in the hypertext parameter.

####Passing parameters
There is a workaround if you wish to pass parameters to the popup.
In generating the hypertext that you wish to display on your popup, add an input of type hidden with the value that you want to pass.

```JavaScript
    param = 15;
    ht = '<input type="hidden" id="popup_parameter_name" value="'+param+'">';
    var popup = new Popup({ht: ht});
    popup.run = function () {
      param = $('#popup_parameter_name').val();
    }
    popup.show();
```

##Close Panel
The most current panel can be programmed to close by the following function:

`closePopup();`

Or you can do so using the object:

`popup.close()`

##Saving
If you are adding or replacing data that is meant to exist in the document, it is recommended that you save that data to storage right after closing a popup. By marking the file as dirty, the appropriate save action will occur (whether it needs to be saved locally or synced).

`markAsDirty();`

##Reference
###*Class Popup*
The class `Popup` is responsible for creating and managing popups.

| Properties   | Return  | Description                           |
| ----------   | :-----: | ------------------------------------: |
| `bordercolor`| Color   | Color of border surrounding popup     |
| `img`        | URL     | Visual display accompanying the popup |
| `output`     | HTML    | HTML displaying underneath popup title|
| `size`       | String  | Size of the popup                     |
| `subtitle`   | String  | Subtitle                              |
| `title`      | String  | Title for the popup                   |
| `value`      | String  | Descriptive info accompanying popup   |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.close()` | void    | Closes and removes the popup                                      |
| `.run()`   | void    | Function that executes when the popup opens. It can be overriden. |
| `.show()`  | void    | Displays the popup                                                |

###*Class PopupManager*
The class `PopupManager` gives the values for each popup size and manages a few popup related elements. It can be accessed using the variable `popupManager`

| Properties | Value          | Description                             | 
| ---------- | -------------: | ---------------------------------------: |
| `TINY `    | String "tiny"  | Represents a very small popup           |
| `SMALL`    | String "small" | Represents a small popup                |
| `MEDIUM`   | String "medium"| Represents a popup of the default size  |
| `LARGE`    | String "large" | Represents a large popup                |
| `XLARGE`   | String "xlarge"| Represents a very large popup           |
| `popups`   | [Popup] | An array of popups currently active    |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.currentpopup()` | Popup    | Returns the most recent popup (Likely the one on-screen) |