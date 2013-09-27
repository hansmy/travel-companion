App.TabsView = Em.View.extend({
  templateName: 'tabs',
  classNames: ['tabs']
});

App.TabView = Em.View.extend({
  classNames: ['content'],
  animateTab: function() {
   
  },

  didInsertElement: function() {
    this.animateTab();
  }
});