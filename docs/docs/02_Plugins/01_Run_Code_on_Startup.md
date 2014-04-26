### Load Code on Startup
`InitPanel[Panel_Name]`
If your panel is on the list of available panels, this function will be executed when the page loads. (If it isn't on the list, then this function won't run) 

This function allows a panel to set up a function that will persist for the entire session, such as keyboard shortcuts.

#### Keyboard Shortcut

```Javascript
    function InitPanelmain_Character() {
        $(document).on('keydown', function(e) {
		if(e.keyCode == 67 && e.altKey) {
			runPanel('main_Character');	
		}
	});
    }
```

This code runs when the page first loads, and will open the panel when Alt+C is pressed. This can be done all through available APIs.

##### Keyboard Shortcut Function
If you don't care for as much customization as the function above, you can set up a simpler function that will open your panel on a specific key combination.

`keyboardShortcut(id, keys)`

* id - The id of the panel that you wish to run
* keys - An object containing the values of the key combination
* * alt - Boolean representing if you want alt pressed
* * shift - Boolean representing if you want shift pressed
* * ctrl - Boolean representing if you want ctrl pressed
* * key - The key you want pressed

If one of the meta keys are not defined in the object, it defaults to false. If the `key` property is not defined, the function will not run.

Additionally, this function will not add the keyboard shortcut to the ribbon. This will be done manually when the panel is installed in the `install_panel` function. If this panel is installed through the store, the attribute will be included automatically, so you don't need to worry about it.

*Note*: Please don't use this to override stock panels. The result of running two panels at once will be inconsistent and have a poor UX.

#### Services
This can also be used to create a persistent service, such as an extension that syncs your files with Dropbox. Gltn provides a way to show this service to the end user. When this function is called, it adds an icon next to the word count and save indicator. The icon, when hovered over, displays the name of the service. Clicking on the icon opens the panel where you can display status information about this service.

`initService(id, title, icon)`

* id - The id of the panel
* title - The title for the service
* icon - What will appear next to the word count; if you want to have an icon that changes, give it a unique id and manipulate the icon using the id

