define(function(require) {

	var Backbone = require("backbone");

	var StructureCollection = Backbone.Collection.extend({
		
		constructorName: "StructureCollection",

		initialize: function(options){

			/** Categories and Manufacturers Collections **/
			this.categories = options.categories;
			this.manufacturers = options.manufacturers; 
		
			/** Account Email **/
			try {
				
				this.accountEmail = JSON.parse(window.localStorage.getItem('Login')).email;

			} catch(e) {
				
				this.accountEmail = "Benvenuto!";
				console.log('Not Logged');
			
			}

		},
		
	});

	return StructureCollection;
	
});