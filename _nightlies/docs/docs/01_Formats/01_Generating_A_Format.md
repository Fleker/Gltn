This page shows you how to customize the template of your paper on setup, and how to customize the <a href="98_Toolbars/00_Creating_Tools.md">toolbar</a>.

## `onInitFormat()`
This function is called first. It sets up all of the necessary template data.

The first command in this function is `new_format()`.
This initializes the editor for displaying the format metadata.

## Metadata
Every item you input gets added to a metadata array. Remember the order that you add these items, as later in the building process you will use the position of the metadata in order to return data (or you can use the `id` parameter.)

## Adding An Item
An input element can be added to your template using this function:
`new_format_item(type, [data]);`

The type is what kind of item you want this to be. There are a few choices.

* `text` - A simple text input
* `mltext` - Multiline textarea
* `content` - The content area, where the paper's content will be placed.
* `label` - Separates a part of the page for specific inputs
* `date` - A picker for a specific month, day, and year

The data parameter contains plenty of powerful attributes which can be arranged to increase the functionality of your input.

* `label` - This is what is displayed next to the input box, to indicate what value it should contain
* `placeholder` - Placeholder for the input box
* `description` - A lengthier description that can be placed near the input box. Using small font, it details what is expected inside of that input
* `id` - The id of the specified input
* min/max - You are able to customize the minimum and maximum lengths for an input box. This alerts the user when their input doesn't fit in the specified conditions. It suggests to the user to adjust their input but does not forcibly prevent the user from typing nor cut off their text at the specified length.
    * `mtype` - What unit do you want min/max to be in? "w"ords or "c"haracters? (Use the first letter)
    * `min` - The minimum value (can be left blank)
    * `max` - The maximum value (can be left blank)

### Date
Currently, the date parameter only exists as a direct date string. You must convert it to a date object in Javascript.

```Javascript
    var due = valMetadata("Date");
    var duedate = Date.parse(due);
    var duedate = new Date(duedate);
```

## Environment Conditions
In this function you may also set up template conditions for global attributes, like the word count.
You can change a setting by calling:
`set_up_format(setting_name, setting_value);`
Indicate the name of the setting you want to change, and then state the new value for the setting.
#### Available Settings
* `word count` - Defines the min and max words for the paper
    * `{min: #, max: #}` 
* `char count` - Defines the min and max characters for the paper
    * `{min: #, max: #}`
* `annotated bibliography` - Allows users to include abstracts for their citations

## Finishing Format
At the end of this function, you must commit all of your changes to the editor. You do this by calling:
`post_format();`

