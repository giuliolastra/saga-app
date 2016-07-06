define(function(require) {

	var Backbone    =  require("backbone");
	var Utils       =  require("utils");
	var Handlebars  =  require("handlebars");
	var CartModel   =  require("models/CartModel");

	var CartView = Utils.Page.extend({
 
		constructorName: "CartView",

		model: CartModel,
		id: 'cart',

		initialize: function() {

			/** Load precompiled template [ you have to set path into templates.js ] **/
			this.template = Utils.templates.cart;
			this.on("inTheDOM", this.rendered);

		},

		events: {  
			"click #buy"      		: "Confirm",
			"click .modal-trigger"	: "openModal", 
			'click #submitAddress'	: 'submit',
			'click #trash'			: 'trash',
		},
		
		render: function() {

			/** Fixing Price's Decimal Numbers to 2 **/
			Handlebars.registerHelper('renderPrice', function(text) {
	
				text = Handlebars.Utils.escapeExpression(text);
				var result = parseFloat(text).toFixed(2);
				return new Handlebars.SafeString(result);
				
			});

			$(this.el).html(this.template(this.model));
			return this;

		},

		rendered: function() {

			var that = this;
			
			/** Initialize Materialize's collapsible **/
			$('.collapsible').collapsible({accordion : false});

			/** Manage product's quantity increasing **/
			$('.quantity-manager .fa-plus').click(function() {

				var newQuantity = parseInt($(this).parent().find('.edited-quantity').text()) + 1;

				/** Change Quantity in DOM **/
				$(this).parent().find('.edited-quantity').text(newQuantity);
				$(this).parentsUntil('.collapsible').find('.quantity h5').text(newQuantity);
					
				/** Edit Local Storage Cart **/
				var newPrice = that.editCart();

				/** Change Total Price in DOM **/
				$("#total-price").text(newPrice);
				that.editTotalPrice(newPrice);

			});
			
			/** Manage product's quantity decreasing **/
			$('.quantity-manager .fa-minus').click(function() {
					
				/** Decrease quantity only if is greater than 1 **/
				if(parseInt($(this).parent().find('.edited-quantity').text()) > 1)
					var newQuantity = parseInt($(this).parent().find('.edited-quantity').text()) - 1;

				/** Change Quantity in DOM **/
				$(this).parent().find('.edited-quantity').text(newQuantity);
				$(this).parentsUntil('.collapsible').find('.quantity h5').text(newQuantity);
				
				/** Change Total Price in DOM **/
				var newPrice = that.editCart();
				that.editTotalPrice(newPrice);
				
			});

			/** Remove element from Cart **/
			$('.remove-element').click(function() {

				var removedID = $(this).parentsUntil('.collapsible').find('.collapsible-header').attr('data-id');
				
				$(this).parentsUntil('.collapsible').fadeOut(400, function() {
					$(this).detach();

					/** Change Total Price in DOM **/
					var newPrice = that.editCart();
					that.editTotalPrice(newPrice);

				});

				/** Update Cart [remove element] **/
				var myOldCart = JSON.parse(window.localStorage.getItem('Cart')).cart;
				var myNewCart = JSON.parse("[]");

				for(var i = 0; i < myOldCart.length; i++) {

					if(myOldCart[i].id == removedID) {
						
						continue;
						
					} else {
						
						myNewCart = myNewCart.concat({
							'id'		: myOldCart[i].id,
							'name'		: myOldCart[i].name,
							'price'		: myOldCart[i].price,
							'quantity'	: myOldCart[i].quantity,
							'img'		: myOldCart[i].img
						});

					}
					
				}

				/** Array to JSON **/
				var myJsonCart = JSON.stringify(myNewCart); 

				/** Save cart in Local Storage**/
				window.localStorage.setItem('Cart', '{"cart":' + myJsonCart + '}');

			});

		},

		/** Editing Local Storage Cart **/
		editCart: function() {
			
			var total = parseFloat(0);
			var myCart = JSON.parse("[]");

			$('#cart ul.collapsible li .collapsible-header').each(function(){
			
				var elementID 		= $(this).attr('data-id');
				var elementName		= $(this).find('.product .truncate').text();
				var elementPrice 	= parseFloat($(this).find('.price-value').text());
				var elementQuantity = parseFloat($(this).find('.quantity h5').text());
				var elementImageID	= $(this).attr('data-img');
						
				total = total + elementQuantity*elementPrice;

				myCart = myCart.concat({
					'id'		: elementID,
					'name'		: elementName,
					'price'		: elementPrice,
					'quantity'	: elementQuantity,
					'img'		: elementImageID
				});

			});

			/** Array to JSON **/
			var myJsonCart = JSON.stringify(myCart); 

			/** Save cart in Local Storage**/
			window.localStorage.setItem('Cart', '{"cart":' + myJsonCart + '}');

			/** Return Total **/
			return total.toFixed(2);
			
		},

		/** Change Total Price in DOM **/
		editTotalPrice: function(newPrice) {

			$("#total-price").text(newPrice);
			$("#modal .total-price").text(newPrice);
			$("#modal .final-price").text(parseFloat(parseFloat(newPrice) + parseFloat(2.00)).toFixed(2));
		
		},

		/** go to HomeView after erasing cart **/
		trash: function() {

			var localCart = JSON.parse(window.localStorage.getItem('Cart'));

			if(localCart.cart.length == 0) {
	
				window.setTimeout(function() {
					Backbone.history.navigate("home", {
						trigger: true
					});
				}, 500);

			}			
	
		},

		/** Open Address modal **/
		openModal: function() {

			$('#modal').openModal();
		
		},
	
		/** Confirm Purchase **/
		Confirm: function() {

			var tempAddress = JSON.parse(window.localStorage.getItem("Address"));

			if(tempAddress == null) {
			 	
			 	Materialize.toast("Inserisci l'indirizzo prima di procedere con l'acquisto.", 3500);
				$('select').material_select();
				$('#address-modal').openModal();
			
			} else {

				this.model.Buy();
			
			}	
		
		},

		/** Submit Address **/
		submit: function(){

			var address 	= document.getElementById("address").value;
			var cityElement = document.getElementById("city");
			var city 		= cityElement.options[cityElement.selectedIndex].text;
			var cap 		= document.getElementById("zip").value;
			var phone 		= document.getElementById("phone").value;

			this.model.submit(address, city, cap, phone);

		},

	});

	return CartView;

});