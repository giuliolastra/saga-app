define(function(require) {

	var Backbone 		= require("backbone");
	var ProductModel	= require("models/ProductModel");
	var Config			= require("config");

	var CategoryProductsCollection = Backbone.Collection.extend({
		
		constructorName: 	"CategoryProductsCollection",
		valid: 				false, 
		
		initialize: function(options) {

			this.id = options.id;
			this.catImg = this.getImageUrl(this.id);
		},

		getImageUrl: function(id) {
			
			var imageUrl = Config.apiUrl + "images/categories/" + id + "/?ws_key=" + Config.secureKey; 
			return imageUrl;

		},
			
		url: function () {
		
			var	url = Config.apiUrl + "products/"; 
			url += 	  "?io_format=JSON&ws_key=" + Config.secureKey;
			url += 	  "&display=[id,name,price,id_category_default,id_default_image,id_tax_rules_group]";
			url += 	  "&filter[price]=[0.01,1000]&filter[id_category_default]=" + this.id;
			return url;

		},

		parse: function(data) {

			try {

				for(var i = 0; i < data.products.length; i++) {
				
					var model = new ProductModel(JSON.stringify(data.products[i]));
					/** Taxing Product **/
					model.price = this.addTax(model.price, model.id_tax_rules_group);
					data.products[i] = model;

					this.valid = true;

				}
				
			} catch(e) {

				this.valid = false; 
				console.log("Nessun prodotto per questa categoria");

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

	return CategoryProductsCollection;

});