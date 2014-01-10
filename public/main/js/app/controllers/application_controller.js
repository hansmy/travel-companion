App.ApplicationController = Ember.ObjectController.extend({
	results : Ember.A(),
	location : null,
	myLocation : null,
	_idCache : {},
	_lastTweet : null,
	_counter : 0,
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
				var messagePopup = function(tweet) {
					moment.fn.fromNowOrNow = function(a) {
						if (Math.abs(moment().diff(this)) < 10000) {// 25 seconds before or after now
							var m = moment(Math.abs(moment().diff(this))).twitter();
							return 'just now';
						}
						return this.fromNow(a);
					}
					var timeAgo = moment(new Date(tweet.created_at));
					//var dif=moment().diff(timeAgo);
					var timestamp = timeAgo.fromNowOrNow(true);

					var str = "<div class='container-popup' >"
					str += "<span class='tweet'" + "><img style='float: left' src='" + tweet.user.profile_image_url_https;
					str += "' />" + "<b>" + tweet.user.screen_name + "</b><br/><a href ='http://twitter.com/";
					str += tweet.user.screen_name + "'>@" + tweet.user.screen_name + "</a><br/> " + "</span>";
					str += "<p>" + addHashTags(addLinksTwitter(tweet.text)) + "</p>";
					str += " <li class='media tweet'>";
					str = "<div class='row' ><div class='span3' >"
					str += "<a class='pull-left' href='http://twitter.com/" + tweet.user.screen_name + "'>";
					str += "<img class='media-object' src='" + tweet.user.profile_image_url_https + "'>";
					str += "</a>" + "<div class='media-body'>";
					str += "<table class='' ><tr><td>";
					str += "<strong> " + tweet.user.name + "</strong> " + "<a href ='http://twitter.com/";
					str += tweet.user.screen_name + "'>@" + tweet.user.screen_name + "</a>" + "</td><td>";
					str += "<span class='timestamp '><a class='date_created' href ='http://twitter.com/" + tweet.user.screen_name + "'> <p class='muted'>" + timestamp + "</p></a></span> </td></tr><tr><td>";
					str += "<p id='text-popup'>" + addHashTags(addLinksTwitter(tweet.text)) + "</p>";
					str += "</tr></td></table>"
					str += "</div>";
					str += "</div>"
					str += "<span class='pull-right'><a class='openModal' href='#'> List</a></span>";

					str += "</div>"
					//closing the media-body
					str += "</li>"
					return str;
				};
				var message = function(tweet) {
					var timeAgo = moment(new Date(tweet.created_at));
					var timeNow = moment(new Date().now);
					var dif = moment().diff(timeAgo);
					var timestamp = timeAgo.from(timeNow);
					//Bootstrap Format
					str = " <li class='media tweet'>";
					str += "<a class='pull-left' href=''http://twitter.com/" + tweet.user.screen_name + "'>";
					str += "<img class='media-object' src='" + tweet.user.profile_image_url_https + "'>";
					str += "</a>" + "<div class='media-body'>";
					str += "<span class='media-heading'> <strong> " + tweet.user.name + "</strong> " + "<a href ='http://twitter.com/";
					str += tweet.user.screen_name + "'>@" + tweet.user.screen_name + "</a>";
					str += "<span class='timestamp pull-right'><a class='date_created'>" + timestamp + "</a></span> </span>";
					str += "<p>" + addHashTags(addLinksTwitter(tweet.text)) + "</p>";
					str += "</div>";
					//closing the media-body
					str += "</li>"

					return str;
				}
				var marker = App.Twitter.create({
					location : {
						lat : geo[0],
						lng : geo[1]
					},
					text : message(twt),
					tweet : twt,
					textpopup : "<ul class='media-list'>" + messagePopup(twt) + "</ul>",
					name : "Tweet",
					timestamp : twt.created_at
				});

				if (this._lastTweet != null) {

					this._lastTweet.set('icon', L.AwesomeMarkers.icon({
						icon : 'icon-twitter',
						color : 'blue'
					}));
				}
				this._lastTweet = marker;
				var real = marker.get('marker');
				var that = this;
				//
				real.on('click', function() {
					var twt = marker.get('tweet');
					var textpopup = "<ul class='media-list'>" + messagePopup(twt) + "</ul>";
					marker.set('textpopup', textpopup);

					$('.openModal').click('click', function(e) {

						var title = marker.name;

						var twt = marker.get('tweet');
						$("#myModal .modal-body .selectedTweet .media-list").html(message(twt));
						/*The latest tweets on the map*/
						var aMarkers = that.get('results').toArray().reverse();
						var last = (aMarkers.length >= MAX_SIZE_TWEETS_MODAL ) ? MAX_SIZE_TWEETS_MODAL : aMarkers.length - 1;
						//Maximum Size
						aMarkers = aMarkers.slice(0, last);
						$("#myModal .modal-body #media-container .media-list").html("");
						aMarkers.forEach(function(item) {
							if (item != marker) {
								$("#myModal .modal-body #media-container .media-list").append(message(item.tweet));
							}

						});

						$('#myModal').modal({
							keyboard : false
						});

					});

				});

				//this.get('markers').pushObject(marker);
				this._idCache[id] = twt.id;
				this.get('results').pushObject(marker);
				//first marker is red
				marker.set('icon', L.AwesomeMarkers.icon({
					icon : 'icon-twitter',
					color : 'red'
				}));

			}
		}

	},
	actions : {
		changedLocation : function(newLocation) {
			this.set('location', newLocation);

		},
		locatedMe : function() {
			this.getGeoLocation();

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