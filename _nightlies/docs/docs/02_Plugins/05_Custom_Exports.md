This section of the documentation explains how to set up a plugin that will enable a user to export the HTML-formed document from gltn to a secondary file format. There are many times in which a user may not want to keep their file in a somewhat proprietary file format stored in an isolated space on their browser. Archiving files is common. The `localStorage` is not designed like a hard drive, and it isn't meant to be one. However, a `.gltn` format is not the type of file a user will want to keep. It can't be opened by anything else, and it just isn't very open.

To combat all of this, it is easy for a plugin that can export to a different file format. A plugin may export in two different ways, in different parts of the UI. The file browser has a download and export tool. This type of export is meant to keep file metadata intact. An export tool also appears when a document is compiled. This type of export is meant for standard document formats since this is optimized for printing.

## Export Function
There are a few conditions you need in order to enable your panel or service to appear as an option in an export menu. 

`panel.onExport = function(docView, content) { ... }`

It must have a function assigned to the `onExport` method. Without that function being defined, the panel will not be notified that the user is trying to export the file.

The boolean that is passed, `docView`, indicates whether the export is printer optimized (true), or for file metadata (false). The opposite of `docView` can also be referred to as `editView` (as you're editing the document using the Gltn Editor). If your plugin is only meant to export one type or the other, return `null` for the export type you do not wish to support. Then your service will not appear in that export menu.

The second parameter, `content`, is the filedata that the custom function must parse and convert into a different file. If `docView` is true, it is the HTML of the document, including pages and pageheaders. Otherwise, it is the raw data of the file from `localStorage`.

If you wish to support a more than one format in a single plugin, provide an array of JSON objects instead of a single JSON object.

### Notes when Exporting
When `docView == true`, you will need to write the downloading yourself. Your callback should both perform a conversion and export sequence. You may use InkFilepicker APIs if you wish.

When `docView == false`, you are likely using the file browser. If so, you should return your converted file at the end of your callback as raw data. This data will be turned into a blob and InkFilepicker will be used to save the file wherever the user wishes.

### JSON Return
This function must return a valid JSON object containing a few attributes.

* name - This is the name of your format, what will be displayed in the export button
* icon - This is an optional icon for your format. It can be an image or a font-awesome icon (without 'fa-' included)
* callback - This is the function that will run if the user selects your export button. This function should take the input, convert the file, and download it to the user's computer

If docView is `false`, you should also supply an additional parameter

* extension - The file extension that will be used for the converted file