App.ListController = Ember.ArrayController.extend({

content:[],
contentBinding: Ember.Binding.oneWay('controllers.application.content'),
//results:  [],
needs:'application',
index:0,
statusDisplay:false,
statusDisplayBinding:'controllers.application.listDisplay',
//resultsBinding: Ember.Binding.oneWay('controllers.application.content'),
sortProperties: ['timestamp'],
isQuaque:true,
sortAscending: false,
init : function() {
  var x =this.get('content');
  var r=x.set('sortProperties',['timestamp']);
   var yy=x.set('sortAscending',false);
  },

  sortedContent: (function() {
    var content;
    content = this.get("content") || [];
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      content: content.toArray(),
      sortProperties: this.get('sortProperties'),
      sortAscending: this.get('sortAscending')
    });
  }).property("content.@each", 'sortProperties', 'sortAscending'),

  doSort: function(sortBy) {
    var previousSortBy;
    previousSortBy = this.get('sortProperties.0');
    if (sortBy === previousSortBy) {
      return this.set('sortAscending', !this.get('sortAscending'));
    } else {
      set('sortAscending', true);
      return this.set('sortProperties', [sortBy]);
    }
  },
reverse: function(){
  //property sorted content
   return this.get('sortedContent');
}.property('index','sortAscending','sortProperties').cacheable(),
  
 load: function(){
  var content=this.get('content');
 
  
  var contentLength=this.get('content.length');

  var statusDisplay=this.get('statusDisplay');
 
  var index= this.get('index');
  //more than 6 result
  if(contentLength<=6||statusDisplay){
    this.set('statusDisplay',false);

   
   this.set('index', contentLength);
 
  }
 }.observes('content.length','statusDisplay'),
 hasNewTweets: function(){
    if(this.get("queueLength") > 0 ){
      this.set("isQuaque", true);
    }
    return this.get("queueLength") > 0 ;
  }.property("queueLength"),
  
  queueLength: function(){
    return this.get("content.length") - this.get("index");

  }.property("content.[]","isQuaque"),

  actions: {
    recent: function() {
      if(this.get('sortAscending')==true){
      this.set('sortAscending', false);
      
      //  content.set('sortAscending', false);
      this.set('index',this.get('content.length'))
      }
    },

    oldest: function() {
        if(this.get('sortAscending')==false){
        //var content=this.get('content.arrangedContent');
       // content.set('sortAscending', true);
        this.set('sortAscending', true);
        this.set('index',this.get('content.length'))
      }
    },
    unqueueAll: function(){

      var results= this.get('content');
      var org=results.get('arrangedContent');
      var index= this.get('index');
      this.set('index',this.get('content.length'));
   
      this.set("isQuaque", false);

    }
  }


});