## Run Code for the Panel
`panel.onRun = function() { ... }`

Here you are able to execute code.

## Run Code before Panel Opens
Before the panel opens, you can execute `panel.onBeforeRun` as a way to set up any last minute functions such as panel width and bordercolor before the panel is created with its set attributes.

#### PostPanelOutput
This sets up the HTML for your panel. You can specify id names or classes. You must return complete HTML.
    
    postPanelOutput(out);

This function *must* be called in the RunPanel function. Otherwise no HTML will be displayed.
The function overwrites previous HTML in the panel, so this should be kept in mind as you generate outputs. 
If you wish to have a more dynamic feel, create divs and use JQuery to manipulate individual tags. You can use postPanelOutput as a way of generating the framework.

Any code can be put in the RunPanel function, including JQuery events and functions.
*Note*: You must use JQuery for events. Onclick and other DOM events will not work for calling internal functions.

#### Popup Close Event
If your panel uses popups, you might want to know when your popup closes so you can refresh your HTML or run a certain block of code.

Place this event in your RunPanel function.

```Javascript
    $('.PanelPopupEvent').click(function() {
        {code}
        alert($(this).attr('data-title'));
    });
```

Getting the 'data-title' attribute from the event object gives you the title for the popup so your code can respond only if a certain type of popup is closing. 

#### Send Data to Panels
Sometimes you want a panel to display data specific to your situation. There are a few simple functions to send data to a panel and retrieve it.

`create_panel_data(obj)`

* obj - A JSON object of attribute names and values to send

`grab_panel_data()`
Returns a JSON object of those attributes and values. If a panel is open, you can retrieve its name through the `sender` attribute

If the panel isn't open, you should choose `runPanel(panelid)` in order to open it. 

`clear_panel_data()`
Once the data stops being relevant, you should remove it to prevent it from being used again in the future. This function removes all shared panel data.

#### Find and Replace Text-Only
When using HTML and text, using a standard string.replace tool can be difficult. If you want to replace text in the content area, using this function:
`FindTextReplaceText(RegIn, RegOut)`

* RegIn - A regular expression to find
* RegOut - A regular expression for replacing

### Saving
For simple applications like a <a href='?Dictionaries/Intro_to_Dictionaries'>dictionary</a> you may use a generic set of code. However, for advanced operations, or even for simple settings, you'll need to save data. 
#### Saving to File
`writeToFile(att, val)`
* att - The name of the attribute
* val - The value for it (will end up being a string, so keep that in mind)

This function sets the value for the given attribute to the given value. This is saved in the document, so this is good only for applications where you want data set for a specific document such as an outline tool.

To access the data, simply call `getFileData({att})`

#### Saving to Settings
`writeToSettings(att, val)`
* att - The name of the attribute
* val - The value for it (will end up being a string, so keep that in mind)

In many cases you want user data to persist not just between sessions, but between files. By writing to the shared settings, the same data can be accessed by a panel for any file.

To access the data, simply call `getSettings({att})`

As a side note, to query whether a certain settings value exists or should be overriden, you can call `hasSetting({att})`

### Export
In some cases you may wish to use a panel for prototyping, such as for an outline. A few functions are available for developers to create a solid experience.
#### Mimicking the Build System
If you just want to replicate the UX while maintaining full control of your output, call the faux setup function:
`falseBuild(remove_print);`
This sets up the build process like the standard setup, but the developer can control the output directly using the standard functions like `add_new_page()` and `add_to_page(s)`

*Note*: If the parameter remove_print is `true`, the print button will not show up, indicating to the user that the result is not meant to be printed.

#### Sending to Build System
For lengthier outputs or for adding pagination, developers can send their output to the build system and let it generate a properly formatted paper based on the output (this will ignore format style functions)
`startBuild(el)`
Where el is a jQuery selector

### Removing Panel
With the Gltn Store, users will be able to install panels. Also, they'll be able to uninstall them. There is an additional function you may include which is called only when the panel is being uninstalled. It is recommended that you remove any relevant settings and file properties inside of this function. 

`panel.onUninstall = function() { ... }`