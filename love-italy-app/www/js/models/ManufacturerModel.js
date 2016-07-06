define(function(require) {

	var Backbone 	= require("backbone");
	var Config		= require("config");

	var ManufacturerModel = Backbone.Model.extend({

		constructorName: "ManufacturerModel",

			initialize: function(options) {

				this.id   = options.id;
				
				try {
				
					this.name = options.name;
				
				} catch(e) {
				
					console.log("No Manufacturer name (" + e + ")");
				
				}

				this.img  = this.getImageUrl(options.id);
			},

			url: function () {

				var url = 	Config.apiUrl + "manufacturers/";
				url += 		"?io_format=JSON&ws_key=" + Config.secureKey;
				url += 		"&filter[id]=[" + this.id + "]";
				url +=		"&display=[id,name,short_description]";


				return url;

			},
			
			parse: function(data) {       

				var subData = data.manufacturers[0];
				
				// Removing HTML from fields with HTML 
				subData.description = this.stripHTML(subData.short_description);
				// Adding img url
				subData.img = this.getImageUrl(subData.id);
				
				return subData;
				
			},
			
			/** get manufacuter's image **/
			getImageUrl: function(id) {

				return Config.apiUrl + "manufacturers/" + id + "?ws_key=" + Config.secureKey;
			
			},

			stripHTML: function(html) {

				var tmp = document.createElement("DIV");
				tmp.innerHTML = html;
				return tmp.textContent || tmp.innerText || "";
				
			},

	});

	return ManufacturerModel;

});