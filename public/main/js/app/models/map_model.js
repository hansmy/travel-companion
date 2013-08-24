/*
 * A class with LeafletMarkerMixin.
 * Example of a custom marker behavior "Highlight".
 * Every other functionality is provided by its super class.
 */
App.Twitter = Ember.Object.extend(Ember.LeafletMarkerMixin, {
	highlight : false,
	draggable : true,
	title : 'name',
	popupBinding : 'textpopup',
	// Default normal icon
	normalIcon : L.AwesomeMarkers.icon({
		icon : 'twitter',
		color : 'red'
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
