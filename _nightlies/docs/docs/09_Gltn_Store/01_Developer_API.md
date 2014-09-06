Here are some functions that you can use to interact with the Gltn Store in your plugins.

## Go to 'Category'
The store can be launched with the command `launchStore()` but that will go to the homepage. By providing a category name as an argument, the store will instead open that part of the store.

### Categories
* Panel
* Tool
* Service
* Dictionary
* Theme
* Plugin
* Grid Library
* File Op

## Is this Installed?
You can check whether the user has installed a plugin of the id `id` by using the command `isInstalled(id)`. It returns a Boolean.