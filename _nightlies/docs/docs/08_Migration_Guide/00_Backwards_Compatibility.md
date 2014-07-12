## Maintaining Backwards Compatibility
As Gltn is a web-based editor, the application will be automatically updated each time the user starts a session. However, that doesn't mean you can always rely on new features.

* Gltn also supports offline editing. Your plugin should still work with old versions offline
* There are times when you'll want to test new features currently in Nightlies while maintaining support for the stable channel
* Files are marked with the last version they were edited with. You may need to handle file incompatibilities from older files.

To resolve this, a simple function has been created that lets you compare the current version of Gltn with a certain release.
`greaterThanVersion(version_Name)`

Here, `version_Name` is a version code in the form W.X.Y.Z (containing three periods). The function returns true if the current version of Gltn is newer or equal to the version passed in the argument.