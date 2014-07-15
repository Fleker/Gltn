## Integrating Plugins with the Dictionary
If you don't wish to write your own dictionary script, you may want to see other ways that you can integrate your plugin with the dictionary using the Dictionary API.

### Get Previous Searches
When a user makes a search using the Dictionary, any successful load (when content actually appears on screen) causes that word to be added to a "Previous Searches" list which can be accessed by any developer.

`dictionaryManager.getPreviousSearch(index)`

This function finds the previously searched word at the given index (where index 0 is the most recently searched item). It returns the search query as a string, or `false` if there is no entry.

Not every user will have previous searches, as not all of them may use the dictionary or may try to dismantle that feature for privacy reasons. You should handle these issues gracefully by checking if that search item is valid. You may use the function above, or you may use a simpler function that just returns true/false.

`dictionaryManager.hasPreviousSearch(index)`

Which returns true if there is an item at that index.

### Create a Search
If a user doesn't understand a particular word, they will consult the dictionary. The dictionary in Gltn is much like Google's Knowledge Graph, able to encompass a variety of data sources. This makes it an ideal tool for a lot of occasions. To help developers integrate the dictionary into their plugin, the following function can be used to launch the dictionary and perform the search:

`startDictionarySearch(query)`

Where a search for the given `query` will do a dictionary search just as usual, but it happens automatically.