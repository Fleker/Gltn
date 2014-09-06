##Reference
###*Component Gltn-Grid*
The web component `gltn-grid` is used in the Spreadsheets plugin to calculate formulas and maintain data about the sheet.
| Properties   | Return  | Description                                 | Default |
| ----------   | :-----: | ------------------------------------------: | ------- |
| nameColor    | String  | Not really sure                             | `'red'` |
| title        | String  | Name of the table                           | `'New Table'` |
| rows         | String  | The last row of the table                   | `'10'` |
| cols         | String  | The last column of the table                | `'F'` |
| index        | int     | The index of the table, in respect to the document | `0` |
| sheet        | JSON    | A JSON object of all cells in formula form | `{}` |
| sheetCache   | JSON    | A JSON object of all cells while calculated | `{}` |
| Locale       | Locale  | Localization object                         | `Locale in current language` |
| isFormula    | boolean | n/a | `true` |
| isError      | boolean | n/a | `false` |
| isText       | boolean | n/a | `false` |
| errs         | JSON    | For internal use, errors in calculating cells | `{}` |
| vals         | JSON    | For internal use, values of calculated cells | `{}` |
| calc         | Function | Manages web worker and calculations | `Function` |
| colsChanged  | Function | Adjusts the table when cols change | `Function` |
| rowsChanged | Function | Adjusts the table when the rows change | `Function` |
| display      | Function | Manages the display of the cells as well as updating the content | `Function` |
| ready         | Function | Code that executes when the component initializes | `Function` |
| Cols       | Array | Array of columns in table, where each item is a character | `['A', ... , 'F']` |
| Rows      | Array | Array of rows in table, where each item is an integer | `[1, ... , 10]` |
| worker    | WebWorker | The worker used to do calculations in the background | `WebWorker` |
| makeRange | Function | Creates the arrays `Cols` and `Rows` | `Function` | 
| keydown   | Function | Manages the keyboard navigation | `Function` |

| Attributes |
| ---- |
| title |
| rows |
| cols |
| index |
| sheet |