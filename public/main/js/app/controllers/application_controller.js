App.ApplicationController = Ember.ObjectController.extend({
	results : Ember.A(),
	location : null,
	myLocation : null,
	_idCache : {},
	_lastTweet : null,
	_counter : 0,
	center : Ember.Object.create({
		lat : 51.505,
		lng : -0.09
	}),
	init : function() {

		//Sends ation to get the users location in the map.
		Ember.run.later(this, function() {
			this.send('getLiveTweets')
		});

	},

	actions : {

		goToMap : function() {
			this.transitionToRoute('map');
		},
		goToList : function() {
			this.transitionToRoute('list');
		},

		/**
		 * @method getLiveTweets
		 * @emit getLiveTweets
		 * @return {void}
		 */
		getLiveTweets : function() {
			console.log("getLiveTweets");
			var location = this.get("center");
			var geohash = GeoHasher.encode(location.lat, location.lng);
			var resolution = 4;
			geohash = geohash.substr(0, resolution);
			//Calculating 8 Neighbors
			neighbors = {};
			neighbors.top = GeoHasher.calculateAdjacent(geohash, 'top');
			neighbors.bottom = GeoHasher.calculateAdjacent(geohash, 'bottom');
			neighbors.right = GeoHasher.calculateAdjacent(geohash, 'right');
			neighbors.left = GeoHasher.calculateAdjacent(geohash, 'left');
			neighbors.topleft = GeoHasher.calculateAdjacent(neighbors.left, 'top');
			neighbors.topright = GeoHasher.calculateAdjacent(neighbors.right, 'top');
			neighbors.bottomright = GeoHasher.calculateAdjacent(neighbors.right, 'bottom');
			neighbors.bottomleft = GeoHasher.calculateAdjacent(neighbors.left, 'bottom');
			console.log(neighbors);

			var bbox=GeoHasher.decode(geohash);
			
			//Sending the
			this.socket.emit('getLiveTweets', {
				query : neighbors
			});

		},
		getTweetsBySearch : function() {
			var location = this.get("center")
			this.socket.emit('getLiveTweets', {

				query : location
			});
		},
		changedLocation : function(newLocation) {
			this.set('location', newLocation);

		},
		locatedMe : function() {
			this.getGeoLocation();

		}
	},
	/**
	 * @property events
	 * @type {Object}
	 */
	events : {

		// Update the property from the data received.
		//cherryPickedName : ['name', 'age'],

		// Update the property using a callback.
		//            cherryPickedName: function(name, age) {
		//                this.set('name', name);
		//                this.set('age', age);
		//            },
		tweet : function(json) {
			this.addTweet(json);
			//console.log(json);
		},
		// When EmberSockets makes a connection to the Socket.IO server.
		connect : function() {
			console.log('EmberSockets has connected...');
		},

		// When EmberSockets disconnects from the Socket.IO server.
		disconnect : function() {
			console.log('EmberSockets has disconnected...');
		}
	},
	addTweet : function(twt) {
		var id = twt.id;
		var geo = twt.geo ? twt.geo : (twt.retweeted_status ? twt.retweeted_status.geo : null);
		if (geo) {
			geo = twt.geo.coordinates;

			if ( typeof this._idCache[id] === "undefined") {
				if (geo != null || geo != undefined) {
					
					

					if (this._lastTweet != null) {

						this._lastTweet.set('icon', L.AwesomeMarkers.icon({
							icon : 'icon-twitter',
							color : 'blue'
						}));
					}
					
					this._idCache[id] = twt.id;

					
					var date=new Date(twt.created_at);
					var ma=this.store.push('result', {
						id : twt.id,
						user : twt.user.screem_name,
						text : twt.text,
						lat : geo[0],
						lng : geo[1],
						tweet : twt,
						timestamp:date.getTime()
					});
					this._lastTweet = ma;
					Ember.run.later(this, function(){
					ma.set('icon', L.AwesomeMarkers.icon({
							icon : 'icon-twitter',
							color : 'red'
						}));
				});
				/*	Ember.run.scheduleOnce('afterRender', this, function () {
      //Do it here
 					});*/
					
					console.log(ma.get('icon'));
					

				}
			}
		}

	},

	coords : false,

	getGeoLocation : function() {
		if (navigator.geolocation) {
			that = this;
			navigator.geolocation.getCurrentPosition(function(position) {
				var cords = position.coords;
				var eObject = Ember.Object.create({
					lat : cords.latitude,
					lng : cords.longitude
				})
				that.set("myLocation", eObject);
			}, function(error) {
				console.log(error);
			}, {
				timeout : 2000
			});
		} else {
			this.set('geolocation', false);
		}
	},

	locationRetrieved : function(position) {
		var cords = position.coords;
		var eObject = Ember.Object.create({
			lat : cords.latitude,
			lng : cords.longitude
		})
		this.set("myLocation", cords);
	},
	locationFailed : function(error) {
		console.log(error);
	}
});
