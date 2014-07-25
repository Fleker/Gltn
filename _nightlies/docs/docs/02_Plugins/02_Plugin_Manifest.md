The plugin manifest is essentially a bunch of configured variables that will be used in managing the panel. You can easily set one or multiple attributes using the `setManifest` method.

```Javascript
    p.setManifest({
        title: "Welcome to My Panel",
        name: "My Panel",
        width: 25,
        bordercolor: "#332999"
    });
```

Check the reference to see all the variables that you may set.

**Note:** For layout reasons, the smallest possible width a panel can have is 17. Any panel with a smaller given width will be set to 17. Keep this in mind when developing so that you develop the layout accordingly.
