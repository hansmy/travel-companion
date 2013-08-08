$('body').tooltip({
    selector : 'a[rel="tooltip"], [data-toggle="tooltip"]'
});

Ember.TextSupport.reopen({
  attributeBindings: ['data-toggle','title'],
  didInsertElement:function(){
      this.$().tooltip();
  }
})

App = Ember.Application.create({
    rootElement : "#application"
});
