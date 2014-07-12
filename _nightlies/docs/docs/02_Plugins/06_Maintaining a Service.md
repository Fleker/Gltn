## Service Life Cycle
Like a panel, a service is first called when the plugin is loaded. At this point you may wish to begin the service. If so, you will want to specify attributes at the beginning. 
A service will continue to run in the background until it is stopped. Right now this must be done by the developer, but down the line an interface may be developed to allow users to force stop specific services. 

When developing a service, please keep in mind that you are developing a background web plugin. Thus, minimal execution is expected. To help with that, the service life cycle includes "heartbeats". A heartbeat is a function that executes after a specified length of time. Alternatively, a service may execute on events, like a key press or one of the built-in panel events.

A service lives in the service bar, which appears underneath the content area. To indicate the service is running, an icon or text will be present. When selecting the icon to use, please keep themes in mind. Make sure your icon will appear well in different themes.

### Heartbeat
Imagine a service as a heart. When the heart first forms, it is given life. A service has a heartbeat, which is a metaphor for a function to be run everytime the service "beats". The length of a heartbeat, it's "beats per second" are another attribute the developer can specify. Although in this case it's the number of milliseconds per beat. 

When you specify heartbeat attributes, it executes a setInterval command with the heartbeat as the function and the heartrate as the time interval. When this is done, the interval variable is stored to allow a service to cancel the service. This essentially stops the heart.

#### Notable Variables
`.onHeartbeat` is a function that executes each heartbeat.
`.heartrate` is the length of time between heartbeats in milliseconds/beat.
`.heart` is the interval variable

### Service Bar
The service bar makes it easy for users to receive feedback on action from the service as well as know what is running. In the future, UI may appear to let users close buggy services or services that take up too much processing power.

For the moment, a service icon will appear in the service bar with limited action. A title will be assigned to the icon so that it can give glanceable information about the service state. If clicked, an action may be completed. Usually, this will be to run the service's panel to provide users with more information and controls. However, it can be assigned to anything.

#### Notable Variables
` .servicesBarIcon` is the data (text or icon) that will be displayed in the services bar   
`.servicesBarTitle` is the text that will be displayed if the icon is hovered over
`.onServiceBarClick` is the function that executes if the icon is clicked.