Ember.Handlebars.registerHelper('echo',
function(propertyName, options) {
    return Ember.getPath(options.contexts[0], propertyName);
});