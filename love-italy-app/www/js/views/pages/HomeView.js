define(function(require) {

	var Backbone			= require("backbone");
	var Utils				= require("utils");
	var Handlebars			= require("handlebars");
	var ProductsCollection	= require("collections/ProductsCollection");

	var HomeView = Utils.Page.extend({

		constructorName: "HomeView",

		collection: ProductsCollection,

		id: "home-view",
	
		events: {
			"click .goToProduct"	: "goToProduct",
			"click #goToCart"		: "goToCart",
			"click .addToCart"		: "addToCart",
		},

		initialize: function(options) {
			
			/** Load the precompiled template **/
			this.template = Utils.templates.home;
			this.on("inTheDOM", this.rendered);

		},

		render: function() {

			/** Fixing Price's Decimal Numbers to 2 **/
			Handlebars.registerHelper('renderPrice', function(text) {
	
				text = Handlebars.Utils.escapeExpression(text);
				var result = parseFloat(text).toFixed(2);
				return new Handlebars.SafeString(result);
				
			});

			/** Calculate division module **/
			Handlebars.registerHelper("mod", function(number,divider) {

				if(parseInt(number) % (divider) === 0) {
					return true;
				} else {
					return false
				}
		
			});

			/** Suffling Models **/
			Handlebars.registerHelper('shuffleModels', function(models) {

				var j, x, i;

			    for (i = models.length; i; i -= 1) {

			        j = Math.floor(Math.random() * i);
			        x = models[i - 1];
			        models[i - 1] = models[j];
			        models[j] = x;
			    }

			    return models;		
			});

			$(this.el).html(this.template(this.collection));
			return this;

		},

		rendered: function() {

			try {
				/** Initialize Materialize's stuffs **/
				$('ul.tabs').tabs();
			} catch(e) {
				/** Materialize sometimes is loaded later than Home View **/
				console.info("Materialize was loaded after HomeView rendering.");
			}
		
		},
	
		/** Go to product page **/
		goToProduct: function(e) {

			var id = e.currentTarget.getAttribute('data-id');

			Backbone.history.navigate("product/" + id, {
				trigger: true
			});

		},

		/** Go to cart view **/
		goToCart: function(e) {

			Backbone.history.navigate("cart", {
				trigger: true
			
			});

		},

		/** Add Product to Cart **/
		addToCart: function(e){

			var id    	 	= e.currentTarget.getAttribute('data-id');
			var name  	 	= e.currentTarget.getAttribute('data-name');
			var price  	 	= e.currentTarget.getAttribute('data-price');
			var img		 	= e.currentTarget.getAttribute('data-img');
			var quantity 	= 1;

			/** Get Cart from Local Storage **/
			var myCart = JSON.parse(window.localStorage.getItem('Cart')).cart;

			var newProduct = true;

			for(var i = 0; i < myCart.length && newProduct; i++) {

				if(myCart[i].id == id) {
					myCart[i].quantity = myCart[i].quantity + 1;
					newProduct = !newProduct;
				}

			}

			if(newProduct) {
				/** Add element at the end of Cart Array **/
				myCart = myCart.concat({'id': id, 'name': name, 'price': price, 'quantity': quantity, 'img':img});
			}

			/** Array to JSON **/
			var myJsonCart = JSON.stringify(myCart); 

			/** Save cart in Local Storage**/
			window.localStorage.setItem('Cart', '{"cart":' + myJsonCart + '}');

			/** Toast **/
			Materialize.toast(name + ' aggiunto/a al carrello!', 2000);
			
		},

	});

	return HomeView;

});