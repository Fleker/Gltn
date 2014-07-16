## Panels v. Services
While at first they may seem very isolated, it is not difficult for a panel to also act as a service. In fact, many services come with panels. You can build it as a service, or just use this command to place something in the status bar. Clicking on that icon will open the panel again.

`initService(id, title, out)`

* id - The id of the panel
* title - The title that will appear when hovered over
* out - The HTML that will be displayed

Note that this icon is tied to the id of the panel. You may update this service icon as often as you like. By tying it to this id, no duplicate entries will be created.

#### Example - Page Count Panel
`initService("Main_PageCount", "Page Count", Math.ceil(i)+" Page"+(Math.ceil(i)==1?"":"s"));`


Take, for example, the unofficial Spotify panel. 

//TODO Paste section code
