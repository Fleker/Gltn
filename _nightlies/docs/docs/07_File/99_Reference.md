The class `File` stores information relating to a file in Gltn. The current file can be accessed with the variable `file`.

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `min_char`     | int  | Recommended minimum number of characters for this document       |
| `max_char`     | int  | Recommended maximum number of characters for this document       |
| `min_word`     | int  | Recommended minimum number of words for this document       |
| `max_word`     | int  | Recommended maximum number of words for this document       |
| `min_char`     | int  | Recommended minimum number of paragraphs for this document       |
| `max_char`     | int  | Recommended maximum number of paragraphs for this document       |
| `language`        | String     | The name of the language used for this paper            | 
| `fileid`        | String     | The filename for this document           | 
| `jsonsave`        | JSON     | A JSON version of the file, including every single attribute in nested form          | 
| `metadata`        | [Metadata]     | An array of metadata objects for the current format in the file         | 

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.clearMetadata()` | void    | Removes all metadata objects from the file                   |
| `.getFileid()` | String   | Returns the fileid for the file                    |
| `.setFileid(newfile)`   | File    | Changes the file's fileid |
| `.getShareid()`   | String    | Returns the id used for the cloud verison of the file |
| `.getMinChar()`   | String    | Returns the minimum number of characters for the document |
| `.getMaxChar()`   | String    | Returns the minimum number of characters for the document |
| `.getMinWord()`   | String    | Returns the minimum number of words for the document |
| `.getMaxWord()`   | String    | Returns the minimum number of words for the document |
| `.getLanguage()`  | Language  | Returns the document's language |
| `.setLanguage(lang)` | File | Sets the file's language |
| `.getTags()` | String | Returns the file's tags (IN PROGRESS) |
| `.sync().getHistory()` | [String] | Returns an array of sync events (IN PROGRESS) |
| `.sync().getStatus()` | String | Gets the most recent sync status (IN PROGRESS) |
| `.citations().getArray()` | [Citation] | Returns an array of all citations in the document |
| `.citations().getIndex()` | int | Returns the number of citations in the document |
| `.ideas().getArray()` | [String] | Returns an array of ideas for each citation |
| `.ideas().getDefault()` | String | Gets the default notes for the document |
| `.getFormat()` | String | Gets the document's current format (IN PROGRESS) |