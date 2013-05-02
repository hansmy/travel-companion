var main = {};
main.init = function() {

	var socket = io.connect();

	jQuery(function($) {
		var tweetList = $('ul.tweets');
		socket.on('tweet', function(data) {
			/*
			 data.user.screen_name
			 * */
			if (data.geo) {

				tweetList.prepend('<li>' + data.geo.coordinates + ' ' + data.user.screen_name + ': ' + data.text + '</li>');
				var map = view.map;
				var geo = data.geo.coordinates;

				view.addMarker(geo[0], geo[1], map, data);
			}
		});
	});

}
var view = {};
view.map = null;

view.loadMap = function() {
	//,
	var map = L.map('map').setView([3.43, -76.52], 13);;

	L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/71475/256/{z}/{x}/{y}.png', {
		maxZoom : 18,
		attribution : 'Map data from &copy OpenStreetMap via CloudMade.'
	}).addTo(map);
	view.map = map;
	L.control.locate({
		position : 'topright', // set the location of the control
		drawCircle : true, // controls whether a circle is drawn that shows the uncertainty about the location
		follow : false, // follow the location if `watch` and `setView` are set to true in locateOptions
		circleStyle : {}, // change the style of the circle around the user's location
		markerStyle : {},
		metric : true, // use metric or imperial units
		onLocationError : function(err) {
			alert(err.message)
		}, // define an error callback function
		title : "Show me where I am", // title of the locat control
		popupText : ["You are within ", " from this point"], // text to appear if user clicks on circle
		setView : true, // automatically sets the map view to the user's location
		locateOptions : {} // define location options e.g enableHighAccuracy: true
	}).addTo(map);
}
view.addMarker = function(lat, lon, map, twt) {
	L.marker([lat, lon]).addTo(map).bindPopup(view.buildTwitterHtml(twt)).openPopup();
}
view.buildTwitterHtml = function(twt) {
	var str = "<span><img style='float: left' src='" + twt.user.profile_image_url_https + "' />" + "<b>" + twt.user.screen_name + "</b><br/><a href ='http://twitter.com/" + twt.user.screen_name + "'>@" + twt.user.screen_name + "</a><br/> " + "</span>" + "<p>" + twt.text + "</p>"
	return str;
}
$(document).ready(function() {
	main.init();
	view.loadMap();

});
