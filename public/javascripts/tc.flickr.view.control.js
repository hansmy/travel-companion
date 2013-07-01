L.Control.Flickr = L.Control.extend({
	options : {
		position : 'topright',
		circleStyle : {
			color : '#136AEC',
			fillColor : '#136AEC',
			fillOpacity : 0.15,
			weight : 2,
			opacity : 0.5
		},
		// inner marker
		markerStyle : {
			color : '#136AEC',
			fillColor : '#2A93EE',
			fillOpacity : 0.7,
			weight : 2,
			opacity : 0.9,
			radius : 4
		},
		metric : true
	},

	onAdd : function(map) {
		// create the control container with a particular class name
		var className = 'leaflet-control-flickr',
            classNames = className + ' leaflet-control-zoom leaflet-bar leaflet-control',
            container = L.DomUtil.create('div', classNames);
		

		// ... initialize other DOM elements, add listeners, etc.
		var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
		link.href = '#';
		link.title = this.options.title;
		var self=this;
		L.DomEvent.on(link, 'click', function() {
			map.locate({
				setView : true,
				maxZoom : 15
			});
			var flickr = function(e) {
				tfv.loadPhotos(e.latlng.lat, e.latlng.lng, map, 300);
				
			};
			map.on("locationfound", flickr);

		});

		return container;
	}
});
/*L.Map.addInitHook(function () {
    if (this.options.flickrControl) {
        this.locateControl = L.control.flickr();
        this.addControl(this.flickrControl);
    }
});*/

L.control.flickr = function (options) {
    return new L.Control.Flickr(options);
};

