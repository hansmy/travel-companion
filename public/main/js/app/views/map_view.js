/*App.IndexView = Ember.View.extend({
    didInsertElement : function() {
        $('body').tooltip({
            selector : 'a[rel="tooltip"], [data-toggle="tooltip"]'
        });
    }
    
    
});*/

App.MapView = App.TabView.extend({
  templateName: 'map'
});
