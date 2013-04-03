var main={};
main.init=function(){
	
var socket = io.connect();
      
jQuery(function($) {
	var tweetList = $('ul.tweets');
	socket.on('tweet', function(data) {
		/*
		 data.user.screen_name
		 * */
		
		tweetList.prepend('<li>'+ data.geo.coordinates+' '+ data.user.screen_name+ ': ' + data.text + '</li>');
		var map=view.map;
		var geo=data.geo.coordinates;
		
		view.addMarker(geo[0],geo[1],map,data);
	});
}); 

}
var view={};
view.map=null;

view.loadMap=function(){
    //,
    var map = L.map('map').setView([3.43, -76.52], 13);;

    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/71475/256/{z}/{x}/{y}.png', {
        maxZoom : 18,
        attribution : 'Map data from &copy OpenStreetMap via CloudMade.'
    }).addTo(map);
    view.map=map;
}
view.addMarker=function(lat,lon,map,twt){
	L.marker([lat,lon]).addTo(map).bindPopup(view.buildTwitterHtml(twt)).openPopup();
}
view.buildTwitterHtml=function(twt){
	var str="<span><img style='float: left' src='" + twt.user.profile_image_url_https+ "' />" +
            "<b>" + twt.user.screen_name + "</b><br/><a href ='http://twitter.com/"
            + twt.user.screen_name  + "'>@" + twt.user.screen_name + "</a><br/> "
            + "</span>"
            + "<p>" + twt.text + "</p>"
            return str;
}
$(document).ready(function () {
    main.init();
    view.loadMap();

});
