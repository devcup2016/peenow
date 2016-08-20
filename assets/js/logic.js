function disp(pos) {
   var lat = pos.coords.latitude;
   var long = pos.coords.longitude;
   // alert(lat + ", " + long);
}

navigator.geolocation.getCurrentPosition(disp);