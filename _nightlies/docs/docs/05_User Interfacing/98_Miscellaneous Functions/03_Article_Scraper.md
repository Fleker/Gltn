Gltn is all about removing monotony from writing. Thus, a lot of work has been focused around the citation experience. While there's been enormous improvement, there's still room to improve. For example, citing an article requires you to still manually input the article title, author, url, date published, etc. To improve this, an article scraper was built.

The goal of this project is to automatically access these attributes and fill them in by taking data from the url. Due to the myriad of website templates and formats, this project will require some maintenance to be successful. Like other aspects, this is open source.

## Starting Scraper
The scraper can be called by issuing the command `scrapeURL(String URL, [function Callback])`, passing the url as an argument. An optional callback function may be included to do something once the data is returned.

## Asynchronus Feedback
The scraper then makes an AJAX call to grab the content of the article. Thus, it will not immediately return the data. An asynchronus checker will need to be written. The system sets `SCRAPE_DONE` to true when the call is complete. Listen for this switch and then do stuff.

## Getting Data
The data is accessible by calling `SCRAPE_WEBPAGE` which will be a JSON object containing various attributes.

## Developing with Scraper
There's a simple way to add a new type of pattern. In the source for `scrapeURL()`, there is an array of attributes that are being added. To add your own, simply modify the function.

```Javascript
        atts.push({o:'Posted <time datetime="', e:'"', n:"pub_date"});
```

* `o` - The origin text to find first
* `e` - The ending text to find after
Whatever is inbetween these two results will be added to the `SCRAPE_WEBPAGE` object. 
* `n` - The name of the attribute; sent to `SCRAPE_WEBPAGE[n]`

## Source
Note that this project is still in development. Code is continually changing as more websites are examined and adapted.
```Javascript
        function scrapeURL(url, callback) {
            if(callback === undefined) 
                callback = function(data) { console.log(data); };
            window.SCRAPE_DONE = false;
            $.get('php/geturl.php', {url:url}, function(data) {
                window.scrapedata = data;
                var webpage = {};
                var atts = {
                    /* Titles */
                    a0: {o:"<title>", e:"</title>", n:"website_title"},
                    a2: {o:'<h1 class="alpha tweet-title">', e:'</h1>', n:"title"},
                    a3: {o:'og:title" content="', e:'"', n:"title"},
                    /* Authors */
                    b0: {o:'rel="author">', e:'</a>', n:"author"},
                    b1: {o:'class="author fn">', e:'</a>', n:"author"},
                    b2: {o:'<author>', e:'<', n:"author"},
                    /* Publisher Title */
                    c0: {o:'og:site_name" content="', e:'"', n:"publisher_title"},
                    c1: {ri: "<title>[\\s\\S]+?\[\|:-]([\\s\\S]+?)<\\/title>", start: "<title>", end:"</title>", ro: '$1', n: "publisher_title"},
                    /* Published Date */
                    d0: {o:'Posted <time datetime="', e:'"', n:"pub_date"},
                };
                for(j in atts) {
                    i = atts[j];
                    if(i.o !== undefined) {
                        //Index Based
                        var a = data.indexOf(i.o);
                        var i_sub = data.substring(a+i.o.length);
                        var b = i_sub.indexOf(i.e);
                        if(a > -1 && b > -1) {
                            webpage[i.n] = i_sub.substring(0,b).trim();   
                        }
                    } else {
                        var a = data.indexOf(i.start);
                        var i_sub = data.substring(a);
                        var b = i_sub.indexOf(i.end)+i.end.length;
                        if(a > -1 && b > -1) {
                            var reg = new RegExp(i.ri, 'gi');
                            webpage[i.n] = i_sub.substring(0,b).trim().replace(reg, i.ro);   
                        }
                    } 
                }
                console.log("SCRAPE FINISHED");
                if(webpage.title != undefined)
                    webpage.title = webpage.title.substring(window.title.indexOf("|"));
                window.SCRAPE_WEBPAGE = webpage;
                window.SCRAPE_DONE = true;
                callback(webpage);
            });
        }
```