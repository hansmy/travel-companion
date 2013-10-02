App.ListController = Ember.ArrayController.extend({
content: [],
needs:'application',
contentBinding: 'controllers.application.results',
sortProperties: ['timestamp'],
sortAscending: false,
reverse: function(){
        return this.get('content').toArray().reverse();
    }.property('content.@each').cacheable()


});