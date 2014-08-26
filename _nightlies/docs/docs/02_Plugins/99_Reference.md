## Reference
The APIs for plugins and related classes

###*Class Panel*
The class `Panel` is a self-contained plugin with functions and stored data about itself.

#### Constructor
`new Panel(id, url)`

| Arguments   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `id`     | String  | Unique id for this plugin      |
| `url`     | URL  | URL of the panel script to execute      |


| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `id`     | String  | Unique identifier for this plugin      |
| `url`        | URL     | URL of the panel script to execute                | 
|  `name`     | String  | Name of the panel, appears in the ribbon                     |
|   `title`   | String  | Title of the panel that appears at the top when opened |
| `service`       | Boolean  | Whether or not the plugin is a service (default is `false`)           |
| `icon    `   | Icon    | An image or icon representing the panel in the ribbon |
| `override    `   | [int]    | An array of keycodes to override (preventing default browser/Gltn function) |
| `bordercolor    `   | Color    | The accent color of the panel |
| `width    `   | int    | A percentage of the screen the panel by default occupies (minimum is `17`) |
| `_canMaximize    `   | Boolean    | Whether or not the panel will be able to maximize, taking over the rest of the screen (default is `false`) |
| `_isMaximized    `   | Boolean    | Whether or not the panel is currently maximized |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.getManifest()` | JSON    | Returns the manifest, a JSON object of all relevant properties to the panel                    |
| `.setManifest(JSON)`   | void    | Instead of setting all attributes individually, you may provide a `JSON object` with the corresponding property names and values |
| `.hasBordercolor()`   | Boolean    | Returns false if the bordercolor is not set for this panel |
| `.setBordercolor(Color)`   | Panel | Changes the bordercolor of the panel |
| `.enableMaximize()`   | Panel | Sets `_canMaximize` to true, meaning the panel can be maximized. Note this must be set before running for the maximize button to appear |
| `.setMaximize(Boolean)`   | Panel | Sets `_canMaximize` to the `Boolean` |
| `.canMaximize()`   | Boolean | Returns true if the panel can be maximized |
| `.isMaximized()`   | Boolean | Returns true if the panel is currently maximized |
| `.setName(String)`   | Panel | Sets the panel name to the `String` |
| `.setOverride([int])`   | Panel | Sets the array of overriding panels to the provided array |
| `.setWidth(int)`   | Panel | Sets the panel's width to the provided `int` |
| `.setMenu(JSON)`   | void | Creates a new menu in the Holoribbon with the panel's name containing an `Array` of `JSON` objects. See the Holoribbon section for more details | 
| `.activate()`   | void | Called when the panel is being created, this enables the system to identify when the panel is loaded and ready to install |
| `.getCredit()`   | String | Override this function to show any relevant licensing |
| `.onInit()`   | void | Override this function to do something when the panel is first loaded |
| `.onRun()`   | void | Override this function to do something when the panel is called by the user |
| `.onContext()`   | void | Override this function to do something when the context service is called |
| `.onImport()`   | void | Override this function to do something when the user wishes to import a file |
| `.onExport()`   | void | Override this function to do something when the user wishes to export a file |
| `.onRibbonRefresh()` | void | Override this function to do something when the Holoribbon is refreshed with new content | 
| `.onUninstall()`   | void | Override this function to do something when panel is being uninstalled |

#### Manifest Properties
* The property `_canMaximize` is `canMaximize` in the manifest 

Here is an example of utilizing the manifest to simplify panel properties:

```Javascript
    panel = new Panel("MyPanel", "js/mypanel.js");
    panel.setManifest({
        width:32,
        bordercolor:"#22ff99",
        title: "Welcome to My Panel",
        name: "My Panel"
        override: [13, 32],
        canMaximize: false
    }); 
``` 

###*Class Service*
The class `Service` is a plugin that runs in the background, completing various actions and responding to different triggers. A `Service` is a child of class `Panel`, so all `Panel` properties and methods are also valid for a `Service`.

#### Constructor
`new Panel(id, url)`

| Arguments   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `id`     | String  | Unique id for this plugin      |
| `url`     | URL  | URL of the service script to execute      |

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `servicesBarIcon`     | Icon  | The icon to be displayed in the services bar when this service is activated      |
| `servicesBarTitle`        | String     | String that appears in the tooltip when hovered over by a mouse              | 
| `heartRate    `   | int    | The interval between calls of the `onHeartbeat` method, in milliseconds |
| `heart    `   | Timer    | The interval variable for the `onHeartbeat` method. It can be used to later cancel this interval |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.onHeartbeat`     | void  | Override this function to do something every set interval                   |
| `.onServiceBarClick`       | void  | Override this function to do something when the icon is clicked in the services bar           |

###*Class PanelManager*
The class `PanelManager` stores objects of class `Panel` and `Service` and handles events between the editor and panels. It can be accessed using the variable `panelManager`

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `availablePanels`     | {Panel/Service}  | A JSON object of all panels and services that are installed     |
| `servicesBarTitle`        | String     | String that appears in the tooltip when hovered over by a mouse              | 
| `heartRate    `   | int    | The interval between calls of the `onHeartbeat` method, in milliseconds |
| `heart    `   | Timer    | The interval variable for the `onHeartbeat` method. It can be used to later cancel this interval |

| Methods    | Return  | Description                                                       |
| ---------- | :-----: | ----------------------------------------------------------------: |
| `.fromString(JSON)`     | void  | Takes a `JSON` representation of plugins and installs each one back                   |
| `.toString()`       | String  | Returns a stringified JSON object that contains all panels and services installed           |
| `.getAvailablePanelsLength()`       | int  | Returns the number of objects in `availablePanels`           |
| `.getAvailablePanels()`       | {Panel/Service}  | Returns the a JSON object of all panels and services that are installed           |
| `.getActivePanels()`       | [Panel]  | Returns an array of all panels that are currently active, an empty array if none are active          |
| `.getAvailableServices()`       | {Service}  | Returns a JSON object of all services that are installed         |
| `.getPlugin(Id)`       | Panel/Service  | Returns a plugin of the given `id`         |
| `.install(Panel/Service)`       | void | Installs the given `Panel/Service`       |
| `.uninstall(id)`       | void | Uninstalls a plugin of the given `id`      |
| `.run(id)`       | void | Runs a plugin of the given `id`      |
| `.onClose()`       | void | Executed when a panel is closed  |
| `.onMaximize()`       | void | Executed when a panel is maximized |
| `.onPopupClose()`       | void | Executed when a a popup is closed and a panel is active |
