define(function(require) {

	var Backbone 				= require("backbone");
	var Utils 					= require("utils");
	var Handlebars 				= require("handlebars");
	var SearchCollection 		= require("collections/SearchCollection");

	var SearchView = Utils.Page.extend({

		constructorName: "SearchView",

		collection: SearchCollection,

		initialize: function(options) {

			/** Load precompiled template [ you have to set path into templates.js ] **/
			this.template = Utils.templates.search;		
		},

		id: "search-view",
	
		events: {
			"click .goToProduct"      	: "goToProduct",
			"click #search-back-button"	: "goBack", 
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

		/** Go to Product Page **/
		goToProduct: function(e) {

			var id = e.currentTarget.getAttribute('data-id');

			Backbone.history.navigate("product/" + id, {
				trigger: true
			});

			document.getElementById('search').value = "";
			document.getElementById('nav-bar').style.display = "block";

		},

	});
	
	return SearchView;

});