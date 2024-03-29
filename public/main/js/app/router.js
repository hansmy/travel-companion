/*App.Router = Ember.Router.extend({
 location : Ember.Location.create({
 implementation : 'none'
 })
 });*/

App.Router = Ember.Router.extend({

	/*location : Ember.Location.create({
	 implementation : 'none'
	 })*/
	location : 'hash'
});

App.Router.map(function() {

	this.resource('map');
	this.resource('list');
	this.route('autocomplete', {
		path : 'autocomplete/:query'
	});

});

App.AutocompleteRoute = Em.Route.extend({
	model : function() {
		return this.get('store').find('result');
		//return App.SearchResult.find({firstName:params.firstName,lastName:params.lastName,city:params.city})
	},

	setupController : function(controller, model) {

		controller.set('model', model);

	}
});

App.ApplicationRoute = Em.Route.extend({
	model : function() {
		return this.get('store').find('result');
		//return App.SearchResult.find({firstName:params.firstName,lastName:params.lastName,city:params.city})
	},
	setupController : function(controller, model) {

		controller.set('model', model);

	}

	
});

App.IndexRoute = Em.Route.extend({
	redirect : function() {
		this.transitionTo('map');
	}
});
