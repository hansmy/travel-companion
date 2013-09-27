App.ApplicationView = Ember.View.extend({
	templateName: 'application',
     didInsertElement : function() {
        $('body').tooltip({
            selector : 'a[rel="tooltip"], [data-toggle="tooltip"]'
        });
    }
});