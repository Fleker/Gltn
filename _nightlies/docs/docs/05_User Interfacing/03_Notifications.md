Gltn provides a simple way to create notifications and place them in a central notification repository. They are accessed in the services bar, as a service.

### Create Notification
`postNotification(id, text, action)`

* id - Notification id. If you want a single notification to exist and be updated, include the same id and that notification will be updated instead of spamming the notification panel.
* text - The text that will be displayed
* action - A simple function that can be called when the notification is selected. This may be as simple as `runPanel({panel_id})`