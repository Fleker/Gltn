currentpanel = "fleker_TTS";
function InitPanelfleker_TTS() {
//    $('body').append('<script type="text/javascript" src="https://rawgithub.com/hiddentao/google-tts/master/google-tts.min.js"></script>');
    
}
function GetPanelfleker_TTS() {
    return {title: "Text-To-Speech", width: 20};
}
function RunPanelfleker_TTS() {
//    window.tts = new GoogleTTS('');
    postPanelOutput("It helps a writer when one's writing is spoken. This allows a better understanding of flow and perspective to one's audience. If you want, your computer can speak your essay. Just sit back and listen.<br><br><button id='startTTS'>Start Speaking</button>");
    $('#startTTS').on('click', function() {
//        startBuild(); 
//        window.tts.play($('.content_textarea').text()); 
        var msg = new SpeechSynthesisUtterance($('.content_textarea').text());
        window.speechSynthesis.speak(msg);
    });
    $('#PanelBuildEvent').on('click', function() {
        window.tts.play($('.content_textarea').text()); 
    });
}