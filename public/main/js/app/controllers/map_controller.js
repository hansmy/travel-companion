// Example Controller
var MAX_SIZE_TWEETS_MODAL = 20;
App.MapController = Ember.ObjectController.extend({
	zoom : 12,
	needs : 'application',
	//the location of the screen or searched place
	location : null,
	locationBinding : 'controllers.application.location',
	//the users current location using HTML5
	myLocation : false,
	myLocationBinding : 'controllers.application.myLocation',
	//Array of Markers
	markers : Ember.A(),
	markersBinding : 'controllers.application.results',

	centerBinding : 'controllers.application.center',
	init : function() {
		this.set('store', this.store);
	},
	//modelBinding:"controllers.application.model",

	remove : function(s) {
		this.get('markers').removeObject(s);
	},
	zoomIn : function() {
		this.incrementProperty('zoom');
	},
	zoomOut : function() {
		this.decrementProperty('zoom');
	},
	add : function() {
		this.get('markers').pushObject(App.Supermarket.create({
			location : {
				lat : this.get('center.lat'),
				lng : this.get('center.lng')
			},
			name : 'Tweets'
		}));
	},

	highlight : function(s) {
		s.toggleProperty('highlight');
	},
	lock : function(s) {
		this.highlight(s);
		s.toggleProperty('draggable');
	},
	centerMarker : function(s) {
		this.set('center', Ember.Object.create({
			lat : s.get('location.lat'),
			lng : s.get('location.lng')
		}))
	},
	icons : [{
		label : 'Supermarket',
		icon : L.AwesomeMarkers.icon({
			icon : 'shopping-cart',
			color : 'blue'
		}),
	}, {
		label : 'Rocket!',
		icon : L.AwesomeMarkers.icon({
			icon : 'rocket',
			color : 'orange'
		})
	}, {
		label : 'Fire! Fire!',
		icon : L.AwesomeMarkers.icon({
			icon : 'fire-extinguisher',
			color : 'red'
		})
	}, {
		label : 'Let\'s play!',
		icon : L.AwesomeMarkers.icon({
			icon : 'gamepad',
			color : 'cadetblue'
		})
	}, {
		label : 'Ember',
		icon : L.AwesomeMarkers.icon({
			icon : 'fire',
			color : 'green'
		})
	}],
	changeIcon : function(s, icon) {
		s.set('icon', icon);
	},
	paths : [App.Pipe.create({
		label : 'Pipe 1',
		locations : [Ember.Object.create({
			lat : 41.276081,
			lng : -8.356861
		}), Ember.Object.create({
			lat : 41.276081,
			lng : -8.366861
		})]
	}), App.Pipe.create({
		label : 'Pipe 2',
		locations : [Ember.Object.create({
			lat : 41.276081,
			lng : -8.366861
		}), Ember.Object.create({
			lat : 41.276081,
			lng : -8.376861
		})]
	}), App.Pipe.create({
		label : 'Pipe 3',
		locations : [Ember.Object.create({
			lat : 41.276081,
			lng : -8.376861
		}), Ember.Object.create({
			lat : 41.276081,
			lng : -8.386861
		})],
		color : 'red',
		weight : 10,
		opacity : 0.8,
		dashArray : '5, 1'
	}), App.Valve.create({
		label : 'Valve 1',
		location : {
			lat : 41.276081,
			lng : -8.361861
		}
	}), App.Valve.create({
		label : 'Valve 2',
		location : {
			lat : 41.276081,
			lng : -8.371860999999999
		}
	}), App.Valve.create({
		label : 'Valve 3',
		location : {
			lat : 41.276081,
			lng : -8.381861
		}
	})],
	centerPath : function(p) {
		var c = p.get('path').getBounds().getCenter();
		this.set('center', Ember.Object.create({
			lat : c.lat,
			lng : c.lng
		}));
	},
	removePath : function(p) {
		this.get('paths').removeObject(p);
	},
	changeColor : function(p, c) {
		p.set('color', c);
	},
	changeFillColor : function(p, c) {
		p.set('fillColor', c);
	},
	addPipe : function() {
		this.get('paths').pushObject(App.Pipe.create({
			label : 'New Pipe',
			locations : [Ember.Object.create({
				lat : this.get('center.lat') - 0.0005,
				lng : this.get('center.lng') - 0.001
			}), Ember.Object.create({
				lat : this.get('center.lat') + 0.0005,
				lng : this.get('center.lng') + 0.001
			})],
			color : 'purple'
		}));
	},
	addValve : function() {
		this.get('paths').pushObject(App.Valve.create({
			label : 'New Valve',
			location : {
				lat : this.get('center.lat'),
				lng : this.get('center.lng')
			},
			color : 'lime'
		}));
	},

	locationDidChange : function() {

		var location = this.get("location");
		var bbox = location.get('boundingbox');
		if (bbox) {
			var southWest = L.latLng(bbox[0], bbox[2]);
			var northEast = L.latLng(bbox[1], bbox[3]);
			var bounds = L.latLngBounds(southWest, northEast);
			var center = bounds.getCenter();
			this.set('center', Ember.Object.create(center));

		}

	}.observes('location'),

	myLocationDidChange : function() {
		var myLocation = this.get('myLocation');
		this.set('center', myLocation);
	}.observes('myLocation'),
	centerChange : function() {

		this.searchTerm();

	}.observes('center.lat', 'center.lng'),
	searchTerm : App.debouncePromise(function() {
		var searchController = this;

		var store = this.get('store');
		var center = this.get('center');

		console.log('searchTerm-debouncePromise', 'center to ' + [center.get('lat'), center.get('lng')]);
		that = this;
		return store.find('result', {
			lat : center.lat,
			lng : center.lng,
			radio : "2km"
		}).then(function(results) {
			// do stuff with each results
			results.forEach(function(result) {
				// do stuff with each result
				var markers = that.get('markers');
				var id = result.get('id');
				//if is not loaded in markes
				if (!markers.isAny('id', id)) {
					//add to markers
					markers.pushObject(result);
				}
			});

		});
	}, 3000)
});
