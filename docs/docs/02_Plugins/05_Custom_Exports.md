### File Conversion
This section of the documentation explains how to set up a plugin that will enable a user to export the HTML-formed document from gltn to a secondary file format.

#### Setting It Up
There are a few conditions you need in order to enable your plugin to appear as a conversion option.

* `service = true` - Your plugin must be registered as a service when installing
* `ExportFile{plugin_id}` - Your plugin must contain a function called `ExportFile{plugin_id}`

#### ExportFile
This function is called when the build is originally run. At this point you can add your conversion option, but you cannot convert the file yet. The file will likely not be built at this point, so you should not attempt to poll the system.

#### Export Button
In that function, you should add the option. You can do so by calling `add_export_button(title, icon, fnc)`
* title - The title of the conversion. Be brief, like ".docx"
* icon - The text for the icon that will accompany the title on the button
* fnc - The function to actually do the conversions. This function must be called `x()` in order for it to run.

#### Grabbing Content
The entire file is in the `$('.build')` including a few buttons. You can parse each page by calling `$('.page')`, or choose a specific page `$('.page[data-p=##]')`