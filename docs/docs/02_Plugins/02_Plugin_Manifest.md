### Get a Panel
This function serves essentially as the manifest for the plugin, containing various properties about how it should run in the Gltn Editor.
`GetPanel[Panel_Name]`

```Javascript
    function GetPanelmain_Character() {
            return {title: "Character Palette", bordercolor: "#000099", width: 25, override:[13]};
    }
```

**Hint:**
Core panels are denoted by 'Main_[Panel_Name]

`return {title: "", bordercolor: "", width: #};`

* title - Name of the Panel, displayed at the top
* bordercolor - Color of the border surrounding the panel
* width - Percent of the screen the panel takes up
* override - When this panel is active, which javascript key codes do you want to override the default action? For the character palette, a new line shouldn't be added because you pressed enter, so you can prevent that from happening by passing the keycode for Enter (13)
* maximize - If true, the panel gets a maximize button that allows it to take over the whole screen, hiding your content temporarily. Also, the panel can get notified of this and adjust the layout accordingly


