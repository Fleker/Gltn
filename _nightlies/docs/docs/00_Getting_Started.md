## *Getting Started*
It's really easy to start using Gltn. Everything happens in the browser. 

### Setting Up the Environment
#### Using a Server
You may want to download the Gltn Editor and set it up on your own server. This will make it possible for you to install custom extensions and execute them in a real environment. With the source files, just upload them using FTP or a different way to a folder on your web server. Once that's complete, just open `edit.php` and you should have the full editor running. You can use the browser console to give commands for things like installing or executing a function.

Alternatively, you can just host the plugins you want to run on your server. You can use the hosted editor, using the console to execute installation commands.

#### Locally
If you don't have a web server to try it out, Gltn should run fairly well locally in your web browser when you download the editor. You will be able to do a lot of interaction using the browser's console, such as installing local files and executing commands.

The source files are readily available on GitHub. Just download a zip or fork the code to get a copy. Then, run `edit.php` in your browser locally and pretty much everything should work. Of course, some features such as the store and dictionary will be unaccessible locally.

#### Read the Documentation
There's a variety of plugin types you can develop for Gltn: formats, themes, dictionaries, panels. Each system is different in how they work and you should read the specific articles for more help on setting up your environment for a given plugin. Additionally, each section includes examples of already used code to help you get started, ideas for inspiration, and API guides and references.

## *Developer Guidelines*
To be approved for the Gltn Store, you must follow a couple of guidelines. Here's some advice:

* Focus on the content - Gltn ultimately is a writing platform. You should consider how your plugin will help users with writing. It should not distract the user from their task and should compliment the system. Don't try to go overboard. This is not an operating system.
* Integration - Your plugin may not secretly manipulate user data. This includes but isn't limited to deleting settings and files as well as adding settings and files without the user's consent or knowledge. Also, your plugin should use the APIs and procedures recommened.
* Function - Your plugin must meet its specified function and not secretly run other code. This includes but isn't limited to attacking servers, running malicious code, or interfering with the user in a malicious way.
* Classiness - Your plugin must be tastefully presented. This includes but isn't limited to showing pornography, insulting the user or any other individual, and presenting information in a tasteless manner.