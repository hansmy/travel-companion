App.AutocompleteController = Ember.ArrayController.extend({
	searchText : null,
	content : [],
	init : function() {
		this.set('content', [Ember.Object.create({
			display_name : "Red"
		}), Ember.Object.create({
			display_name : "Green"
		}), Ember.Object.create({
			display_name : "Blue"
		})]);
	}/*,
	 actions:{
	 changedLocation:function(newLocation){
	 console.log("Change Location Autocomplete");
	 this.set('newLocation',newLocation);
	 }
	 }
	 /*,

	 searchResults: function() {

	 var searchText = this.get('searchText');
	 if (!searchText) { return; }

	 var model=this.get('model');
	 var regExp = new RegExp(searchText, 'i');

	 /*this.set('content',this.store.filter('autocomplete',function(item){
	 var name= item.get('first_name');
	 var response=regExp.test(name);
	 return response;
	 }));
	 this.set('content',	this.store.find("autocomplete")	);

	 }.observes('searchText')
	 //  }.property('searchText')
	 */

});
//('model.@each.color', 'daFilter')