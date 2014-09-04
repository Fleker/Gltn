When you write a paper, you need to make sure it is properly formatted. A bibliography must be organized by author's last name. Quotes must be cited in-line using the author's last name. If there is no author, use the title in quotes. Include the page number. And the year. Or not.

There are a lot of nuances to paper styles, and a lot of complicated rules. It's reasonable that aesthetics are a big deal of an essay. However, all of that seems like manual labor. Inline citations? That seems like busywork. A computer can do this job.

A format is the premier class in Gltn. With it, one can shape the editor to include as much or as little metadata as you want. This provides rules for the editing side and how to compile the paper into a full document. By extending another already existing format, it is easy to customize one as much as you desire. Only one format may be active at a time. A user can switch between formats at any time using the format dropdown.

A format exists as an object of class `GltnFormat` which is stored in a `FormatManager`. You can use the variable `formatManager` to access available formats and install new ones.

A format script is written using JavaScript and can be added into the Gltn Editor using the <a href="99_Reference.md">FormatManager</a>.

## Creating a new Format
To create a new format, use the constructor for a GltnFormat:

`new GltnFormat("MLA", "MLA", "Essay", "js/formatts/MLA.js", false);`
    
`GltnFormat(id, name, type, url, hidden)`

* id - The unique id for this format
* name - The display name for this format
* type - A secondary name for this format
* url - The url of the format script
* hidden - To hide this format from the format dropdown

## Installing
```Javascript
    var f = new GltnFormat(...);
    formatManager.addFormat(f);
```
    
Using the method `addFormat`, the format is installed in the editor and can be used offline.