define(function(require) {

	var Backbone					= require("backbone");
	var Utils						= require("utils");
	var Handlebars					= require("handlebars");
	var CategoryProductsCollection	= require("collections/CategoryProductsCollection");

	var CategoryView = Utils.Page.extend({

		constructorName: "CategoryView",

		collection : CategoryProductsCollection,

		id: "category-view",

		initialize: function() {		

			this.template = Utils.templates.category;
		
		},

		events: {  
			"click .goToProduct": "goToProduct",    
		}, 

		render: function() {

			/** Fixing Price's Decimal Numbers to 2 **/
			Handlebars.registerHelper('renderPrice', function(text) {

				text = Handlebars.Utils.escapeExpression(text);
				var result = parseFloat(text).toFixed(2);
				return new Handlebars.SafeString(result);
			
			});

			$(this.el).html(this.template(this.collection));
			return this;
		},

		/** go to product page **/
		goToProduct: function(e) {
		
			var id = e.currentTarget.getAttribute('data-id');

			Backbone.history.navigate("product/" + id, {
				trigger : true
			});
		
		},
		
	});

	return CategoryView;

});