define(function(require) {

	var Backbone	= require("backbone");
	var Config		= require("config");

	var CartModel = Backbone.Model.extend({

		constructorName: "CartModel",
		
		inCity: 		false,
		currentCity: 	"",
		haveCoords: 	false, 

		/** Create City List and calculate cart Total (also with taxes) **/
		initialize: function(options) {

			/** Cities List **/
			this.cities = [	
							'Castel Frentano',
							'Fossacesia',
							'Frisa',
							'Lanciano',
							'Mozzagrogna',
							'Ortona',
							'Rocca San Giovanni',
							'San Vito Chietino',
							'Santa Maria Imbaro',
							'Treglio'
						];

			/** Checking if Cart is defined **/
			if(window.localStorage.getItem("Cart") !== null){

				this.cart = JSON.parse(window.localStorage.getItem("Cart")).cart;
				this.totalPrice = 0;
				this.quantityCart = 0;

				for (var i = 0; i < this.cart.length; i++) {

					this.cart[i].image  = this.getImageUrl(this.cart[i].id,this.cart[i].img);
					this.totalPrice = parseFloat(this.totalPrice) + parseFloat(this.cart[i].price) * parseInt(this.cart[i].quantity);
					this.quantityCart = parseInt(this.quantityCart) + parseInt(this.cart[i].quantity);
					
				}

				this.finalPrice = this.totalPrice + 2.00;

			} else {

				console.log("Cart Error");

			}

			/** Checking if there's an address **/
			if(window.localStorage.getItem("Address") !== null) {

				var localAddress = JSON.parse(window.localStorage.getItem("Address"));

				this.address 		= localAddress.address;
				this.setCity(localAddress.city);
				this.zip 			= localAddress.cap;
				this.phone			= localAddress.phone;

			} else {
				
				try {

					localCoords = JSON.parse(window.localStorage.getItem("Coords"));

					this.latitude = localCoords.latitude;
					this.longitude = localCoords.longitude;

					this.haveCoords = true;

				} catch(e) {

					this.haveCoords = false;
					console.log("Localization unavailable");
				}

			}

		},

		url: function() {

			var url = "http://nominatim.openstreetmap.org/reverse?";
			
			url += "format=json";
			url += "&lat="+this.latitude;
			url += "&lon="+this.longitude;

			return url;			

		},

		parse: function(data) {

			var subData = data.address;

			var currentCity = subData.city;
			
			if(currentCity == undefined)
				currentCity = subData.town;
			if(currentCity == undefined)
				currentCity = subData.village;

			this.setCity(currentCity);

			return subData;

		},

		// set the city fo the customer
		setCity: function(city) {

			var currentCityIndex = this.cities.indexOf(city);

			if(currentCityIndex < 0) {
				
				this.inCity = false;

			} else {

				this.currentCity = city;
				this.cities.splice(currentCityIndex,1);
				this.inCity = true;	

			}

		},

		// submit address and save it
		submit: function(address,city,cap,phone){

			var localCustomer = JSON.parse(window.localStorage.getItem('Login'));

			var id_customer = localCustomer.id; 
		    var id_manufacturer = 0; 
		    var id_supplier = 0;
		    var id_warehouse = 0;
		    var id_country = 10;
		    var id_state = 148;
		    var alias = "indirizzo1";
		    var lastname = localCustomer.surname;
			var firstname = localCustomer.name;
		    var deleted = 0;

		    var that=this;

		    // Save address
		    $.ajax({
		        url: Config.apiUrl +"addresses/&io_format=XML&ws_key=" +Config.secureKey,
		        data:"<prestashop><address><id></id><id_customer>"+id_customer+"</id_customer><id_manufacturer>"+id_manufacturer+"</id_manufacturer><id_supplier>"+id_supplier+"</id_supplier><id_warehouse>"+id_warehouse+"</id_warehouse><id_country>"+id_country+"</id_country><id_state>"+id_state+"</id_state><alias>"+alias+"</alias><company></company><lastname>"+lastname+"</lastname><firstname>"+firstname+"</firstname><vat_number></vat_number><address1>"+address+"</address1><address2></address2><postcode>"+cap+"</postcode><city>"+city+"</city><other></other><phone></phone><phone_mobile>"+phone+"</phone_mobile><dni></dni><deleted>"+deleted+"</deleted><date_add></date_add><date_upd></date_upd></address></prestashop>",
		        type: 'POST',
		        contentType: "text/xml",
		        dataType: "text",
		        success: function(){
		        	// Get address id and save it in local storage
		        	$.ajax({
						dataType: "json",
						url: Config.apiUrl +"addresses/?ws_key=" +Config.secureKey+ "&io_format=JSON&display=[id]&filter[id_customer]="+id_customer,
						data: null,		
								  
						success: function(data,status,xhr){
						  	address_id = data.addresses[0].id;
							window.localStorage.setItem("Address",JSON.stringify({address_id:address_id,address:address,city:city,cap:cap,phone:phone}))
							that.Buy();
						},

						error: function(xhr, ajaxOptions, thrownError){
						    console.log( $(xhr.responseText).find("message").text());
						}
					});   
		        },
		        error : function (xhr, ajaxOptions, thrownError){
		            console.log( $(xhr.responseText).find("message").text() );
		        }
		    });
		},

		// make purchase
		Buy: function(){	
			var localCustomer = JSON.parse(window.localStorage.getItem('Login'));
			
			var id_customer = localCustomer.id; 
			var temp_address = JSON.parse(window.localStorage.getItem("Address"));
			var arrayP 		= new Array();
			var cart 		= JSON.parse(window.localStorage.getItem('Cart')).cart;
			var tempTotal 	= parseFloat(document.getElementById("total-price").innerHTML).toFixed(2);

			for(var i=0; i < cart.length; i++){
				arrayP[i]=new Array();
				arrayP[i][0] = cart[i].id;
				arrayP[i][1] = cart[i].quantity;
				arrayP[i][2] = cart[i].name;
				arrayP[i][3] = cart[i].price;
			}

			var str = "";
			var id_address_delivery = temp_address.address_id;
			var id_address_invoice = temp_address.address_id;
			var id_currency = 1;
			var id_lang = 1;
			var id_shop_group = 1;
			var id_shop = 0;
			var id_carrier = 0;
			var recyclable = 0;
			var gift = 0;
			var mobile_theme = 0;
			var allow_seperated_package = 0;
			var id_product_attribute = 0;
			var id_cart;

			var products = arrayP;

			for (i=0; i<products.length; i++){
				var temp = products[i][0];
				var temp1 = products[i][1];
				var str1 = "<cart_rows><id_product>"+temp+"</id_product><id_product_attribute>"+id_product_attribute+"</id_product_attribute><id_address_delivery>"+id_address_delivery+"</id_address_delivery><quantity>"+temp1+"</quantity></cart_rows>";
					str = str.concat(str1);
			 }

			 $.ajax({
					url: Config.apiUrl +'carts/&io_format=XML&ws_key=' +Config.secureKey,
					data:"<prestashop><cart><id></id><id_address_delivery>"+id_address_delivery+"</id_address_delivery><id_address_invoice>"+id_address_invoice+"</id_address_invoice><id_currency>"+id_currency+"</id_currency><id_customer>"+id_customer+"</id_customer><id_guest></id_guest><id_lang>"+id_lang+"</id_lang><id_shop_group>"+id_shop_group+"</id_shop_group><id_shop>"+id_shop+"</id_shop><id_carrier>"+id_carrier+"</id_carrier><recyclable>"+recyclable+"</recyclable><gift>"+gift+"</gift><gift_message></gift_message><mobile_theme>"+mobile_theme+"</mobile_theme><delivery_option></delivery_option><secure_key></secure_key><allow_seperated_package>"+allow_seperated_package+"</allow_seperated_package><date_add></date_add><date_upd></date_upd><associations><cart_rows>"+str+"</cart_rows></associations></cart></prestashop>",
					type: 'POST',
					contentType: "text/xml",
					dataType: "text",
					success : function(){
						var url = Config.apiUrl +"carts/&ws_key=" +Config.secureKey+"&io_format=JSON&display=[id]&filter[id_customer]="+id_customer;
					    $.getJSON(url, function(results) {

					     	var len = results.carts.length;
					        id_cart = results.carts[len-1].id;

					    if(id_cart != null){
					    	 makeOrder(id_cart);
					  	}
					     });
					 },

					 error : function (xhr, ajaxOptions, thrownError){
							 console.log(xhr.status);
							 console.log(thrownError);
					 }
			 });

			// create the order 
			function makeOrder(id_cart) {

			 	var str0="";
			    var id_carrier = 21;
			    var current_state = 12;
			    var module_tag = "cheque";
			    var invoice_number = 0;
			    var invoice_date = "";
			    var delivery_number = 0;
			    var delivery_date = "";
			    var valid = 1;
			    var shipping_number;
			    var payment = "Assegno";
			    var recyclable = 0;
			    var gift = 0;
			    var gift_message;
			    var mobile_theme = 0;
			    var total_discounts = 0.00;
			    var total_discounts_tax_incl = 0.00;
			    var total_discounts_tax_excl = 0.00;
			    var total_paid = tempTotal;
			    var total_paid_tax_incl = tempTotal;
			    var total_paid_tax_excl = tempTotal;
			    var total_paid_real = 0.00;
			    var total_products = tempTotal;
			    var total_products_wt = tempTotal;
			    var total_shipping = 0.00;
			    var total_shipping_tax_incl = 0.00;
			    var total_shipping_tax_excl = 0.00;
			    var carrier_tax_rate = 22.000;
			    var total_wrapping = 0.00;
			    var total_wrapping_tax_incl = 0.00;
			    var total_wrapping_tax_excl = 0.00;
			    var conversion_rate = 1.000000;
			    var reference ;
			    var product_reference = "";
			    var product_ean13 = "";
			    var product_upc = "";
			    var secure_key = "77963b7a931377ad4ab5ad6a9cd718aa";

			     for (i=0; i<products.length; i++){
			       var temp = products[i][0];
			       var temp1 = products[i][1];
			       var temp2 = products[i][2];
			       var temp3 = products[i][3];
			       var str1 = "<order_rows><id></id><product_id>"+temp+"</product_id><product_attribute_id>0</product_attribute_id><product_quantity>"+temp1+"</product_quantity><product_name>"+temp2+"</product_name><product_reference></product_reference><product_ean13></product_ean13><product_upc></product_upc><product_price>"+temp3+"</product_price><unit_price_tax_incl>"+temp3+"</unit_price_tax_incl><unit_price_tax_excl>"+temp3+"</unit_price_tax_excl></order_rows>";
			         str0 = str0.concat(str1);
			      }

			     $.ajax({
			         url: Config.apiUrl +"orders/&io_format=XML&ws_key=" +Config.secureKey,
			         data:"<prestashop><order><id></id><id_address_delivery>"+id_address_delivery+"</id_address_delivery><id_address_invoice>"+id_address_invoice+"</id_address_invoice><id_cart>"+id_cart+"</id_cart><id_currency>"+id_currency+"</id_currency><id_lang>"+id_lang+"</id_lang><id_customer>"+id_customer+"</id_customer><id_carrier>"+id_carrier+"</id_carrier><current_state>"+current_state+"</current_state><module>"+module_tag+"</module><invoice_number>"+invoice_number+"</invoice_number><invoice_date>"+invoice_date+"</invoice_date><delivery_number>"+delivery_number+"</delivery_number><delivery_date>"+delivery_date+"</delivery_date><valid>"+valid+"</valid><date_add></date_add><date_upd></date_upd><shipping_number></shipping_number><id_shop_group>"+id_shop_group+"</id_shop_group><id_shop>"+id_shop+"</id_shop><secure_key>"+secure_key+"</secure_key><payment>"+payment+"</payment><recyclable>"+recyclable+"</recyclable><gift>"+gift+"</gift><gift_message></gift_message><mobile_theme>"+mobile_theme+"</mobile_theme><total_discounts>"+total_discounts+"</total_discounts><total_discounts_tax_incl>"+total_discounts_tax_incl+"</total_discounts_tax_incl><total_discounts_tax_excl>"+total_discounts_tax_excl+"</total_discounts_tax_excl><total_paid>"+total_paid+"</total_paid><total_paid_tax_incl>"+total_paid_tax_incl+"</total_paid_tax_incl><total_paid_tax_excl>"+total_paid_tax_excl+"</total_paid_tax_excl><total_paid_real>"+total_paid_real+"</total_paid_real><total_products>"+total_products+"</total_products><total_products_wt>"+total_products_wt+"</total_products_wt><total_shipping>"+total_shipping+"</total_shipping><total_shipping_tax_incl>"+total_shipping_tax_incl+"</total_shipping_tax_incl><total_shipping_tax_excl>"+total_shipping_tax_excl+"</total_shipping_tax_excl><carrier_tax_rate>"+carrier_tax_rate+"</carrier_tax_rate><total_wrapping>"+total_wrapping+"</total_wrapping><total_wrapping_tax_incl>"+total_wrapping_tax_incl+"</total_wrapping_tax_incl><total_wrapping_tax_excl>"+total_wrapping_tax_excl+"</total_wrapping_tax_excl><conversion_rate>"+conversion_rate+"</conversion_rate><reference>"+reference+"</reference><associations>"+str0+"</associations></order></prestashop>",
			         type: 'POST',
			         contentType: "text/xml",
			         dataType: "text",
			         error : function (xhr, ajaxOptions, thrownError){
			             console.log($(xhr.responseText).find("message").text());
			         }
			     });

			 }	

	 	 	Materialize.toast("Acquisto effettuato con successo!",3000 );
	 	 	//erase cart after purchase
	 	 	window.localStorage.setItem('Cart',JSON.stringify({cart: []}));
	 	 	// go to home view
	 	 	window.setTimeout(function(){
				Backbone.history.navigate("home", {
					trigger: true
				});
			},500);

		},

		// get the product's images
		getImageUrl: function(pID,iID) {

			return Config.apiUrl + "images/products/" + pID + "/" + iID + "/?ws_key=" + Config.secureKey;
			
		}
		
	});

	return CartModel;

});