### XML
This set of guidelines are for the XML format for dictionaries

#### Request
The dictionary sens a GET request to the url provided with the single parameter of word with a value of the current search contents. This URL should be a PHP page that takes `$_GET['word']` and searches through the XML to return a word.

#### XML Format
```XML
<?xml version="1.0" encoding="utf-8"?>
<dictionary>
    <word>
        <name>Overflow</name>
        <plural>Overflows</plural>
        <definition>
            <type>Noun</type>
            <text>The spillage resultant from overflow; excess.</text>
            <synonym>spillage;</synonym>
            <antonym>empty;</antonym>
        </definition>
        <pronunciation>
            <type>Noun</type>
            <text>/ˈəʊvəˌfləʊ/</text>
            <simple>oh-vur-floh</simple>
        </pronunciation>
        <etymology>
            <text>Latin</text>
        </etymology>   
    </word>
</dictionary>
```

As the system is currently linked to your own PHP page, you do not need to follow all these recommendations. However, this will enable the most compatibility with the Dictionary Panel.

Each entry is placed in a `word` tag. 

* name - The general name of the entry
* plural - A semicolon separated list of other ways to spell the word so that it still may be found
* definition - Several definitions may appear with these parameters
    * type - Noun, Verb, Adverb, etc.
    * text - The definition
    * synonym - A semicolon separated list of synonyms
    * antonym - A semicolon separated list of antonyms
* pronunciation - A way of indicating how to pronounce the word
    * type - Noun, Verb, Adverb, etc.
    * text - The traditional way of showing pronunciation
    * simple - A simpler, plaintext way of showing how to pronounce a word
* etymology - Showing a word's origin
    * text - The text showing the word's origin

#### Giving Proper Credit
Please give proper credit to the authors of the dictionary as well as any other notes by providing the credit tag in the XML

```XML
<dictionary>
    <credit>
        <text>Ouvert Dictionary - 2014</text>
    </credit>
</dictionary>
```

#### Return
At the end of the request, return a JSON object of the correct word to the system to properly process and format to the end user.

##### Error Handling
If a word is not found in the dictionary, return the following as text.

`$error = '{"error":"404"}';`

