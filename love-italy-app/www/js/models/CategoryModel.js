define(function(require) {

	var Backbone 	= require("backbone");
	var Config		= require("config");

	var CategoryModel = Backbone.Model.extend({
		
		constructorName: "CategoryModel",

			initialize: function(options) {

				this.id = options.id;
				this.name = options.name;
			
			},

			url: function () {

				var url = 	Config.apiUrl + "categories/";
				url += 		this.id;
				url += 		"?io_format=JSON";
				url +=		"&ws_key=" + Config.secureKey;

				return url;
			
			},

			parse: function(data) {

				return data.category;
			
			},

	});

	return CategoryModel;

});

