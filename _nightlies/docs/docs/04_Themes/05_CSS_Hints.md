## How can I...
This is a short guide meant to give developers some guidance in implementing the most amount of detail to their theme.

### Selection Color
The selection color for a webpage can be altered like so:
`::selection {color:white;background:red;}`
`::-moz-selection {color:white;background:red;}`
In this example, the text I select will be colored white on a red background. Any CSS styles can be used here.

### Text Field Borders and Autofill
When you click on a text field, you may notice a blue outline if you use Chrome. Fortunately, this border doesn't have to clash with your color palette. Just alter the color:
```CSS
    input:focus, div:focus, button:focus { 
        outline: solid 1px red;
    } 
    input:-webkit-autofill { 
        -webkit-box-shadow: 0 0 0px 1000px red inset
    }
```
Now instead of a blue outline and an orange autofill color, the elements can match your theme perfectly.