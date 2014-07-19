This will document how to create a dictionary and implement it in Gltn. A dictionary is a collection of information. Like a real dictionary, it may contain a bunch of words, but it can have any set of data that can be presented. In the Gltn Editor, a user will do a text search for data. The editor will examine all installed dictionaries. This happens in a prioritized list set by the user. If a dictionary indicates that it has relevant information, that will be sent back to the editor to be displayed in the Dictionary Panel.

All the user's dictionaries are stored in a `DictionaryManager` which also includes methods for installing dictionaries and storing previous searches.

### Installation
```Javascript
    var dictionary = new Dictionary(format, url, name, id, icon)
    dictionaryManager.install(dictionary);
```

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

## *Getting Started*
### Installing
Use the `dictionaryManager` variable to install your dictionary.

### Server
Using a server, you can upload PHP files and use URLs to test your code and make sure it works.

### Locally
Locally, it is difficult to test a dictionary. You would need to install a server on your computer and set it up to run PHP. Then, migrate your local source of Gltn to that server. If Gltn is able to complete AJAX calls, your system should work.

## *Inspiration and Ideas*
If you want to make a dictionary, but don't know where to start, look at some of these ideas:

### Fan Bases
A fan of comic books, video games, or tv shows may want to put their fandom to good use. A custom Dictionary could ping a wiki or fan site to pull content. For example, pulling data from Bulbapedia to make a Pokemon dictionary.

### Maps
There's a lot of location data today. How about a very detailed atlas, which provides this data from various sources. Maybe Foursquare.

#### Challenges - Go Further
* Don't just pull data from a maps provider. Also get data from Wikipedia and mix it to create a more detailed look at a place. Don't forget, this is meant to be glanceable information.

### Politifact 
Politifact is just one reputable source for rumor checking. How about mixing one or more together to create the ultimate fact checker? You could query a question and then check the search results, showing the results of the first one.