$('body').tooltip({
	selector : 'a[rel="tooltip"], [data-toggle="tooltip"]'
});

Ember.TextSupport.reopen({
	attributeBindings : ['data-toggle', 'title'],
	didInsertElement : function() {
		this.$().tooltip();
	}
})
Ember.Application.reopen({
	init : function() {
		this._super();

		this.loadTemplates();
	},

	templates : [],

	loadTemplates : function() {
		var app = this, templates = this.get('templates');

		app.deferReadiness();

		var promises = templates.map(function(name) {
			return Ember.$.get('js/app/templates/' + name + '.hbs').then(function(data) {
				Ember.TEMPLATES[name] = Ember.Handlebars.compile(data);
			});
		});

		Ember.RSVP.all(promises).then(function() {
			app.advanceReadiness();
		});
	}
});
App = Ember.Application.create({
	rootElement : "#application",
	LOG_BINDINGS : true,
	LOG_TRANSITIONS : true,
	templates : ['application', 'map', 'list', 'tabs', 'tweet', 'autocomplete'],
	Socket : EmberSockets.extend({
		host : window.location.hostname,
		port : window.location.port,
		controllers : ['application']
	})
	
});
/* Ember Data */
App.Store = DS.Store.extend({
	adapter : "App.Adapter"
});

App.Adapter = DS.RESTAdapter.extend({
	bulkCommit : false
});

DS.RESTAdapter.reopen({
	//host : "http://localhost:3000",
	host : "http://ambiecities.herokuapp.com",
	namespace : "api"
});
/*App.store = DS.Store.create({
,
revision : 11
});*/

//Model
//App.Tweet = Em.Object.extend();
