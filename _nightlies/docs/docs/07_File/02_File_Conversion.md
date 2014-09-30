## Using Cloud Convert
CloudConvert is a service that allows many different types of files be converted to others using simple web based APIs. Gltn has some APIs that make it easy to integrate file conversions into projects.

`cloudConvert(inputformat, outputformat, inputdata, callback)`

The input and output formats are the file extensions that you want for this file. Converting a `docx` into an `html` file will use the aforementioned strings. 

The `inputdata` will either be a web URL pointing to the file, or just general data which will be loaded into a Blob.

The `callback` is a function that will execute once the conversion is completed. There is a single parameter, `outputdata` which is raw data from the converted file. 