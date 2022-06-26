### Known Issues
* None of the requests retry on failure
* Popup does not actually update despite technically supporting reactivity (object passed to it is not reactive) 
* Rendering the full list is quite slow. Check out clusterize, vue-virtual-scroll-list, or similar. Or just don't render all items
* In useMapbox composable, calling any of the helpers with the same id does not remove the previous watcher
* The map sometimes does not show the symbol icon. Race condition when loading/adding it?