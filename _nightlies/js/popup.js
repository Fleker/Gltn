// JavaScript Document - Handles Popup Creation and Behavior

//PopupManager Enum
function PopupManager() {
    this.TINY = "tiny";
    this.SMALL = "small";
    this.MEDIUM = "medium";
    this.LARGE = "large";
    this.XLARGE = "xlarge";
    this.currentpopup = function() {
        return this.popups[this.popups.length-1];   
    };
    this.popups = [];
};
//TODO Closebutton
//TODO title style
popupManager = new PopupManager();
//Popup class
function Popup(data) {
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.img = data.img;
    this.value = data.value;
    this.bordercolor = data.bordercolor;
    this.output = data.ht || data.output || "";
    this.size = data.size || "medium";
    if(data.fnc === undefined)
        data.fnc = function() { };
    
    Popup.prototype.run = data.fnc;
    
    
    Popup.prototype.show = function() {
        popupManager.popups.push(this);
        $('#myModal').html('<div style="width:100%;text-align:right"><button class="close-reveal-modal close" style="color:inherit;font-size:1.5em">&#215;</button></div><table style="width:100%;vertical-align:top;" class="popupstatic"><tr><td style="vertical-align:top;width:100%;"><div style="padding-bottom:15px" class="popuptitle"></div><span class="popupsubtitle"></span><div class="popupbody"></div></td><td style="text-align:right"><img id="popupimg" src=""></img></td></tr></table><div class="popupcontent"></div>');
        if(this.title !== undefined)
            $('.popuptitle').html(this.title).css('color', getAppropriateColor(theme.palette.grey.thick,theme.palette.grey.white)).css('padding-bottom', '12px');
        if(this.subtitle !== undefined)
            $('.popupsubtitle').html(this.subtitle+"<br><br>").css('color', theme.palette.grey.accent400);
        else
            $('.popupsubtitle').css('display','none');
        if(this.img !== undefined)
            $('#popupimg').attr('src', this.img);
        if(this.value !== undefined)
            $('.popupbody').html(this.value);
        else
            $('.popupbody').css('display','none');
        if(this.bordercolor !== undefined) {
            $('#myModal').css('border', "solid 2px "+this.bordercolor);
        } else
            $('#myModal').css('border-width', '1px').css('border-color', theme.fontColor);
        $('#myModal').css('background-color', theme.bodyColor).css('color', theme.fontColor);
        $('#myModal table').css('background-color', theme.bodyColor).css('color', theme.fontColor).css('border', 'none');
        $('#myModal div, #myModal .popupcontent').css('background-color', theme.bodyColor).css('color', theme.fontColor).css('border', 'none');
        
        //Populate Popup
        $('.popupcontent').html(this.output);
        this.run();
        this.postPopup();
        localeApply();
    };
    Popup.prototype.postPopup = function() {
        //Manage size  
        $('#myModal').removeClass('tiny small medium large xlarge').addClass(this.size);
        $('#myModal').foundation('reveal', 'open');
        $('#myModal').focus();
        $(document).on('close', '[data-reveal]', function () {
            try {
                popupManager.popups[popupManager.popups.length-1].close(false);
                popupManager.popups.pop();
            } catch(e) {
                
            }
        });
    };
    
    Popup.prototype.close = function(callback) {
        if(popupManager.currentpopup() !== undefined)	
            panelManager.onPopupClose(this.title);

        if(callback !== false)
            $('.popup').foundation('reveal', 'close');
    };
}

function closePopup(callback) {
    popupManager.currentpopup().close();
}

//FUTURE Migration Compatibility
function initiatePopup(data) {
    var p = new Popup(data);
    p.show();
}