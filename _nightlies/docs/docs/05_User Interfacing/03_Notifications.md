Gltn provides a simple way to create notifications and place them in a central notification repository. They are accessed in the services bar, as a service. If the user allows the domain to display web notifications, the user will also be alerted to actions using the browser's notifications center.

## Create Notification
### Class Structure
`new Alert(id, title, body, icon, action)`
An alert is a notification (named differently to prevent function overrides). This alert contains all the property necessary to display and act upon a notification. Anything you don't know can be defined as `undefined` and a fail-safe replacement will appear instead. 

* id - This value can be anything, or undefined. It's meant to be a unique id, but is replaced anyway in the notifications system
* title - The title of the notification
* body - A summary of the notification information
* icon - A URL to the image you want displayed in the notification
* action - A function that you wish to run when the notification is acted upon (ie. clicked). This may be as simple as `runPanel({panel_id})`

`postNotification(new Alert( ... ));`
This function, with a single notification as an argument, will display the notification.

### Not Class Structure
You can choose to just provide parameters and a notification will be created and added to the sections of interest.
`postNotification(id, body, action, icon, title)`

* id - This value can be anything, or undefined. It's meant to be a unique id, but is replaced anyway in the notifications system
* body - A summary of the notification information
* action - A function that you wish to run when the notification is acted upon (ie. clicked). This may be as simple as `runPanel({panel_id})`
* icon - A URL to the image you want displayed in the notification
* title - The title of the notification