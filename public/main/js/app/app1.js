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
    init: function() {
        this._super();

        this.loadTemplates();
    },

    templates: [],

    loadTemplates: function() {
        var app = this,
            templates = this.get('templates');

        app.deferReadiness();

        var promises = templates.map(function(name) {
            return Ember.$.get('js/app/templates/'+name+'.hbs').then(function(data) {
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
	LOG_TRANSITIONS: true,
    templates: ['index'],
	ready : function() {
		var socket = io.connect();
		var controller;
		socket.on('tweet', function(json) {
			if (json.geo) {
				var index=App.__container__.lookup('controller:index');
				index.addTweet(json);
			}

		});

	}
});

/*App.store = DS.Store.create({
	adapter : "DS.RESTAdapter",
	revision : 11
});*/

//Model
//App.Tweet = Em.Object.extend();
