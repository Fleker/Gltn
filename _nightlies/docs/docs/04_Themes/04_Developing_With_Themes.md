When developing a <a href='?Plugins/Panels_API'>panel</a> or other type of plugin with Gltn, it is recommended that you utilize themes to make sure your plugin maintains a consistent user interface. Many elements, like <a href='?Themes/Buttons'>buttons</a>, will already be themed when the panel loads. However, it is also important to maintain a similar color palette.

## Getting a Theme Color
It is very easy to access any color and bring it into your plugin. A global variable, `theme` is a palette of colors that can be used anywhere. For example, the font color is accessed by:

`theme.fontColor`

To use this in your plugin, just use JavaScript.

`var doc = "<span style='color:"+theme.fontColor+"'>Lorem Ipsum</span>";`

Alternatively, jQuery can be used to set the css rule directly.

`$('span').css('color', theme.fontColor)`

## Managing Light & Dark Themes
Developers will try to make a theme for everyone, meaning a wide array of colors. For a plugin, this can be difficult. Yes, `fontColor` will always be legible, but if you want to add a blue accent, which color do you use? For a light theme, using `blue.accent100` may be approrpriate. However, a darker theme may require `blue.accent700` to look appropriate. To combat this, you can use a simple function to return the color best suited to the theme.

`getAppropriateColor(ifLight, ifDark)`

This function will check the theme's `isRelativeDark` property. If this property is `true`, then the theme has been deemed dark by the developer of theme. By default it is `false`. So, if the theme is light, pick a color to use. Then, pick the best color for a dark theme. The function will return the color just like a variable, so you can easily place it into your code.

#### Before 

`var doc = "<span style='background-color:"+theme.palette.blue.accent100+"'>Lorem Ipsum</span>";`

`$('span').css('background-color', theme.palette.blue.accent100)`

Note how this may not look good in both light and dark situations. If it does, then there's no reason to change anything. This function is just another way for developers to customize their plugins.

#### After 

`var doc = "<span style='background-color:"+getAppropriateColor(theme.palette.blue.accent100, theme.palette.blue.accent700)+"'>Lorem Ipsum</span>";`

`$('span').css('background-color', getAppropriateColor(theme.palette.blue.accent100, theme.palette.blue.accent700))`

Now, your plugin is more versatile and adapts better to a myriad of user customization.

## Favorite Color
Users can select their favorite color from among the top-level color types. This makes it easy to integrate with your plugins to give the user a nice flair and a little more customization.

`getSettings('personal_color')`

It'll return values such as red, blue, etc. So, if you want a light blue accent, or a light accent in any color, you can use

`theme.palette[getSettings('personal_color')].accent100`

That dynamic setting can be modified if the user preferes green, or red.

<img src="http://felkerdigitalmedia.com/gltn/images\blog\favorite_color_ideas.png">

In this example, the file browser changes the button colors. Small details like that will make the user happy.