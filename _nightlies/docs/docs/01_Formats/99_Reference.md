## Framework
Your format script should contain the following functions to take full advantage of the system. If there's no plan to use a function, it is recommended that it is included anyway to prevent any errors that may occur.

* `onInitFormat()` - Sets up format UI
* `onInitToolbar()` - Adds items to the toolbar
* `onStylePaper()` - Adds global rules for a paper build
* `onStyleGuide()` - Returns an HTML formatted <a href='?Formats/Style_Guide'>Style Guide</a> to how a paper can be written
* `onBuildFormat()` - Sets up the paper design before the content
* `onSetHeader()` - Sets the header rules
* `onGetFormats()` - Rules for formatting the content
* `onBuildBibliogaphy()` - Sets up the bibliography (if applicable)
* `onStyleMarkup()` - Integrate with the <a href='?User%20Interfacing/Context_API'>Context API</a>

##Reference
###*Class GltnFormat*
The class `GltnFormat` stores information about a single format.

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `id`     | String  | The unique name for the format       |
| `name`        | String     | Name of the format                | 
| `type  `     | String  | Writing group the format belongs to                     |
| `url  `       | URL  | Location of the format script            |
| `hidden    `   | Boolean    | Whether the format should be displayed in the list of available formats|

###*Class FormatManager*
The class `FormatManager` handles formats and controlling which one is currently active for the document. It can be accessed using the variable `formatManager`.

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `formats`     | [GltnFormat]  | An array of all existing formats       |
| `currentFormat`        | GltnFormat     | The format that currently is being used in the document           | 

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.getFormats()` | [GltnFormat]    | Returns an array of all formats stored in the object                    |
| `.postFormats()` | void   | Refreshes the format input field with all contained formats                    |
| `.addFormat(GltnFormat)`   | void    | Adds a new `GltnFormat` to the list of formats, in escence installing it |
| `.getCurrentFormat()`   | GltnFormat    | Returns the format that is currently being used in the document |

###*Class Language*
The class `Language` stores information about a single language which is used in the writing of a document

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `code`     | String | The unique language code   |
| `name`        | String     | The name of the language or dialect           | 

###*Class LanguageManager*
The class `LanguageManager` handles languages and controlling which one is currently active for the document. It can be accessed using the variable `languageManager`.

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `languages`     | [Language]  | An array of all existing languages       |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.getLanguages()` | [Language]    | Returns an array of all languages stored in the object                    |
| `.postFormats()` | void   | Refreshes the language input field with all contained language                    |


