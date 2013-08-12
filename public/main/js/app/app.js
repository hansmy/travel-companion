$('body').tooltip({
	selector : 'a[rel="tooltip"], [data-toggle="tooltip"]'
});

Ember.TextSupport.reopen({
	attributeBindings : ['data-toggle', 'title'],
	didInsertElement : function() {
		this.$().tooltip();
	}
})

App = Ember.Application.create({
	rootElement : "#application",
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
