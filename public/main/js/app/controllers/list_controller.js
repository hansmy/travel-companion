App.ListController = Ember.ArrayController.extend({
content: [],
needs:'application',
contentBinding: 'controllers.application.results',
sortProperties: ['timestamp'],
sortAscending: false,
reverse: function(){
        return this.get('content').toArray().reverse();
    }.property('content.@each').cacheable(),
  isExpanded: false,

  actions: {
    recent: function() {
      if(this.get('sortAscending')==true)
      this.set('sortAscending', false);
    },

    oldest: function() {
    	  if(this.get('sortAscending')==false)
      this.set('sortAscending', true);
    }
  }


});