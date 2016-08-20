var GLOBALS = {};
GLOBALS.server = "http://pee.storyteching.ph/api/"

var mPost_channels = {};

function mPost(mPostObj) {
    var url = mPostObj.url;
    var params = JSON.stringify(mPostObj.data);
    var channel = mPostObj.channel;
    var http = new XMLHttpRequest();
    if (channel != undefined) {
        if (mPost_channels[channel] == undefined) { mPost_channels[channel] = http } else { mPost_channels[channel].abort();
            mPost_channels[channel] = http } };
    http.open(mPostObj.method, url, true);
    if (mPostObj.headers != undefined) {
        var hKeys = Object.keys(mPostObj.headers);
        if (hKeys.length > 0) {
            for (var i = 0; i < hKeys.length; i++) { http.setRequestHeader(hKeys[i], mPostObj.headers[hKeys[i]]) } } else { http.setRequestHeader("Content-type", "application/json") } } else { http.setRequestHeader("Content-type", "application/json") };
    http.send(params);
    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            if (channel != undefined) {
                if (mPost_channels[channel] != undefined) { delete mPost_channels[channel] } };
            if (http.status == 200) { mPostObj.success(http.responseText) } else { mPostObj.fail(http.status + ' - ' + http.statusText + ': ' + http.responseText) } } } }
