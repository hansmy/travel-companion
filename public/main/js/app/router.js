/*App.Router = Ember.Router.extend({
    location : Ember.Location.create({
        implementation : 'none'
    })
});*/

App.Router = Ember.Router.extend({
	
  	
    location : Ember.Location.create({
        implementation : 'none'
    })
	/*location : 'hash'*/
});

App.Router.map(function() {
  this.route('index', { path: '/' });
  this.route('map');
  this.route('list');
    
});


App.ApplicationRoute = Em.Route.extend({
  events: {
    goToMap: function() {
      this.transitionTo('map');
    },
    goToList: function() {
      this.transitionTo('list');
    }
  }
});

App.IndexRoute = Em.Route.extend({
  redirect: function() {
    this.transitionTo('map');
  }
});