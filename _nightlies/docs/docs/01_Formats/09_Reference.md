
### Framework
* `onInitFormat()` - Sets up format UI
* `onInitToolbar()` - Adds items to the toolbar
* `onStylePaper()` - Adds global rules for a paper build
* `onStyleGuide()` - Returns an HTML formatted guide to how a paper can be written; for details, [See Documentation](http://felkerdigitalmedia.com/gltn/docs/index.php?Formats/Style_Guide)
* `onBuildFormat()` - Sets up the paper design before the content
* `onSetHeader()` - Sets the header rules
* `onGetFormats()` - Rules for formatting the content
* `onBuildBibliogaphy()` - Sets up the bibliography (if applicable)
* `onStyleMarkup()` - Integrate with the Context API

### Installing
To add a format to your paper, you must enter this command into the console:

```Javascript
install_gluten_format(name, type, uri)
```

* name - The name of the format. This is what the user types in to choose this format.
* type - A one-word description of the format type, eg. Essay, Report, Novel, etc.
* uri - The url of the format script

If uri is not included, the format must exist as a javascript file in /js/themes/ with a pathname identical to the format name. 

Note that at the moment formats aren't saved, so you will need to manually reinstall the format every time you load the page.