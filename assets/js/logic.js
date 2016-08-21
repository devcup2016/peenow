document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    var INIT = {};
    var CALLBACKS = {};

    INIT.index = function(){}

    INIT.submit = function(){
        navigator.camera.getPicture(function(imageData){
            var image = document.getElementById('myImage');
            image.style.width = "100%";
            image.style.height = "100%";
            image.src = "data:image/jpeg;base64," + imageData;
            
            alert("this is the real deal")
            alert(imageData);

            resizeImage(120, image.src, function(thumb){
                alert("this is the thumb");
                alert(thumb);
                var thumbData = thumb;

                navigator.geolocation.getCurrentPosition(function(pos){
                    document.getElementById("submitBtn").addEventListener("click", function(){
                        var descData = document.getElementById("caption").value;

                        var data = {
                            'image_text' : imageData,
                            'description' : descData,
                            'image_thumb' : thumb,
                            'lat' : pos.coords.latitude,
                            'lng' : pos.coords.longitude,
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
        navigator.geolocation.getCurrentPosition(function(pos){
            var lat = pos.coords.latitude;
            var long = pos.coords.longitude;
            alert("fetch start")
            mPost({
                url: GLOBALS.server + "areas/" + lat +"," + long,
                method: "GET",
                success: function(data){
                    alert(data)
                    var dataObj = JSON.parse(data);
                    for (var i = 0; i < dataObj.length; ++i) {
                        var p = dataObj[i];
                        

                        var li = document.createElement("li");
                        var link = document.createElement("a");
                        var img = document.createElement("img");  
                          
                        var details = document.createElement("p");
                        var distance = document.createElement("p");

                        alert(p.image_text);

                        alert(p.distance);

                        var float = parseFloat(p.distance)
                        alert(float);

                        var meters = parseInt((float*1000000)/1000) + " m";
                        alert("distance");
                        alert(meters);

                        img.src = "data:image/jpeg;base64," + p.image_text;
                        img.style.width = "100%";
                        img.style.height = "100%";
                        details.innerHTML = "<strong>" + p.description + "</ strong>" ;
                        distance.innerHTML = meters;

                        alert("appender1")

                        link.appendChild(img);
                        link.appendChild(details);
                        link.appendChild(distance);
                        li.appendChild(link);
                        find_array.appendChild(li)

                        alert("appender2")
                    }
                },
                fail: function(error){
                    alert(error)
                }
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