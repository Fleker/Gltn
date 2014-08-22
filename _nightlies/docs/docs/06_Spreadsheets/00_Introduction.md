Spreadsheet software has been evolving with computers since their inception as a personal device in people's homes. Over the course of the next thirty or forty years, the ability to compute grids of data has vastly improved. Today, with modern processors and other developments, computing can be done in a web browser inside of another application. The Gltn Editor includes a full spreadsheet editor plugin which allows users to create tables of static or dynamic data. The compiled table is able to be formatted depending on the format selected.

The plugin, also known as Grid, supports OpenFormulas, a standardized set of formulas that can be used in any spreadsheet software. However, Grid also allows developers to write their own functions, define custom constants, and create custom operators. Users can install libraries from the Gltn Store, and learn how to use a command from the built-in help.

## * Inspirations and Ideas *
### Periodic Table
Chemistry relies on a lot of different properties, none of which are easy to memorize. Create an easy way to look up values and use them in formulas.
`=OXYGEN_MASS`

#### Challenges - Go Further
* Instead of using underscores, turn each element into a JSON object that can be passed through (you may need to Stringify the object first), so that each property has its own properties.

`=OXYGEN.MASS + OXYGEN.ATOMICNUMBER`

* Provide a search system too: allow the users to type in a mass and the software will determine which element is being shown.

`=ATOMICMASS(16)` would display `Oxygen`