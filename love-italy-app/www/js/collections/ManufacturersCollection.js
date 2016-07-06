define(function(require) {

	var Backbone 			= require("backbone");
	var Config				= require("config");
	var ManufacturerModel	= require("models/ManufacturerModel");

	var ManufacturersCollection = Backbone.Collection.extend({
		
		constructorName: 	"ManufacturersCollection",
		
		initialize: function(options) {

		},
			
		url: function () {

			var url = 	Config.apiUrl + "manufacturers/";
			url += 		"?io_format=JSON";
			url += 		"&ws_key=" + Config.secureKey;
			url += 		"&display=[id,name]&sort=[name_ASC]";
			return url;
			
		},

		parse: function(data) {

			for(var i = 0; i < data.manufacturers.length; i++) {
				if(data.manufacturers[i].id == 13){
					var model= new ManufacturerModel(data.manufacturers[i+1]);
					data.manufacturers[i]=model;
					continue;
				}
				var model = new ManufacturerModel(data.manufacturers[i]);
				data.manufacturers[i] = model;
			}

			data.models = this.add(data.manufacturers);
			return data.models;
			
		},

	});

	return ManufacturersCollection;

});