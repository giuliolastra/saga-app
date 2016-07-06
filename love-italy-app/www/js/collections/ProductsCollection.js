define(function(require) {

	var Backbone		= require("backbone");
	var ProductModel	= require("models/ProductModel");
	var Config			= require("config");

	var ProductsCollection = Backbone.Collection.extend({
		
		constructorName: 	"ProductsCollection",
		
		initialize: function(options) {
			
			this.limit = options.limit;

		},
			
		url: function () {
		
			var url = 	Config.apiUrl + '/products/';
			url += 		"?io_format=JSON&ws_key=" + Config.secureKey;
			url += 		"&limit=" + this.limit;
			url += 		"&display=[id,name,price,manufacturer_name,id_manufacturer,id_default_image,id_tax_rules_group]";
			url += 		"&filter[id_manufacturer]=[3,14]&filter[price]=[0.01,1000]";
			return url;
		},

		parse: function(data) {

			for(var i = 0; i < this.limit; i++) {
			
				var model = new ProductModel(JSON.stringify(data.products[i]));
				/** Taxing Product **/
				model.price = this.addTax(model.price, model.id_tax_rules_group);
				data.products[i] = model;

			}

			data.models= this.add(data.products);
			return data.models;

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

		}
		
	});

	return ProductsCollection;

});