var p = panelManager.getAvailablePanels().Fleker_Wordcloud;
p.setManifest({
    title: "Word Cloud",
    name: "Word cloud",
    width: 35,
    bordercolor: "#3498db",
    icon: "check-circle-o"
});
p.onRun = function() {
    postPanelOutput("<div id=''>Include Common Words <input type='check' id='fleker_wordcloud_check' checked='checked'></div><br><div id='fleker_wordcloud'></div>");
    function isCommonWord(word) {
        commonwords = [
            "able", "about", "above", "abroad", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ago", "ahead", "ain't", "all", "allow", "allows", "almost", "alone", "along", "alongside", "already", "also", "although", "always", "am", "amid", "amidst", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "back", "backward", "backwards", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "came", "can", "cannot", "cant", "can't", "caption", "cause", "causes", "certain", "certainly", "changes", "clearly", "c'mon", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "dare", "daren't", "definitely", "described", "despite", "does", "doesn't", "doing", "done", "don't", "did", "didn't", "different", "directly", "do", "down", "downwards", "during", "each", "eight", "eighty", "either", "else", "elsewhere", "end", "ending", "enough", "entirely", "especially", "etc", "even", "ever", "evermore", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "fairly", "far", "farther", "few", "fewer", "fifth", "first", "five", "followed", "following", "follows", "for", "found", "four", "from", "forever", "former", "formerly", "forth", "forward", "further", "furthermore", "get", "gets", "getting", "given", "gives", "go", "gotten", "greetings", "goes", "going", "gone", "got", "had", "hadn't", "half", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "here's", "hereupon", "hers", "herself", "he's", "hi", "him", "himself", "his", "hither", "hopefully", "how", "however", "hudred", "i'd", "if", "ignored", "i'll", "i'm", "immediate", "in", "inc", "indeed", "ndicate", "indicated", "indicates", "inner", "inside", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "its", "it's", "itself", "i've", "just", "keep", "keeps", "kept", "know", "known", "knows", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "likewise", "little", "look", "looking", "looks", "low", "lower", "made", "mainly", "make", "makes", "many", "may", "maybe", "mayn't", "me", "mean", "meantime", "meanwhile", "merely", "might", "mine", "minus", "miss", "more", "moreover", "most", "mostly", "mr", "mrs", "much", "must", "mustn't", "my", "myself", "name", "namely", "near", "nearly", "necessary", "ne", "needn't", "needs", "neither", "never", "neverf", "neverless", "nevertheless", "new", "next", "nine", "ninety", "no", "nobody", "non", "none", "nonetheless", "nor", "normally", "not", "nothing", "notwithstanding", "novel", "now", "nowhere", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "one's", "only", "onto", "opposite", "or", "other", "others", "otherwise", "ought", "oughtn't", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "particular", "particularly", "past", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provided", "provides", "que", "quite", "rather", "really", "reasonably", "recent", "recently", "regarding", "regardless", "regards", "relatively", "respectively", "right", "round", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "since", "six", "so", "some", "somebody", "someday", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sure", "take", "taken", "taking", "tell", "tends", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "there'd", "therefore", "therein", "there'll", "there're", "theres", "there's", "thereupon", "there've", "these", "they", "they'd", "they'll", "they're", "they've", "thing", "things", "think", "third", "thirty", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "till", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twice", "two", "under", "underneath", "undoing", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "up", "upon", "upwards", "us", "use", "used", "useful", "uses", "using", "usually", "value", "various", "versus", "very", "via", "vs", "vs.", "want", "wants", "was", "wasn't", "way", "we", "we'd", "welcome", "well", "we'll", "went", "were", "we're", "weren't", "we've", "what", "whatever", "what'll", "what's", "what've", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "where's", "whereupon", "wherever", "whether", "which", "whichever", "while", "whilst", "whither", "who", "who'd", "whoever", "whole", "who'll", "whom", "whomever", "who's", "whose", "why", "will", "willing", "wish", "with", "within", "without", "wonder", "won't", "would", "wouldn't", "yes", "yet", "you", "you'd", "you'll", "your", "you're", "yours", "yourself", "yourselves", "you've", "zero"
        ];
        if($('#fleker_wordcloud_check').val() == true) /* FIXME */ {
            return false;
        } else {
           return commonwords.indexOf(word) > -1
        }
    }
    function recalculate() {
        //Grab the content, split into words, and tally them
        var arr = getWords();
        var obj = {};
        for(i in arr) {
            if(arr[i].length < 1)
                continue;
            if(obj[arr[i].toLowerCase().trim()] == undefined)
                obj[arr[i].toLowerCase().trim()] = 1;
            else
                obj[arr[i].toLowerCase().trim()] = obj[arr[i].toLowerCase().trim()] + 1;
        }

        var sortable = [];
        for (var vehicle in obj) {
            //THIS IS WHERE WE DO COMMON WORD CHECK
            if(!isCommonWord(vehicle)) {
                sortable.push([vehicle, obj[vehicle]]);
            }
        }
        sortable.sort(function(a, b) {return b[1] - a[1]})

        out = "<div style='line-height:1.5em;text-align:center;'>";
        for(i in sortable) {
    //        console.log(sortable, i, sortable[i]);
            //Get percent to determine size
            out += "&emsp;&emsp;<span style='border-bottom:solid 1px "+theme.coloralt+";border-bottom-style:outset;font-size:";
            var a = sortable[i][1] / arr.length*10;
            console.log(sortable[i][0], a);
    //        console.log(sortable[i][1], a);
            if(a > 10)
                out += 40;
            else if(a > 5)
                out += 32;
            else if(a > 1)
                out += 28;
            else if(a > 0.7)
                out += 24;
            else if(a > 0.5)
                out += 20;
            else if(a > 0.25)
                out += 18;
            else if(a > 0.1)
                out += 12;
            else if(a > 0.05)
                out += 10;
            else
                out += 8;

            out += "pt' title='"+sortable[i][1]+" "+((sortable[i][1] > 1) ? "instances" : "instance") +"'>"+sortable[i][0]+"</span>       ";
        }
        out += "</div>";
        $('#fleker_wordcloud').html(out);   
    }
    recalculate();
    $('#fleker_wordcloud_check').on('click, change', function() {
        var on = $(this).val(); 
    });
}
p.activate();