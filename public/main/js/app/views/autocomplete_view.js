App.AutocompleteView = Ember.View.extend({
	templateName: 'autocomplete'
	,
	didInsertElement: function() {
		var T = {};
    T.compile = function (template) {
        var compile = Handlebars.compile(template),
            render = {
                render: function (ctx) {
                    return compile(ctx);
                }
            };
        return render;
    }
		var subjects = ['PHP', 'MySQL', 'SQL', 'PostgreSQL', 'HTML', 'CSS', 'HTML5', 'CSS3', 'JSON'];   
		this.$('.typeahead').typeahead({
			name: 'accounts', 
			local: ['timtrueman', 'JakeHarding','JakeHarding1','JakeHarding1','vskarich'],
			template:'{{value}}',
			engine: T
		}) ;
	}
});