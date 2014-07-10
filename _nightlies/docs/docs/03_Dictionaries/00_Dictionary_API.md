This will document how to create a dictionary and implement it in Gltn.

//TODO Explain what a dictionary is, class structure
//TODO Search API, saved searches
### Installation
`install_dictionary(format, url, name, id, icon)`

This function installs the dictionary and makes it lowest priority in the dictionary. You may need to move it higher on the list in order for your dictionary content to appear.
* format - "XML" or "HTML"
* url - The url to send a request to
* name - The name of the dictionary
* id - The internal id of the dictionary
* icon - The icon of the dictionary

### XML vs. HTML
An XML dictionary uses a standard data structure which is then sent to the Editor to format in a consistent, appealing way. However, this loss of control may not be appealing to some. Consider each type of dictionary and choose the one that best fits your project.
##### Advantages
* Easier to store data
* Modular
* No worrying about format
##### Disadvantages
* No customization, only what's supported can be output
* No control over the look & feel of the content

An HTML dictionary loads HTML from a website into an iframe. A PHP script is called first to load the webpage. This way makes it really simple to integrate your website's content into Gltn. However, your UI may not be optimized for a small panel (~40% of the screen on a laptop).
##### Advantages
* Easy to integrate
* Content is already there
* Modifying the website will automatically modify the dictionary
##### Disadvantages
* UI may not be optimized
* UI may not fit the user's theme
* iFrames may have issues loading certain webpages
