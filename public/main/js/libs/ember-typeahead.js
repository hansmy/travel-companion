( function(root, undefined) {"use strict";

		Ember.TypeAheadComponent = Ember.TextField.extend({

			didInsertElement : function() {
				this._super();
				var _this = this;

				if (!this.get("data")) {
					throw "No data property set";
				}

				if (jQuery.isFunction(this.get("data").then)) {
					this.get("data").then(function(data) {
						_this.initializeTypeahead(data);
					});
				} else {
					this.initializeTypeahead(this.get("data"));
				}

			},

			initializeTypeahead : function(data) {
				var T = {};
        //creating handlebars compile function
				T.compile = function(template) {
					var compile = Handlebars.compile(template), render = {
						render : function(ctx) {
							return compile(ctx);
						}
					};
					return render;
				};

				var _this = this;

				this.typeahead = this.$().typeahead({
					name : "typeahead",
					limit : this.get("limit") || 10,
					local : data.map(function(item) {
						console.log(item);

						return {
							value : item.get(_this.get("name")),
							name : item.get(_this.get("name")),
							tokens : [item.get(_this.get("name"))],
							emberObject : item
						};
					}),
					remote : {
						
						url : "http://nominatim.openstreetmap.org/search?format=json&q=%QUERY",
						filter : function(parsedResponse) {
							// parsedResponse is the array returned from your backend
							console.log(parsedResponse);
							var suggestions = Ember.A(parsedResponse);

							// do whatever processing you need here
							return suggestions.map(function(item) {

                //create an ember objectitem
								var objEmber = Ember.Object.create(item);
                // 

                //var regExMatch = new RegEx( '^' , displayName,'i');
                var value= objEmber.get(_this.get("name"));
                var name=value;
                var arrayWord=value.split(',');
                
								return {
									value : value,
                  name : name,
                  tokens : arrayWord,
									emberObject : objEmber
								};
							});
						}
					},
					template : '<p class="result-auto"><strong>{{value}}</strong> </p>',
					engine : T
				});

				this.typeahead.on("typeahead:selected", function(event, item) {
					console.log("selected");
					_this.set("selection", item.emberObject);
				});

				this.typeahead.on("typeahead:autocompleted", function(event, item) {
					console.log("autocompleted");
					_this.set("selection", item.emberObject);
				});

				if (this.get("selection")) {
					console.log("selection");
					this.typeahead.val(this.get("selection.name"));
				}
			},

			selectionObserver : function() {
        console.log(this.get("name"))
        console.log(this.get("selection").get(this.get("name")));
				//return this.typeahead.val(this.get("selection").get(this.get("name")));
       //('setQuery', 'value-you-want-to-set')
        return this.$().typeahead('setQuery', this.get("selection").get(this.get("name")));
			}.observes("selection"),
		

		});
		Ember.Handlebars.helper('type-ahead', Ember.TypeAheadComponent);
	}(this)); 