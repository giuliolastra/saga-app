define(function(require) {

	var Backbone		= require("backbone");
	var ProductModel	= require("models/ProductModel");
	var Config			= require("config");

	var ProductsSearch = Backbone.Collection.extend({

		constructorName: 	"ProductsSearch",

		valid : false,

		initialize: function(options) {

			this.limit = options.limit;
			this.query = options.query;

		},

		url: function () {

			var url = 	Config.apiUrl + "search/";
			url += 		"?io_format=JSON&ws_key=" + Config.secureKey;
			url += 		"&language=1";
			url += 		"&query=" + this.query;
			url += 		"&limit=" + this.limit;
			url += 		"&filter[price]=[0.01,1000]";
			url += 		"&display=full";

			return url;
			
		},

		parse: function(data){

			try{
				
				for(var i = 0; i < data.products.length; i++) {
					var model = new ProductModel(JSON.stringify(data.products[i]));
					model.price = this.addTax(model.price, model.id_tax_rules_group);
					data.products[i] = model;
				}
				
				this.valid=true;
			
			} catch(e) {

				this.valid = false;
				console.log('Prodotto non presente.');			

			}

			data.models = this.add(data.products);
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

	return ProductsSearch;

});
