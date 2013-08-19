// Example Controller
var MAX_SIZE_TWEETS_MODAL = 20;
App.IndexController = Ember.ObjectController.extend({
	zoom : 12,
	_idCache : {},
	_lastTweet : null,
	center : Ember.Object.create({
		lat : 51.505,
		lng : -0.09
	}),
	markers : Ember.A(),
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
	addTweet : function(twt) {
		var id = twt.id;
		var geo = twt.geo.coordinates;

		if ( typeof this._idCache[id] === "undefined") {
			if (geo != null || geo != undefined) {
				var addLinksTwitter = function(text) {
					return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
						return url.link(url);
					});
				}
				var addHashTags = function(text) {
					return text.replace(/[\@\#]([a-zA-z0-9_]*)/g, function(m, m1) {
						var t = '<a href="http://twitter.com/';
						if (m.charAt(0) == '#')
							t += 'hashtag/';
						return t + encodeURI(m1) + '" target="_blank">' + m + '</a>';
					});
				}
				var message = function() {
					var str = "<span class='.tweet'" + "><img style='float: left' src='" + twt.user.profile_image_url_https;
					str += "' />" + "<b>" + twt.user.screen_name + "</b><br/><a href ='http://twitter.com/";
					str += twt.user.screen_name + "'>@" + twt.user.screen_name + "</a><br/> " + "</span>";
					str += "<p>" + addHashTags(addLinksTwitter(twt.text)) + "</p>";
					//Bootstrap Format
					str=" <li class='media'>";
					str+="<a class='pull-left' href=''http://twitter.com/"+ twt.user.screen_name +"'>";
					str+="<img class='media-object' src='"+twt.user.profile_image_url_https+"'>";
					str+="</a>"+"<div class='media-body'>";
					str+="<span class='media-heading'> <strong> "+twt.user.name +"</strong> "+"<a href ='http://twitter.com/";
					str+= twt.user.screen_name + "'>@" + twt.user.screen_name + "</a> </span>";
				    str+="<p>" + addHashTags(addLinksTwitter(twt.text)) + "</p>";
					str+="</div>";//closing the media-body
					str+="</li>"
					
					return str;
				}
				var marker = App.Twitter.create({
					location : {
						lat : geo[0],
						lng : geo[1]
					},
					text : message(),
					name : "Tweet"
				});
				if (this._lastTweet != null) {
					this.changeIcon(this._lastTweet, L.AwesomeMarkers.icon({
						icon : 'twitter',
						color : 'blue'
					}));
				}
				this._lastTweet = marker;
				var real = marker.get('marker');
				var that = this;
				real.on('click', function(e) {

					var title = marker.name;

					var text = marker.text;
					$("#myModal .modal-body .selectedTweet .media-list").html(text);
					/*The latest tweets on the map*/
					var aMarkers = that.get('markers').toArray().reverse();
					var last = (aMarkers.length >= MAX_SIZE_TWEETS_MODAL ) ? MAX_SIZE_TWEETS_MODAL : aMarkers.length - 1;
					//Maximum Size
					aMarkers = aMarkers.slice(0, last);
					$("#myModal .modal-body #media-container .media-list").html("");
					aMarkers.forEach(function(item) {
						if (item != marker) {
							$("#myModal .modal-body #media-container .media-list").append(item.text);
						}

					});

					$('#myModal').modal({
						keyboard : false
					});

				});
				this.get('markers').pushObject(marker);
				this._idCache[id] = twt.id;
			}
		}

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
	}
});
