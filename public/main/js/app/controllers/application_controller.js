App.ApplicationController = Ember.ObjectController.extend({
	results : Ember.A(),
	location : null,
	myLocation : null,
	_idCache : {},
	_lastTweet : null,
	_counter : 0,
	mapDisplay:true,
	listDisplay:false,
	newResult:0,
	sortProperties: ['timestamp'],
	isQuaque:true,
	sortAscending: false,
	center : Ember.Object.create({
		lat : 51.505,
		lng : -0.09
	}),
	init : function() {

		//Sends ation to get the users location in the map.
		
		that=this;
		
		Ember.run.later(this, function() {
				this.send('getLiveTweets')
		});

		$.getJSON('places.json', function(data) {
  			var location= Math.floor(Math.random()*data.places.length);
  			var place=data.places[location];
  			that.set('center',Ember.Object.create({
									lat : place.lat,
									lng : place.lng
						}));
		});


	},

	actions : {

		goToMap : function() {
			this.transitionToRoute('map');
			this.set('mapDisplay',true);
			this.set('listDisplay',false);
		},
		goToList : function() {
			this.transitionToRoute('list');
			this.set('mapDisplay',false);
			this.set('listDisplay',true);
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

						
						var nr=this.get('newResult');
						var content=this.get('content');
						console.log(content.get('length'));
						if(content.get('length')>3&&nr>1){
							
							var reverse=content.toArray().reverse();
							Ember.run.later(this, function(){
							console.log	(nr);
							this.set('newResult',0);
								for (var i=0; i<nr; i++) {
		   							reverse[i].set('icon', L.AwesomeMarkers.icon({
										icon : 'icon-twitter',
										color : 'blue'
									}));	
								}
								
							});

						}else{
							this._lastTweet.set('icon', L.AwesomeMarkers.icon({
								icon : 'icon-twitter',
								color : 'blue'
							}));
							this.set('newResult',0);
						}
						

						
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
					var nr=this.get('newResult');
					nr++;
					this.set('newResult',nr);
					});
				/*	Ember.run.scheduleOnce('afterRender', this, function () {
      //Do it here
 					});*/
					
					

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