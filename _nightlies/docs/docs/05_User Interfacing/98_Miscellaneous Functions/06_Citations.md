Here is the reference for citation objects and related APIs.

##*Class CitationFormat*
The class `CitationFormat` stores information relating to different types of resources that can be cited.


#### Constructor
`new CitationFormat(name, attributes, [fnc])`

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `name`     | String  | Recommended minimum number of characters for this document       |
| `attributes`     | String  | String separated list of input fields for this type of object       |
| `fnc`     | function  | No parameter function that may run after creating the UI. This may preload some attribute values |

##*Enum citationFormats*
The enum `citationFormats` contains every available `CitationFormat` item. This makes it easier to add new ones and extend the system.

| Properties | Description                                 |
| ----------| ------------------------------------------: |  
| `bible`    | A bible    |
| `digitalbook`    | A book accessed digitally, like an eBook  |
| `dissertation`    | A dissertation |
| `ebook`    | A book from a website, something that can be linked to |
| `government`    | A miscellaneous government document |
| `journal`    | An article that appears in a journal |
| `pamphlet`    | A short, illustrative pamphlet |
| `periodical` | A recurring print, like a magazine or newspaper | 
| `print`   | Printed text, like a print book |
| `rawdata` | Miscellanenous |
| `theater` | A play or musical |
| `web`     | Website or article found on the web |

##*Class CitationClass*
The class `CitationClass` represents every type of resource that may be cited

####Constructor
`new CitationClass(name, format, [medium])`

| Properties   | Return  | Description                                 |
| ----------   | :-----: | ------------------------------------------: |  
| `name`     | String  | Recommended minimum number of characters for this document       |
| `format`     | CitationFormat  | The `CitationFormat` ie. the parent, for this object     |
| `medium`     | String  | The type of object to interpret this as in the compiler (IN PROGRESS) |

##*Enum citationObjects
The enum `citationObjects` contains every available object of class `CitationClass` for extensibility. You'll notice some of these are copies. That is true, because a `CitationClass` is generally more frontend while a `CitationFormat` is backend.

| Properties | Description                                 |
| ----------| ------------------------------------------: |  
| `ArticleJournal`    | A journal appearing in a journal    |
| `ArticlePrint`    | An article from a print article, like a newspaper  |
| `ArticleOnline`    | An article from a news website |
| `Bible`    | A bible |
| `Blog`    | An informal article online |
| `Book`    | A book |
| `Dissertation`    | A dissertation |
| `eBook` | A book that is digital | 
| `Editorial`   | An opinion article |
| `Government` | Government document |
| `ImageOnline` | A picture or image found online |
| `LetterToEditor`     | An opinion letter published in newspapers |
| `MagazineArticle`     | An article from a magazine |
| `MAThesis`     | MA Thesis |
| `MSThesis`     | MS Thesis |
| `Musical`     | Musical Theater |
| `Pamphlet`     | A pamphlet |
| `PhotoOnline`     | A photo found online |
| `Play`     | Comedic or dramatic theater |