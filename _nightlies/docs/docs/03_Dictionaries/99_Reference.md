##Reference
###*Class Dictionary*
The class `Dictionary` stores information about a single dictionary.

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `format`     | String  | Type of dictionary: "HTML" or "XML"         |
| `url`        | URL     | Site to queue the data from                 | 
| `name  `     | String  | Name of the dictionary                      |
| `id  `       | String  | A unique name for the dictionary            |
| `icon    `   | Icon    | An image or icon representing the dictionary|

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.toString()` | String    | Returns a stringified JSON representation of the object                    |
| `.fromString(String)`   | void    | Populates a dictionary with information from a JSON representation |

###*Class DictionaryManager*
The class `DictionaryManager` handles the variety of dictionaries that the user may install as well as manages previous searches. This may be accessed using the defined variable `dictionaryManager`

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `installedDictionaries`     | {Dictionary}  | An object containing all the `Dictionares` you have installed       |
| `previousSearches`     | [String]  | An array of Strings containing the previous words searched (with index 0 as the newest) |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.install(Dictionary)` | void    | Installs a new `Dictionary` into the system                 |
| `.uninstall(String id)` | void    | Uninstalls a `Dictionary` that has the same `id `             |
| `.appendPreviousSearch(String word)` | void    | Adds the given `word` to the list of previous searches             |
| `.getPreviousSearch(int index)` | String    | Gets the previously searched word at the given `index            |
| `.hasPreviousSearch(int index)` | boolean    | Returns true if a valid word exists at the given `index`            |
| `.toString()` | String    | Returns a stringified JSON list of dictionaries          |
| `.fromString(String)` | void    | Populates a list of dictionaries based on the contents of the stringified JSON data       | 
| `.getDictionary(int index)` | Dictionary    | Finds the given `Dictionary` at the `index` sorted by `dictionarysort`        |
| `.getDictionaryLength()` | int    | Returns the number of dictionaries installed by the user        |

###*Settings and Relevant Data*
The following variables are relevant settings that are included in a user's preferences.

| Accessed By    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `getSettings("dictionary")` | {Dictionary}    | A JSON object containing all of the dictionaries from the user             |
| `getSettings("dictionarysort")` | String    | A semicolon delimited String of the dictionaries to prioritize as selected by the user        |
| `getSettings("dictionarySearches")` | String    | A comma delimited String of last five words the user searched        |
