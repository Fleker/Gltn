The holoribbon is the name for the header that sits at the top of the screen and allows users to select various actions that appear in separate categories. This can be separately used for a different project.

`newRibbon(classname, ribbonobj)`
* Classname - The element where the ribbon will appear
* Ribbonobj - The object that contains the items and categories

    { CATEGORYNAME: 
      new Array( {group: 'Group Name', value: 'Custom HTML output'} ),
    CATEGORYNAME2: 
      new Array( {text: 'Name of Item', image: 'Image or icon for this item', action: 'Code to run when    
      clicked', key: 'Optional small label for a description or key combination'} ) }


`ribbonSwitch(num, !transition)`
* num - The category number that you wish to select
* !transition - If false, the holoribbon will transition to its new position. If true, the holoribbon will NOT transition