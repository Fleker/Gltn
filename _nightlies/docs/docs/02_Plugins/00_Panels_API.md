##Panels
Panels are a very front-facing type of plugin. A panel will appear to the side of the editor and allow users to augment their writing experience with different types of functions. Panels may be as in-depth or simple as the developer chooses. It is not difficult to scale a panel. Just treat it like a standard web application. Just note interactions may be different in a smaller screen size.

When a panel is installed by the user, it is accessible in the holoribbon under the "Panels" section.

In the code, a panel is an object of class `Panel`

##Services
Services are a special type of panel. They run in the background. Services will usually be indicated by an icon at the bottom of the content editor, in the services bar. Services may run continuously, or run only when triggered. An example of a built-in service is the file saver. It only runs when triggered by a `markAsDirty()` call. You can see the save status in the bar and how the icon changes when it is actively saving. All of these capabilities are accessible to developers to build your own services.

Services will usually have a panel part in order to describe to the user what the service is doing and show any type of pertient information in a visual, easy to understand mannner. The panel will appear when the user clicks on the icon. Alternatively, a different action can be taken. 

As a service traditionally exists in the services bar, it won't appear in the holoribbon. However, a panel may create a service or appear to create a service utilizing some lower-level APIs.

In the code, a service is an object of class `Service`, which inherits `Panel`.

##Panel Manager
When working with plugins, it is a good idea to integrate your app with APIs from the `PanelManager` class, which is accessible from the variable `panelManager`. The `PanelManager` has functions to manage the life cycle of a panel as well as manage the collection of plugins the user has installed.

##Plugin Life Cycle
A plugin is first initiated when the webpage initiates, `onInit` is called. This way the plugin may set up a service or set up anything else.
When the user decides to open up a panel, `onRun` is called. This is the standard code that is run.
When the panel is closed, `onClose` is called. This lets the plugin do any last minute saves or UI changes before closing.
If the user does not like the plugin anymore, `onUninstall` is called when the plugin in being removed. Any file attributes or settings that were added can be cleaned up and deleted properly.

##Building Plugins
Designing both types of plugins are very similar. Before they can be run, they must be installed. This may occur manually or via the Gltn Store. The code to install a panel or service is:

```Javascript
    var panel = new Panel("MyPanel", "js/mypanel.js"); 
    //This could be a service too. They are initiated using the same constructor parameters
    panelManager.install(panel);
```
After the panel is installed, it is cached locally and can be recalled each time the webpage loads.

This can be run from the console for debugging.

The panel can also be easily run from the console as well.
`panelManager.run("MyPanel") //Using  the panel's id`

### Plugin Constructor
`new Panel/Service(id, url)`

* id - The internal panel name ie. "MyPanel"
* url - The place where this file currently exists so that it can be loaded

## *Inspiration and Ideas*
If you want to make a dictionary, but don't know where to start, look at some of these ideas:

### Calculator
A very simple tool, but also very effective at computing things while you're writing a lab report.

### Simple Speechmaking
On the news, it is recommended that a sentence have no more than 20 syllables. This makes the information more digestible. How about creating a panel that checks one's speech and advises the user on how to improve sentence structure?

### Virtual Assistant
You may think Siri is innovative, but Microsoft had their own virtual assistant in early versions of Word. Clippy was an iconic figure who used natural language to answer user questions.

#### Challenges - Go Further
* A simple chatbot can be set up in a panel, but what if the user wants to open a different panel? It may be better for this bot to be present outside of a panel. Since it'll take site space, it should be movable with the mouse or finger.
* Text is one way to interact with a bot, but it doesn't seem very natural. Take the idea of a tutor to the digital world: use text-to-speech and speech-to-text APIs to make a better chatbot

### Words / Day
Writers occasionally set daily goals for themselves. They may want to write 5,000 words that day. While Gltn has a word counter, it doesn't have a way to track words over time and measure goals. An author may appreciate this tool giving them constant feedback in the services bar.

#### Challenges - Go Further
* Make an API for this data so that a user can select this source for their spreadsheet.
* Add a timer so writers can track how much time they're spending
* If the user wants to take a break every hour or so, you should notify them
    * But ONLY if they are having writer's block. If they're on a roll, don't disturb them
    
### Image Manager
Gltn supports image imports, but there's no central manager for all images in a paper like there is with citations.

#### Challenges - Go Further
* Intercept with the default image picker. Let the user upload an image OR pick one from their library already
* Allow the user to store images per-file or store all of them in the same place, allowing for more image sharing
* Pull from popular royalty-free image sites to offer another source for the user
    * Even if they don't put it in their "library", offer a way to star certain photos