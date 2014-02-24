App.ListController = Ember.ArrayController.extend({
content: Ember.ArrayProxy.create({ content: Ember.A([]) }),
results:  [],
needs:'application',

resultsBinding: 'controllers.application.content',
sortProperties: ['timestamp'],
isQuaque:true,
sortAscending: false,
reverse: function(){
        return this.get('content').toArray().reverse();
    }.property('content.@each').cacheable(),
  
 validateSize: function(){
 	var results=this.get('results');
 	var content= this.get('content.length');
 	console.log(content);
 	if(content<=6){
 		var content=this.get('content');
 		content.clear();
 		results.forEach(function(item, index) {
  			content.pushObject(item)
		});
    	this.set("content", content);
 	}
 }.observes('results.length'),
 hasNewTweets: function(){
    if(this.get("queueLength") > 0 ){
      this.set("isQuaque", true);
    }
    return this.get("queueLength") > 0 ;
  }.property("queueLength"),
  
  queueLength: function(){
    return this.get("results.length") - this.get("content.length");
  }.property("results.[]","isQuaque"),

  actions: {
    recent: function() {
      if(this.get('sortAscending')==true)
      this.set('sortAscending', false);
    },

    oldest: function() {
    	  if(this.get('sortAscending')==false)
      this.set('sortAscending', true);
    },
    unqueueAll: function(){
    	var content=this.get('content');
    	var results= this.get('results');
    	results=results.slice(0,this.get("results.length"));
    	content.clear();
    	results.forEach(function(item, index) {
  			content.pushObject(item)
		});
    	this.set("content", results);
      this.set("isQuaque", false);

    }
  }


});