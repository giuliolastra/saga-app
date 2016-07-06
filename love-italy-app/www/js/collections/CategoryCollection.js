define(function(require) {

	var Backbone		= require("backbone");
	var Config			= require("config");
	var CategoryModel	= require("models/CategoryModel");

	var CategoryCollection = Backbone.Collection.extend({
		
		constructorName: 	"CategoryCollection",
		
		initialize: function(options) {

		},

		url: function () {	

			var url = 	Config.apiUrl + "categories/";
			url += 		"?io_format=JSON";
			url += 		"&ws_key=" + Config.secureKey;
			url += 		"&display=[id,name]";
			url +=		"&filter[id]=[12,30]&sort=[name_ASC]";
			return url;
		
		},

		parse: function(data) {

			for(var i = 0; i < data.categories.length; i++) {
				var model = new CategoryModel(data.categories[i]);
				data.categories[i] = model;
			}

			data.models = this.add(data.categories);
			return data.models;
		
		}

	});

	return CategoryCollection;

});