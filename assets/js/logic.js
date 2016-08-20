document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    var INIT = {};
    var CALLBACKS = {};

    INIT.index = function(){}

    INIT.submit = function(){
        navigator.camera.getPicture(CALLBACKS.camera, CALLBACKS.error, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    }

    INIT.find = function(){
        navigator.geolocation.getCurrentPosition(disp);
    }

    CALLBACKS.geolocation = function(pos){
        var lat = pos.coords.latitude;
        var long = pos.coords.longitude;
    }

    CALLBACKS.camera = function(imageData){
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;

        navigator.geolocation.getCurrentPosition(function(pos){
            mPost({
                url: GLOBALS.server + "areas",
                method: "POST",
                data: {
                    'image_text' : imageData,
                    'description' : 'lorem ipsum',
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
        })
    }

    CALLBACKS.error = function(err){
        alert('Failed because: ' + err);
    }


    INIT[GLOBALS.origin]();
}

