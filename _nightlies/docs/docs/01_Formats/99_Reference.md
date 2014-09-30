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

###*Class Metadata*
The class `Metadata` holds information relating to a specific piece of metadata
| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `type`     | String  | A String pointing to a `MetadataHtml` object      |
| `label`        | String     | A title for the datum           | 
| `max`        | int     | A maximum number of items      | 
| `min`        | int     | A minimum number of items      | 
| `mtype`        | String     | "W" or "C" depending on the count you wish to constrain      | 
| `placeholder`        | String     | Placeholder text for the field      | 
| `description`        | String     | A more detailed description for the datum      | 
| `id`        | String     | A name that can be used to identify the datum, it should be designed to persist across many formats      | 
| `index`        | int     | The position of this datum     | 
| `default`        | String     | Default text (IN PROGRESS)     | 

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.hasLabel()` | boolean    | States whether a label is set for the datum                    |
| `.hasPlaceholder()` | boolean   | States whether a placeholder is set for the datum                   |
| `.hasDescription()`   | boolean    | States whether a description is set for the datum |
| `.isCounterEnabled()`   | boolean    | States whether the datum is actively measuring min and max values and displaying them to the user |

###*Class MetadataHtml*
The class `MetadataHtml` is used to manage different types of `Metadata` and is represented by the `type` attribute of a `Metadata` object
| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `type`     | String  | The name of the `MetadataHtml`      |
| `outputdata`        | function     | A function with a parameter `i` (being the index of that metadata) which returns HTML to be displayed on the webpage  | 

###*Enum MetadataTypes*
The enum `MetadataTypes` contains all available `MetadataHtml`, and can be easily extended to support more types
| Properties | Description                                 |
| ----------| ------------------------------------------: |  
| `content`    | Main content area    |
| `block`    | Two empty lines   |
| `nl`    | A single blank line  |
| `mltext`    | Multi-line text  |
| `text`    | Single line text  |
| `date`    | Date field |
| `label`    | Description with no input type |