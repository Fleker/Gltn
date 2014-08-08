## What is an Intent
There are going to be times in which you'll want a panel to open with data already provided. For example, if you want a popup to open to a specific part of a panel, you would want to create an intent before opening the panel. The panel, once opened, will check for intents and grab any data there.

## Clearing an Intent
By default, data from an intent will not go away. It will continue to exist there and build up. Before creating an intent, make sure that data is cleared.
`clear_panel_data()`

## Creating an Intent
`create_panel_data(JSON)`

This function will add data to the intent. The data from the `JSON` will be added in a key->value form to the intent. It is recommended to only add Strings to an intent.

## Capturing an Intent
The panel can capture an intent at any point, though it should be done with the `.onRun` method. 
`grab_panel_data()` 

This function returns a JSON object of everything stored in the intent in a key->value form.

### Panel ID
If a panel is active while an intent is created, the attribute `sender` will also appear. This attribute is the id of the active panel.