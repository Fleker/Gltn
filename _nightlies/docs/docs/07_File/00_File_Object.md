## File
Each Gltn file exists in Javascript as an object of class `File`. Additionally, the variable `file` is a `File` object for the given document. Reading and writing metadata and content to the file can be done through the `file` variable.

### Attributes
* `metadata = []` - A list of all metadata objects (NOTE: Currently not available)
* `min_char = 0` - The minimum number of recommended characters
* `max_char = 0` - The maximum number of recommended characters
* `min_word = 0` - The minimum number of recommended words
* `max_word = 0` - The maximum number of recommended words
* `min_par = 0` - The minimum number of recommended paragraphs
* `max_par = 0` - The maximum number of recommended paragraphs