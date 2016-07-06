define(function(require) {

	var Backbone = require("backbone");
	var Utils = require("utils");
	var SettingsModel = require("models/SettingsModel");

	var SettingsView = Utils.Page.extend({

		constructorName: 	"SettingsView",

		id: 		"settings-view",
		model: 		 SettingsModel,

		events: {
			'click #address-tab'    	: 'address',
			'click #submitAddress'		: 'submitAddress',
			'click #erase-cart-tab' 	: 'eraseCart',
			'click #notify'			    : 'notify',
			'click #newsletter'			: 'newsletter',
			'click #confirm-erase-cart' : 'confirmEraseCart',
			'click #logout-tab'			: 'logoutDialog',
			'click #confirm-logout'		: 'logout',
		},

		initialize: function() {
			/** Load precompiled template **/
			this.template = Utils.templates.settings;
			this.on("inTheDOM", this.rendered);
		},

		/** Render Template **/
		render: function() {
			$(this.el).html(this.template(this.model));
			return this;
		},

		rendered: function() {
			var localCust 	= JSON.parse(window.localStorage.getItem('Login'));

			if(localCust.newsletter == 1){
				document.getElementById("newsletter").checked = true;
			}
			if(JSON.parse(window.localStorage.getItem("Settings")).notify == false){
				document.getElementById("notify").checked = false;
			}
		},

		// open erase confirmation modal
		eraseCart: function(){
			$('#erase-cart-modal').openModal();
		},

		// erase the cart
		confirmEraseCart: function() {
			window.localStorage.setItem('Cart',JSON.stringify({cart: []}));
			Materialize.toast("Carrello Svuotato con successo!",2000);
		},

		// turn on/off notification
		notify: function(){
			var localCust 	= JSON.parse(window.localStorage.getItem('Login'));
			var localSettings = JSON.parse(window.localStorage.getItem("Settings"));
			var checkBox = document.getElementById("notify").checked;

			if(checkBox == true){
				window.localStorage.setItem('Settings', JSON.stringify({
					newsletter: localSettings.newsletter,
					notify: 	true
				}));
				Materialize.toast("Notifiche attivate.",2000);
			}
			else {
				window.localStorage.setItem('Settings', JSON.stringify({
					newsletter: localSettings.newsletter,
					notify: 	false
				}));
				Materialize.toast("Notifiche disattivate.",2000);
			}

		},

		// turn on/off newsletter
		newsletter: function(){

			var checkBox = document.getElementById("newsletter").checked;

			if(checkBox == true){
				this.model.newsletter(1)
				Materialize.toast("Newsletter attivate.",2000);	
			}			

			else {
				this.model.newsletter(0)
				Materialize.toast("Newsletter disattivate.",2000);
			}

		},

		// open logout confirmation modal
		logoutDialog: function() {
			$('#logout-modal').openModal();
		},

		// log-out
		logout: function() {
			Materialize.toast("Arriverderci a presto!", 2500);
			/** erase Local Storage and go to Login View **/
			window.localStorage.setItem("Cart",JSON.stringify({cart: []}));
			window.localStorage.setItem("Coords", null);
			window.localStorage.setItem("Login", null);
			window.localStorage.setItem("Settings", null);
			window.localStorage.setItem("Address", null);

			Backbone.history.navigate("login", {
				trigger: true
			});
		},

		// open change address modal
		address: function() {
			$('select').material_select();
			$('#address-modal').openModal();
		},

		// add or change customer's address
		submitAddress: function(){
			
			var localCustomer = JSON.parse(window.localStorage.getItem('Login'));
			var localAddress = JSON.parse(window.localStorage.getItem('Address'));

			var tempCity = document.getElementById("city");
			var city = tempCity.options[tempCity.selectedIndex].text;

			var address = document.getElementById("address").value;
			var cap = document.getElementById("zip").value;
			var phone = document.getElementById("phone").value;

			if(city != "" && address != "" && cap != "" && phone != ""){

				if(localAddress != null) {

					this.model.editAddress(address,city,cap,phone,localCustomer);
					Materialize.toast("Indirizzo modificato correttamente.",2000);

				} else {

					this.model.newAddress(address,city,cap,phone,localCustomer);
					Materialize.toast("Indirizzo aggiunto correttamente.",2000);
				}
			}
			else
				Materialize.toast("Completare tutti i campi per favore.",2000);
		},

	});

	return SettingsView;

});
