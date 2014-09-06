Templates are terrible, but one thing they do is break down the user how to write certain sections and what they should include. This can be done side-by-side in the Style Guide panel.

<img src='http://felkerdigitalmedia.com/gltn/images\blog\style_guide.png'>

### `onStyleGuide()`
When this <a href='?Plugins/Panels_API'>panel</a> is selected by the user, this function will be called in your script. If it exists, the function will run. At the end of running, whatever is returned will be displayed inside the guide.

```JavaScript
    function onStyleGuide() {
        out = "<b>MLA Format</b><br>This is a general guide to the best practices for the MLA Format.     
            Unfortunately, it is not populated right now.";
        return out;
    }
```

You may place any sort of HTML in the guide and format it however you wish. Return a string and that is what will be displayed to the user. Be creative.