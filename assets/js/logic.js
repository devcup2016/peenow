document.addEventListener("deviceready", onDeviceReady, false);

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function onDeviceReady(){
    var INIT = {};
    var CALLBACKS = {};
    var DEBUG = {};

    DEBUG.geoDisplay = document.createElement("div");
    DEBUG.geoDisplay.style.position = "absolute";
    DEBUG.geoDisplay.style.top = "5px";
    DEBUG.geoDisplay.style.left = "5px";
    DEBUG.geoDisplay.style.zIndex = "10000";
    DEBUG.geoDisplay.style.color = "#fff";

    document.body.appendChild( DEBUG.geoDisplay)

    GLOBALS.pos = {};

    GLOBALS.noInit = true;

    INIT.index = function(){}

    INIT.submit = function(){
        navigator.camera.getPicture(function(imageData){
            var image = document.getElementById('myImage');
            image.style.width = "100%";
            image.style.height = "100%";
            image.src = "data:image/jpeg;base64," + imageData;

            resizeImage(120, image.src, function(thumb){             
                var thumbData = thumb;
                document.getElementById("submitBtn").addEventListener("click", function(){
                   
                        var descData = document.getElementById("caption").value;

                        var data = {
                            'image_text' : imageData,
                            'description' : descData,
                            'image_thumb' : thumb,
                            'lat' : GLOBALS.pos.lat,
                            'lng' : GLOBALS.pos.lng,
                        }

                        alert("submitting")

                        mPost({
                            url: GLOBALS.server + "areas",
                            method: "POST",
                            data: data,
                            success: function(data){
                                alert("go")
                                alert(data)
                            },
                            fail: function(error){
                                alert("no")
                                alert(error)
                            }
                        })
                  
                }, false)
            })

           
        }, CALLBACKS.error, { quality: 50,
            targetWidth: 480,
            targetHeight: 480,
            destinationType: Camera.DestinationType.DATA_URL
        });
        
    }

    INIT.find = function(){
        var find_array = document.getElementById("find_array");
        find_array.innerHTML = "";
 
        var lat = GLOBALS.pos.lat;
        var lng = GLOBALS.pos.lng;

        var specific = GLOBALS.server + "areas/" + lat +"," + lng;
        var generic = GLOBALS.server + "areas" 
        mPost({
            url: generic,
            method: "GET",
            success: function(data){
                var dataObj = JSON.parse(data);
                for (var i = 0; i < dataObj.length; ++i) {
                    var p = dataObj[i];

                    var meters = getDistance(GLOBALS.pos.lat, GLOBALS.pos.lng, p.lat, p.lng) + "m";

                    var li = document.createElement("li");
                    var link = document.createElement("a");
                    var img = document.createElement("img");  
                        
                    var details = document.createElement("p");
                    var distance = document.createElement("p");

                    img.src = "data:image/jpeg;base64," + p.image_thumb;
                    img.style.width = "100px";
                    img.style.height = "100px";
                    details.innerHTML = "<strong>" + p.description + "</ strong>" ;
                    distance.innerHTML = meters;

                    link.appendChild(img);
                    link.appendChild(details);
                    link.appendChild(distance);
                    li.appendChild(link);
                    find_array.appendChild(li);
                }
            },
            fail: function(error){
                alert(error)
            }
        })
     
    }

    INIT.compass = function(){
       
    }

    INIT.all = function(){
        navigator.geolocation.getCurrentPosition(function(pos){
            GLOBALS.pos.lat = pos.coords.latitude;
            GLOBALS.pos.lng = pos.coords.longitude;
            DEBUG.geoDisplay.innerHTML = GLOBALS.pos.lat + "<br>" + GLOBALS.pos.lng;

            var r = Math.floor(Math.random()*125);
            var g = Math.floor(Math.random()*125);
            var b = Math.floor(Math.random()*125);

            DEBUG.geoDisplay.style.backgroundColor = "rgb("+ r+","+g+","+b+")";

            setTimeout(function(){INIT.all()},500)

            if (GLOBALS.noInit){GLOBALS.noInit = false; INIT[GLOBALS.origin]()}
        })
    }

    CALLBACKS.error = function(err){
        alert('Failed because: ' + err);
    }

    
    INIT.all();
}


function resizeImage(longSideMax, url, callback) {
    var tempImg = new Image();
    tempImg.src = url;
    tempImg.onload = function() {
        try {
			var targetWidth = tempImg.width;
			var targetHeight = tempImg.height;
			var aspect = tempImg.width / tempImg.height;

			if (tempImg.width > tempImg.height) {
                longSideMax = Math.min(tempImg.width, longSideMax);
                targetWidth = longSideMax;
                targetHeight = longSideMax / aspect;
			}
			else {
                longSideMax = Math.min(tempImg.height, longSideMax);
                targetHeight = longSideMax;
                targetWidth = longSideMax * aspect;
			}

			var canvas = document.createElement('canvas');
			canvas.width = targetWidth;
			canvas.height = targetHeight;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(this, 0, 0, tempImg.width, tempImg.height, 0, 0, targetWidth, targetHeight);

            callback(canvas.toDataURL("image/jpeg").split("data:image/jpeg;base64,").join(""));
        } catch(e){
            callback(e);
        }
    };
}

function getDistance(lat1, lng1, lat2, lng2){
    try {
        alert(lat1)
        alert(lng1)
        alert(lat2)
        alert(lng2)

        var R = 6371; // Radius of the earth in meters
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLng = deg2rad(lng2-lng1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLng/2) * Math.sin(dLng/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = parseInt(((R * c)*1000)*100)/100; // Distance in meters
       
        return d;
    } catch(e){
        alert(e)
        return 1
    }
}


