define(function(require) {

	var Backbone		= require("backbone");
	var Utils			= require("utils");
	var Handlebars		= require("handlebars");
	var ProductModel	= require("models/ProductModel");

	var ProductView = Utils.Page.extend({

		constructorName: "ProductView",

		model: ProductModel,

		id: "product-view",
		
		initialize: function() {

			/** Load precompiled template [ you have to set path into templates.js ] **/
			this.template = Utils.templates.product;
			this.on("inTheDOM", this.rendered);

		},
	
		events: {      
			"click #addToCart"		: "addToCart",
			"click #goToManu"		: "goToManufacturer",
		}, 
		
		render: function() {

			/** Fixing Price's Decimal Numbers to 2 **/
			Handlebars.registerHelper('renderPrice', function(text) {
	
				text = Handlebars.Utils.escapeExpression(text);
				var result = parseFloat(text).toFixed(2);
				return new Handlebars.SafeString(result);
				
			});

			$(this.el).html(this.template(this.model.toJSON()));
			return this;

		},

		rendered: function() {

			/** Initialize Materialize's stuffs **/
			$('.collapsible').collapsible(
				{accordion : true}
			);

			/** Product Quantity Manager **/
			$('.price-box .quantity .fa-plus').click(function() {
				$('.price-box .quantity #quantity').text(parseInt($('.price-box .quantity #quantity').text()) + 1);
			});
			
			$('.price-box .quantity .fa-minus').click(function() {
				if(parseInt($('.price-box .quantity #quantity').text()) > 1)
					$('.price-box .quantity #quantity').text(parseInt($('.price-box .quantity #quantity').text()) - 1);
			});

		},

		/** go to manufacturer's view **/
		goToManufacturer : function(e){

			var id		= e.currentTarget.getAttribute('data-id');
			var name	= e.currentTarget.getAttribute('data-name');

			Backbone.history.navigate("manufacturer/" + id + "/" + name, {
				trigger: true
			});

		},

		/** Add Product to Cart **/
		addToCart: function(e){

			var id			= e.currentTarget.getAttribute('data-id');
			var name		= e.currentTarget.getAttribute('data-name');
			var price		= e.currentTarget.getAttribute('data-price');
			var img			= e.currentTarget.getAttribute('data-img');
			var quantity	= parseInt(document.getElementById('quantity').innerHTML);
			
			/** Get Cart from Local Storage **/
			var myCart = JSON.parse(window.localStorage.getItem('Cart')).cart;

			var newProduct = true;

			for(var i = 0; i < myCart.length && newProduct; i++) {

				if(myCart[i].id == id) {
					myCart[i].quantity = myCart[i].quantity + quantity;
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

	return ProductView;

});