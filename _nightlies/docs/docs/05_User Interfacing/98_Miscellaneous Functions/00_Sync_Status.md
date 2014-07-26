### Syncing
If you want to look into the file's sync history, there are a few calls for getting and setting the status. This is viewed mainly using the main_Sync panel, but other applicaitons can be developed.

### Getting

* `SYNC_STATUS` - A String indicating the current value of the sync
* `SYNC_HISTORY` - An Array of SYNC_STATUS's already used
* `getSyncStatusGood()` - Generates an "OK" sync response

### Setting
* `setSyncStatus(String)` - Alters the value of `SYNC_STATUS` and also adds this value to `SYNC_HISTORY`