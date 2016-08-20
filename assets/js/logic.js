alert("run now2")
var geolocation_ready = function () {
    setTimeout(function(){
        try{
            alert(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(disp);
        } catch(e){
            var error = document.createElement("div")
            error.innerHTML = e;
            document.body.appendChild(error)
            geolocation_ready()
        }
    },500)
}

var camera_ready = function () {
    setTimeout(function(){
        try{
            alert(navigator.camera)
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });
        } catch(e){
            var error = document.createElement("div")
            error.innerHTML = e;
            document.body.appendChild(error)
            camera_ready()
        }
    },500)
}


camera_ready()
geolocation_ready()



function disp(pos) {
   var lat = pos.coords.latitude;
   var long = pos.coords.longitude;
   alert(lat + ", " + long);
}



function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
}

function onFail(message) {
    alert('Failed because: ' + message);
}