Spinners are an important part of a user interface. Showing some sort of activity on the screen can help reduce the appearance of waiting and shows the user that the webpage is still responding.

Gltn makes it easy to integrate a spinner into your plugin. The API allows you to embed HTML which will display a centered spinner by default, and you can also control the color and pretty much anything else.
<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>

## Using a Spinner
`getloader()`
This function returns a block of HTML. This HTML will be the location of the spinner.

## Spinner API
Due to the ability to override functions and consistency, custom spinners are best suited for themes.

### Custom Animation
In your plugin, you may override the `getloader()` to run your own CSS spinner. Just return a different HTML block and include custom stylesheet script to animate it.

### Custom Colors
A lighter, darker, or more colorful color may look better for the default spinner. A theme may include CSS to change some of the attributes of the loader. The `spinner` class encompasses the entire object. The `dot1` and `dot2` classes represent the individual dots. With CSS, you may change attributes for the dots such as their `border-radius` or `background-color`.

<style>
.spinner {
      margin: 100px auto;
      width: 40px;
      height: 40px;
      position: relative;
      text-align: center;
      
      -webkit-animation: rotate 2.0s infinite linear;
      animation: rotate 2.0s infinite linear;
    }

    .dot1, .dot2 {
      width: 60%;
      height: 60%;
      display: inline-block;
      position: absolute;
      top: 0;
      background-color: #999;
      border-radius: 100%;
      
      -webkit-animation: bounce 2.0s infinite ease-in-out;
      animation: bounce 2.0s infinite ease-in-out;
    }

    .dot2 {
      top: auto;
      bottom: 0px;
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }

    @-webkit-keyframes rotate { 100% { -webkit-transform: rotate(360deg) }}
    @keyframes rotate { 
      100% {
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
      }
    }

    @-webkit-keyframes bounce {
      0%, 100% { -webkit-transform: scale(0.0) }
      50% { -webkit-transform: scale(1.0) }
    }

    @keyframes bounce {
      0%, 100% {
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
      } 50% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
      }
    }
</style>