currentpanel = "fleker_TTS";
function InitPanelfleker_TTS() {
//    $('body').append('<script type="text/javascript" src="https://rawgithub.com/hiddentao/google-tts/master/google-tts.min.js"></script>');
    
}
function GetPanelfleker_TTS() {
    return {title: "Text-To-Speech", width: 20};
}
function RunPanelfleker_TTS() {
//    window.tts = new GoogleTTS('');
    postPanelOutput("It helps a writer when one's writing is spoken. This allows a better understanding of flow and perspective to one's audience. If you want, your computer can speak your essay. Just sit back and listen.<br><br><button id='startTTS' class='textbutton'>Start Speaking</button><br><button id='stopTTS' class='textbutton'>Stop Speaking</button>");
    $('#startTTS').on('click', function() {
        speechSynthesis.cancel();
        var output = $('.content_textarea').html().toLowerCase().trim().replace(/<kbd class="latex.*<\/kbd>/g, "").replace(/></g, "> <").replace(/<[^>]*>/g, "").replace(/"/g, "").replace(/&nbsp;/g, " ");
        var outarr = [];
        
        for(i=0;i<output.length;i+=200) {
            outarr.push(output.substring(i,i+200));
        }
        readMessage(outarr, 0);
    });
    $('#stopTTS').on('click', function() {
       speechSynthesis.cancel(); 
    });
}
function readMessage(outarr, i) {
    if(outarr[i] === undefined)
        return;
    var msg = new SpeechSynthesisUtterance(outarr[i]);
    window.speechSynthesis.speak(msg);     
    msg.onend = function(e) {
        readMessage(outarr, i+1);  
    };
}