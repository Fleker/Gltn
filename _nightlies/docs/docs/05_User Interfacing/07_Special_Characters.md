Unicode is a standard which allows users from around the world to type using the same character set. Even if I can't read the language or understand its characters, my program can interpret the character just as it would any Latin character. This is great for users, and great for developers. What this does mean though, is that the characters that appear on your keyboard are far from the total number of characters you can use in writing. Think icon fonts and emoji and all kinds of odd symbols. Now realize that there's no extra work, it comes natively!

### Accessing Characters
You can find a few places online, like Wikipedia, which lists all unicode characters. This may be a bit cumbersome. Thankfully, Gltn has already implemented a simple character map panel. The character map is stored in a JSON object which is accessible by all developers. Just find the variable `specialCharacters` and you'll get a huge JSON array.

Inside each item is another JSON object storing some core principle data:

* val - The charater to be displayed
* title - The name of this character
* tag - A space-separated string of relevant tags for that item

This is accessible to read, but don't write. What changes won't be stored for the next session, because unicode is definitive.

To learn what keys are available, look at the source code for <a href='https://github.com/Fleker/Gltn/blob/master/js/panels.js'>panels.js</a>

<img src="http://felkerdigitalmedia.com/gltn\images\blog\character_panel.png">