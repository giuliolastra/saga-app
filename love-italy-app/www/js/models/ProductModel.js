define(function(require) {

	var Backbone	= require("backbone");
	var Config		= require("config");

	var ProductModel = Backbone.Model.extend({

		constructorName: "ProductModel",

			initialize: function(options) {

				options 				= JSON.parse(options);

				this.id 				= options.id;
				this.name 				= options.name; 
				this.price				= options.price;
				this.manufacturer_name  = options.manufacturer_name;
				this.manufacturer_id  	= options.id_manufacturer;
				this.id_tax_rules_group = options.id_tax_rules_group;
				this.image_id			= options.id_default_image;

				this.img 				= this.getImageUrl(options.id,options.id_default_image);
			},

			url: function () {

				var url = 	Config.apiUrl + "products/";
				url += 		this.id;
				url += 		"?io_format=JSON&ws_key=" + Config.secureKey;

				return url;
			
			},

			parse: function(data) {				

				var subData = data.product;
				// Removing HTML from fields with HTML 
				subData.description = this.stripHTML(subData.description);
				// Adding Tax to product
				subData.price = this.addTax(subData.price, subData.id_tax_rules_group);

				// Adding img url and img id
				subData.image_id 	= subData.associations.images[0].id;
				subData.img 		= this.getImageUrl(this.id, subData.associations.images[0].id);
				
				return subData;

			},
			
			/** get product's image **/
			getImageUrl: function(pID,iID) {
				return Config.apiUrl + "images/products/" + pID + "/" + iID + "/?ws_key=" + Config.secureKey;
			},

			/** Calculate Taxes from prestashop TaxID **/
			addTax: function(price, taxID) {

				switch(parseInt(taxID)) {
					case 1:
						price = parseFloat(price) + (parseFloat(price) * 22/100);
						break;
					case 2:
						price = parseFloat(price) + (parseFloat(price) * 10/100);
						break;
					case 3:
						price = parseFloat(price) + (parseFloat(price) * 4/100);
						break;
					case 4:
						price = parseFloat(price) + (parseFloat(price) * 4/100);
						break;
					case 5:
						price = parseFloat(price) + (parseFloat(price) * 4/100);
						break;
					default:
						price = parseFloat(price) + (parseFloat(price) * 22/100);
						break;
				}

				return price;
			
			},

			stripHTML: function(html) {
				var tmp = document.createElement("DIV");
				tmp.innerHTML = html;
				return tmp.textContent || tmp.innerText || "";
			},
	});

	return ProductModel;

});
