document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    var INIT = {};
    var CALLBACKS = {};

    INIT.index = function(){}

    INIT.submit = function(){
        navigator.camera.getPicture(function(imageData){
            var image = document.getElementById('myImage');
            image.style.width = "100%";
            image.style.maxWidth = "100%";
            image.style.height = "auto";
            image.src = "data:image/jpeg;base64," + imageData;
           
            resizeImage(150, image.src, function(thumb){
                alert(thumb)
                navigator.geolocation.getCurrentPosition(function(pos){
                    document.getElementById("submitBtn").addEventListener("click", function(){
                        mPost({
                            url: GLOBALS.server + "areas",
                            method: "POST",
                            data: {
                                'image_text' : imageData,
                                'image_thumb' : thumb,
                                'description' : document.getElementById("caption").value,
                                'lat' : pos.coords.latitude,
                                'lng' : pos.coords.longitude,
                            },
                            success: function(data){
                                alert(data)
                            },
                            fail: function(error){
                                alert(error)
                            }
                        })
                    }, false)
                })
            })

           
        }, CALLBACKS.error, { quality: 50,
            targetWidth: 480,
            targetHeight: 640,
            destinationType: Camera.DestinationType.DATA_URL
        });
        
    }

    INIT.find = function(){
        var find_array = document.getElementById("find_array");
        find_array.innerHTML = "";
        navigator.geolocation.getCurrentPosition(function(pos){
            var lat = pos.coords.latitude;
            var long = pos.coords.longitude;

            mPost({
                url: GLOBALS.server + "areas/" + lat +"," + long,
                method: "GET",
                success: function(data){
                    var dataObj = JSON.parse(data);
                    for (var i = 0; i < find_array.length; ++i) {
                        var p = find_array[i];
                        var li = document.createElement("li");
                        var link = document.createElement("a");
                        var img = document.createElement("img");    
                        var details = document.createElement("p");
                        var distance = document.createElement("p");

                        img.src = "data:image/jpeg;base64," + p.image_text;
                        details.style.fontWeight = "700";
                        details.innerHTML = p.description;
                        distance.innerHTML = Math.parse(p.distance*100000/1000);

                        link.appendChild(img);
                        link.appendChild(details);
                        link.appendChild(distance);
                        li.appendChild(link);
                        find_array.appendChild(li)
                    }
                },
                fail: function(error){}
            })
        });
    }

    CALLBACKS.error = function(err){
        alert('Failed because: ' + err);
    }

    INIT[GLOBALS.origin]();
}


function resizeImage(longSideMax, url, callback) {
    var tempImg = new Image();
    tempImg.src = url;
    tempImg.onload = function() {
        try {
			// Get image size and aspect ratio.
			var targetWidth = tempImg.width;
			var targetHeight = tempImg.height;
			var aspect = tempImg.width / tempImg.height;

			// Calculate shorter side length, keeping aspect ratio on image.
			// If source image size is less than given longSideMax, then it need to be
			// considered instead.
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

			// Create canvas of required size.
			var canvas = document.createElement('canvas');
			canvas.width = targetWidth;
			canvas.height = targetHeight;

			var ctx = canvas.getContext("2d");
			// Take image from top left corner to bottom right corner and draw the image
			// on canvas to completely fill into.
			ctx.drawImage(this, 0, 0, tempImg.width, tempImg.height, 0, 0, targetWidth, targetHeight);
            callback(canvas.toDataURL("image/jpeg"));
        } catch(e){
            callback(e);
        }
    };
}