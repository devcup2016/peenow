var GLOBALS = {};
GLOBALS.server = "http://pee.storyteching.ph/api/"

var mPost_channels = {};
var popUpManager = {};

function mPost(mPostObj) {
    var url = mPostObj.url;
    var params = JSON.stringify(mPostObj.data);
    var channel = mPostObj.channel;
    var http = new XMLHttpRequest();
    if (channel != undefined) {
        if (mPost_channels[channel] == undefined) { mPost_channels[channel] = http } else {
            mPost_channels[channel].abort();
            mPost_channels[channel] = http
        }
    };
    http.open(mPostObj.method, url, true);
    if (mPostObj.headers != undefined) {
        var hKeys = Object.keys(mPostObj.headers);
        if (hKeys.length > 0) {
            for (var i = 0; i < hKeys.length; i++) { http.setRequestHeader(hKeys[i], mPostObj.headers[hKeys[i]]) }
        } else { http.setRequestHeader("Content-type", "application/json") }
    } else { http.setRequestHeader("Content-type", "application/json") };
    http.send(params);
    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            if (channel != undefined) {
                if (mPost_channels[channel] != undefined) { delete mPost_channels[channel] }
            };
            if (http.status == 200) { mPostObj.success(http.responseText) } else { mPostObj.fail(http.status + ' - ' + http.statusText + ': ' + http.responseText) }
        }
    }
}

function PopUpManager() {
    this.instance = document.getElementById("windowBg");
    this.okBtn = document.getElementById("okBtn");
    this.cancelBtn = document.getElementById("cancelBtn");
    this.popupContent = document.getElementById("popupContent");
    this.preloader = document.getElementById("preloader");

    this.okBtn.addEventListener('click', function() {
        alert('click ok');
    }, false);

    this.cancelBtn.addEventListener('click', function() {
        alert('click cancel');
    }, false);
}

PopUpManager.prototype.init = function() {
    if (this.instance) this.instance.style.display = "none";
};

PopUpManager.prototype.debug = function() {
    if (this.instance) this.instance.style.display = "block";
};

PopUpManager.prototype.close = function(){
	if (this.instance) this.instance.style.display = "none";
};

PopUpManager.prototype.open = function(type, content) {
    if (this.instance) this.instance.style.display = "block";

    switch (type) {
        case 1:
            this.cancelBtn.style.display = "none";
            this.popupContent.innerHTML = content.toString();
            // ...
            break;

        case 2:
            this.popupContent.innerHTML = content.toString();
            // ...
            break;
    }
};

PopUpManager.prototype.openLoader = function(){
	this.preloader.style.display = "block";
};

PopUpManager.prototype.closeLoader = function(){
	this.preloader.style.display = "none";
};


window.onload = function() {
    var PopupManager = new PopUpManager();
    PopupManager.init();
    PopupManager.closeLoader();
    // PopupManager.debug();

   	// Sample Open
    var submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            PopupManager.open(1, "Hello Amiel awesome! :D");
        }, false);
    }

    // Sample Close
    var delay = setTimeout(function(){
    	// PopupManager.close();
    },3333);
};
