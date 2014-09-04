A loader is a useful type of interface. It lets the user know that progress is still happening even though they can't see it. Long operations should have loaders so the user does not become frustrated at no progress.

## Create a Loader
`getloader()` - This returns the loader as an HTML block. Use a script to insert this where you want it to appear.

## Play Loader
`spinloader(size = large)` - This initializes the loader object and tells it to begin spinning. If you use the argument of `true` in this function, a small version will be rendered instead for use in inline loading situations. It defaults to `false`, meaning it is medium sized.

## Stop Loader
You can stop the loader, hiding it, with `$('.spin').spin(false);`

To resume, simply call `spinloader` again.