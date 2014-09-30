## Saving
`saveFile(file)`

A default constructor will just save the document currently loaded. However, you can create a new file and use this function to create a standard Gltn file, which is useful for actions like importing and converting.

This function returns an array with two items. The first is the raw data of a Gltn file. The second is a JSON object of the same information. This JSON object is also the value of `jsonsave` of a <a href='?File/Reference'>File object</a>.

## Import
`importGltnBlob(blob, filename)`

Let's say you have already converted a file and you want to import it as a general file. This can be done using the `importGltnBlob` function and is recommended to be called after an conversion ends. This will take a Gltn file, XML + content, and add it as a file in the user's file browser with the given filename. This saves it to `localStorage` just like any other Gltn file. 

This function is the entire import process. As such, it handles error messages such as if there was an error importing, or if the user wants to overwrite a file with the existing name. Keep this in mind and do checks before sending it to the import function. Otherwise users will be unable to import your files and become frustrated with errors.