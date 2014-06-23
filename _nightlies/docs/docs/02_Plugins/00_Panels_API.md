There are a few functions that are used to get and run panels.

### Register a Panel
Panels must be registered so that there are no function name conflicts. This will also be required to check for any security issues related to running javascript.

However, you can install any panel on your own (on a session-by-session basis currently - though saved data will persist between sessions) using a console function.

`install_panel(id, name, img, uri,[service, key shortcut])`

* id - The internal panel name ie. "main_Character"
* name - The user-facing name
* img - An icon or symbol that will be seen
* uri - The place where this file currently exists so that it can be loaded
* service - (Not required) If true, the panel is marked as a service and not included in the ribbon. (Default: false)
* key shortcut - (Not required) A string that appears as the keyboard shortcut in the ribbon. (Default: undefined)

This function adds a user-facing button to the Panels ribbonsection using the img and name parameters to make it easier to call.

Panels may also be installed by any user who accesses the Gltn Store.

TODO Explain the difference between panels and services