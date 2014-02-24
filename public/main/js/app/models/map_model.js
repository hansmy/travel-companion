/*
 * A class with LeafletMarkerMixin.
 * Example of a custom marker behavior "Highlight".
 * Every other functionality is provided by its super class.
 */
App.Twitter = Ember.Object.extend(Ember.LeafletMarkerMixin, {
	highlight : false,
	draggable : false,
	title : 'name',
	popupBinding : 'textpopup',
	// Default normal icon
	normalIcon : L.AwesomeMarkers.icon({
		icon : 'icon-twitter',
		color : 'blue'
	}),
	// Default highlight icon
	highlightIcon : L.AwesomeMarkers.icon({
		icon : 'flag',
		color : 'red'
	}),
	highlightDidChange : function() {
		var marker = this.get('marker');
		var highlight = this.get('highlight');
		var map = this.get('map');

		if (!marker)
			return;

		if (highlight) {
			this.set('icon', this.get('highlightIcon'));
			map.setView(marker.getLatLng(), 14);
		} else {
			this.set('icon', this.get('normalIcon'));
		}
	}.observes('highlight', 'marker', 'map'),

	format : function() {
		var str = "<span><img style='float: left' src='" + twt.user.profile_image_url_https + "' />" + "<b>" + twt.user.screen_name + "</b><br/><a href ='http://twitter.com/" + twt.user.screen_name + "'>@" + twt.user.screen_name + "</a><br/> " + "</span>" + "<p>" + twt.text + "</p>"
		return str;
	}
});

App.Pipe = Ember.Object.extend(Ember.LeafletPolylineMixin, {
	popupBinding : 'label'
});
App.Valve = Ember.Object.extend(Ember.LeafletCircleMixin, {
	popupBinding : 'label',
	color : 'yellow',
	opacity : 0.8
});

App.Autocomplete = DS.Model.extend({
	first_name : DS.attr('string'),
	last_name : DS.attr('string'),
	email : DS.attr('string'),
	password : DS.attr('string')
});

App.Result = DS.Model.extend(Ember.LeafletMarkerMixin, {

	user : DS.attr(),
	text : DS.attr(),
	lat : DS.attr(),
	lng : DS.attr(),
	tweet : DS.attr(),
	timestamp: DS.attr(),
	highlight : false,
	draggable : false,

	title : 'name',
	getTime: function(){
		return this.get('tweet').created_at;
	}.property('timestamp'),
	// Default normal icon
	normalIcon : L.AwesomeMarkers.icon({
		icon : 'icon-twitter',
		color : 'blue'
	}),
	// Default highlight icon
	highlightIcon : L.AwesomeMarkers.icon({
		icon : 'flag',
		color : 'red'
	}),
	location : function() {
		return {
			lat : this.get('lat'),
			lng : this.get('lng')
		};
	}.property('lat', 'lng'),
	popupText : function() {

		return this.messagePopup();
	}.property('text'),

	highlightDidChange : function() {
		var marker = this.get('marker');
		var highlight = this.get('highlight');
		var map = this.get('map');

		if (!marker)
			return;

		if (highlight) {
			this.set('icon', this.get('highlightIcon'));
			map.setView(marker.getLatLng(), 14);
		} else {
			this.set('icon', this.get('normalIcon'));
		}
	}.observes('highlight', 'marker', 'map'),

	format : function() {
		var str = "<span><img style='float: left' src='" + twt.user.profile_image_url_https + "' />" + "<b>" + twt.user.screen_name + "</b><br/><a href ='http://twitter.com/" + twt.user.screen_name + "'>@" + twt.user.screen_name + "</a><br/> " + "</span>" + "<p>" + twt.text + "</p>"
		return str;
	},
	messagePopup : function() {
		var tweet = this.get('tweet');
		var addLinksTwitter = function(text) {
			return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
				var link="<a href='"+url+"' target='_blank'>"+url+"</a>";
				return link;
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
		str += "' target='_blank' />" + "<b>" + tweet.user.screen_name + "</b><br/><a href ='http://twitter.com/";
		str += tweet.user.screen_name + "' target='_blank'>@" + tweet.user.screen_name + "</a><br/> " + "</span>";
		str += "<p>" + addHashTags(addLinksTwitter(tweet.text)) + "</p>";
		str += " <li class='media tweet'>";
		str = "<div class='row' ><div class='span3' >"
		str += "<a class='pull-left' href='http://twitter.com/" + tweet.user.screen_name + "' target='_blank'>";
		str += "<img class='media-object' src='" + tweet.user.profile_image_url_https + "' >";
		str += "</a>" + "<div class='media-body'>";
		str += "<table class='' ><tr><td>";
		str += "<strong> " + tweet.user.name + "</strong> " + "<a href ='http://twitter.com/";
		str += tweet.user.screen_name + "' target='_blank'>@" + tweet.user.screen_name + "</a>" + "</td><td>";
		str += "<span class='timestamp '><a class='date_created' href ='http://twitter.com/" + tweet.user.screen_name + "'> <p class='muted'>" + timestamp + "</p></a></span> </td></tr><tr><td>";
		str += "<p id='text-popup'>" + addHashTags(addLinksTwitter(tweet.text)) + "</p>";
		str += "</tr></td></table>"
		str += "</div>";
		str += "</div>"
		str += "<span class='pull-right'><a class='openModal' href='#/list/'> List</a></span>";

		str += "</div>"
		//closing the media-body
		str += "</li>"
		return str;
	}
});

