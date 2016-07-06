define(function(require) {

	var Backbone						= require("backbone");
	var Utils							= require("utils");
	var Handlebars						= require("handlebars");

	var ManufacturerModel				= require("models/ManufacturerModel");
	var ManufacturerProductsCollection	= require("collections/ManufacturerProductsCollection");

	var ManufacturerView = Utils.Page.extend({

		constructorName: "ManufacturerView",

		model: 			ManufacturerModel,
		collection : 	ManufacturerProductsCollection,

		id: "manufacturer-view",

		initialize: function() {

			/** Load precompiled template [ you have to set path into templates.js ] **/
			this.template = Utils.templates.manufacturer;

		},

		events: {  
			"click .goToProduct" 	: "goToProduct",   
			"click #info" 			: "information", 
		}, 

		render: function() {

			/** Fixing Price's Decimal Numbers to 2 **/
			Handlebars.registerHelper('renderPrice', function(text) {

				text = Handlebars.Utils.escapeExpression(text);
				var result = parseFloat(text).toFixed(2);
				return new Handlebars.SafeString(result);
			
			});

			/** Add Description to Collection **/
			this.collection.description = this.model.changed.description;

			$(this.el).html(this.template(this.collection));
			return this;
		
		},

		/** Open a Modal with Manufacturer's description **/
		information: function(e){
		
			$('#modal').openModal();

		},

		/** Go to Product Page **/
		goToProduct: function(e){
		
			var id = e.currentTarget.getAttribute('data-id');

			Backbone.history.navigate("product/" + id, {
				trigger: true
			});
		
		},
		
	});

	return ManufacturerView;

});