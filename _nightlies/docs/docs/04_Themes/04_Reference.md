##Reference
###*Enum Theme*
The Enum `Theme` provides a variety of color options that are used by the system and can be taken by developers to achieve native-looking plugins that are always attractive and consistent within the user's experience with the application.
Note that the default values are already provided. If you don't want to change every value, only change the values that concern you in your theme script.

* `fontColor: "black"` - Main color of the text
* `fontColorAlt: "#222"` - A secondary, similar color for the text to be used as an accent
* `fontColorDark: "rgb(200,200,200)"` - A starkly different color for text in a different background color
* `bodyColor: "white"` - The general color of the background
* `bodyColorDark: "black"` - A different color of the background that is opposite in color
* `fullscreen: { ... }` - A set of colors relating to fullscreen mode
    * `fontColor:"black"` - The color of the text in fullscreen
    * `bodyColor: "rgb(204,204,204)"` - The color of the background in fullsceen
* `fullscreenDark: { ... }` - A set of colors relating to fullscreen mode when "night mode" is activated
    * `fontColor:"white"` - The color of the text in night mode
    * `bodyColor:"rgb(41,41,41)"` - The color of the background in night mode
* `ribbon: { ... }` - A set of colors relating to the ribbon
    * `highlight:"rgb(44,62,80)"` - The background color a ribbon button turns when hovered over
    * `plain:rgba(0,0,0,0)"` - The background color of a ribbon ordinarily (transparent -- it adopts the parent's background color)
* `palette: { ... }` - A variety of colors based on common color themes. See more at the bottom.
    * `blue: { ... }`
        * `white: "#e7e9fd"`
        * `light: "#d0d9ff"`
        * `normal: "#5677fc"`
        * `thick: "#2a36b1"`
        * `accent100: "#a6baff"`
        * `accent400: "#4d73ff"`
        * `accent700: "#4d69ff"`
    * `brown: { ... }`
        * `white: "#efebe9"`
        * `light: "#d7ccc8"`
        * `normal: "#795548"`
        * `thick: "#3e2723"`
        * `accent100: "#ff9e80"`
        * `accent400: "#ff3d00"`
        * `accent700: "#dd2c00"`
        

##Palette
The palette allows both theme developers and other plugin developers to access a large variety of colors in a dynamic way. If the theme's value for red is used instead of a custom value, the plugin will always look consistent, even if the user changes themes. 

Below are the different types of color weights that can be selected for each palette object, and a description of what it is

* white - weight 50,   essentially being white with that color as an accent; if this is in red, it would be white with a redish tint
* light - weight 100,  being a light version of that color; if this is in red, it would be pink
* normal - weight 500, the regular color; if this is in Red, this would be red.
* thick - weight 900, a darker version of that color; if this is in red, it would be maroon
* accent100 - weight 100 accent, a light accent color in the same color idea; if this is in red it would be a high contrast light pink
* accent400 - weight 400 accent, an accent color in the same color idea; if this is in red it would be a high contrast pink
* accent700 - weight 700 accent, a dark accent color in the same color idea; if this is in red it would be a high contrast dark pink 
            grey: {
                white: "#fafafa",
                light: "#f5f5f5",
                normal: "#9e9e9e",
                thick: "#212121",
                accent100: "#cfd8dc",
                accent400: "#607d8b",
                accent700: "#263238"
            },
            green: {
                white: "#d0f8ce",
                light: "#a3e9a4",
                normal: "#259b24",
                thick: "#0d5302",
                accent100: "#a2f78d",
                accent400: "#14e715",
                accent700: "#12c700"
            },
            orange: {
                white: "#fff3e0",
                light: "#ffe0b2",
                normal: "#ff9800",
                thick: "#e65100",
                accent100: "#ffd180",
                accent400: "#ff9100",
                accent700: "#ff6d00"
            },
            purple: {
                white: "#f3e5f5",
                light: "#e1bee7",
                normal: "#9c27b0",
                thick: "#4a148c",
                accent100: "#ea80fc",
                accent400: "#d500f9",
                accent700: "#aa00ff"
            },
            red: {
                white: "#fde0dc",
                light: "#f9bdbb",
                normal: "#e51c23",
                thick: "#b0120a",
                accent100: "#ff7997",
                accent400: "#ff2d6f",
                accent700: "#e00032"
            },
            yellow: {
                white: "#fffde7",
                light: "#fff9c4",
                normal: "#ffeb3b",
                thick: "#f57f17",
                accent100: "#ffff8d",
                accent400: "#ffea00",
                accent700: "#ffd600"
