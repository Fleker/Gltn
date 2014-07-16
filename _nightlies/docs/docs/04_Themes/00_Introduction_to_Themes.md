## Getting Started

Themes alter the look and feel of the editor, but they should not alter the actual content on-screen. A theme makes the editor look fresh and new while giving the user a consistent user experience.

What is a theme? It is a collection of attributes that alter the look of the editor without altering the actual content on-screen. This gives the Gltn Editor a fresh look that may be modern while at the same time giving users a consistent user experience. How is a theme written? It is a collection of colors, standardized, that developers can use in their plugins for a consistent color palette across all plugins and devices. A theme developer can make up their own set of colors and the user's editor should accurately refect that theme. In addition to colors, developers may also give general CSS commands and run Javascript. If a developer may also create a settings menu for users to have even more customization.

## Installing
Themes may be installed manually from a console. 
`new Theme(id, name, url, icon)`

* id - A unique internal id for this theme
* name - The name of the theme
* url - The location of this theme
* icon - The icon of the theme

After being installed, the theme is available in window.settings.theme but it is not immediately turned chosen. To select your theme, either choose it from the Themes Panel, or give the command:
`themeManager.pickTheme(id)` 
Where id is the internal id for the theme.

Themes can be submitted and placed in the Gltn Store for anyone to install.


## *Inspiration and Ideas*
If you want to make a theme, but don't know where to start, look at some of these ideas:

### Day & Night
Make the editor resemble a day on earth. Make the sun circle across the screen, altering the tint of the background. When it's night, show the moon instead and populate the background with stars.

#### Challenge - Go Further
* Use the system clock to make an accurate depiction of the sun's movement

### Holidays
Make a theme for holidays using their color palette. For example, an Easter theme would have light, low-contrast colors.
