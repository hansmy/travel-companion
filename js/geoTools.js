/* This file uses globals.  Read the globals.js to check which ones */

var geoTools = {};
geoTools.position=null;
geoTools.geoOnce = false;
geoTools.geoService = null;
geoTools.mapLoaded = false;
geoTools.watchId = null;
geoTools.map = null;
geoTools.circle=null;
geoTools.user=null;
geoTools.geoFind = function(successcb, errorcb) {
    webinos.discovery.findServices(
        new ServiceType('http://www.w3.org/ns/api-perms/geolocation'),
        { onFound: function(service) {
            geoTools.geoOnFound(service, successcb, errorcb);
        } }
    );
}
geoTools.geoOnFound = function(service, successcb, errorcb) {
   console.log("found: " + service.serviceAddress);
   if (!geoTools.geoOnce) {
        geoTools.geoOnce = true;
        geoTools.geoBind(service, successcb, errorcb);
   } else {
        console.log("Not bound : " + service.serviceAddress);
   }
}
geoTools.geoBind = function(service, successcb, errorcb) {
    service.bindService({onBind: function (boundService) {
            console.log("Bound service: " + boundService.serviceAddress);
            //successcb(boundService);
            // geoTools.loadMap();
             geoTools.initiateGeo(boundService);
        }
    });
}
geoTools.loadMap= function(){
    geoTools.map=  L.map('map');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(geoTools.map);
    geoTools.map.locate({
        setView : true,
        maxZoom : 16
    });
   // geoTools.map.setView([51.527264, -0.10270]) ;

}

geoTools.initiateGeo= function (service) {
    //service.getCurrentPosition(geoTools.displayLocation, geoTools.displayError, {});
    navigator.geolocation.getCurrentPosition(geoTools.displayLocation, geoTools.displayError, {});

    /*geoTools.watchId= navigator.geolocation.watchPosition(
        geoTools.displayLocation,
        geoTools.displayError,
        {enableHighAccuracy: true, timeout:3000});*/
}
geoTools.displayLocation=function (position) {

    var posdata = "<table>";

    position.coords.latitude=51.527264;
    position.coords.longitude=-0.10270;

    posdata += "<tr><td>latitude</td><td>" + position.coords.latitude + "</td></tr>";
    posdata += "<tr><td>longitude</td><td>" + position.coords.longitude + "</td></tr>";
    posdata += "<tr><td>altitude</td><td>" + position.coords.altitude + "</td></tr>";
    geoTools.position=position;
    geoTools.latitude=51.527264;//position.coords.latitude;
    geoTools.longitude=-0.10270;//position.coords.longitude;

    var d = new Date(position.timestamp);
    // DOMtimestamp is milliseconds since the start of the Unix Epoch
    posdata += "<tr><td>timestamp</td><td>" + d.toLocaleString() + "</td></tr>";
    posdata += "</table>";
    document.getElementById('position').innerHTML = posdata;
    var latlng = new L.LatLng(51.527264,-0.10270);
    //var latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
    if(geoTools.map == null){
        geoTools.loadMap();
        geoTools.map.panTo(latlng);
    }else{
        geoTools.map.panTo(latlng);
    }
    var radius = position.coords.accuracy / 2;
    geoTools.circle=L.circle(latlng, radius);;
    geoTools.user=L.marker(latlng);
    geoTools.user.addTo(geoTools.map).bindPopup("You are within " + Math.round(radius) + " meters from this point").openPopup();
    geoTools.circle.addTo(geoTools.map);

    wikiTools.findNearestPOI();

}

geoTools.displayError=function (error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("user did not share geolocation data");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("could not detect current position");
            break;
        case error.TIMEOUT:
            alert("retrieving position timed out");
            break;
        default:
            alert("unknown error code = " + error.code + "; message = " + error.message);
            break;
    }
}

