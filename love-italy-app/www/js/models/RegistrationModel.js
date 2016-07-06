define(function(require) {

	var Backbone 	= require("backbone");
	var Md5			= require("md5");
	var Config		= require("config");
	var LoginModel  = require("models/LoginModel");

	var RegistrationModel = Backbone.Model.extend({
	
		constructorName: "RegistrationModel",

		initialize: function(email,pass,lastname,firstname) {

			this.email		= email;
			this.password	= pass;
			this.lastname	= lastname;
			this.firstname	= firstname;

		},

		/** Register user with an Ajax POST **/
		registerUser: function() {

			var data = 	"<prestashop><customer>";
			data +=		"<id></id><id_default_group>3</id_default_group><id_lang></id_lang>";
			data +=		"<newsletter_date_add></newsletter_date_add><ip_registration_newsletter></ip_registration_newsletter>";
			data +=		"<last_passwd_gen></last_passwd_gen><secure_key></secure_key><deleted></deleted>";
			data +=		"<passwd>" + this.password + "</passwd>";
			data +=		"<lastname>" + this.lastname + "</lastname>";
			data +=		"<firstname>" + this.firstname + "</firstname>";
			data +=		"<email>" + this.email + "</email>";
			data +=		"<id_gender></id_gender><birthday></birthday><newsletter></newsletter><optin></optin>";
			data +=		"<website></website><company></company><siret></siret><ape></ape>";
			data +=		"<outstanding_allow_amount></outstanding_allow_amount><show_public_prices></show_public_prices>";
			data +=		"<id_risk></id_risk><max_payment_days></max_payment_days><active>1</active><note></note>";
			data +=		"<is_guest></is_guest><id_shop></id_shop><id_shop_group>3</id_shop_group><date_add></date_add>";
			data +=		"<date_upd></date_upd><associations><groups><groups><id>3</id></groups></groups></associations>";
			data +=		"</customer></prestashop>";

			var success = false;

			/** Save new User **/
			$.ajax({

				url: 			Config.apiUrl + "customers/?io_format=XML&ws_key=" + Config.secureKey,
				data: 			data,
				async:			false, 
				type: 			'POST',
				contentType: 	"text/xml",
				dataType: 		"text",
				
				success: function() {
					
					success = true;
				
				},
				error: function (xhr, ajaxOptions, thrownError) {

					success = false;
					console.log(xhr);

				}

			});

			return success;

		},

		/** Login Function [uses LoginModel] **/
		login: function(email, password) {

			var model 	= new LoginModel(email);
			var passMd5 = Md5(Config.encryptionKey + password);

			if(model.valid && email == model.email && passMd5 == model.password) {

				/** Login Done **/
				model.setDefaultSettings(model.id);
				model.storeLogin(model.id,model.email,model.attributes.password,model.attributes.name,model.attributes.surname,model.attributes.date_add,model.attributes.newsletter);

				return true;

			} else {
				
				return false;

			}

		},

	});

	return RegistrationModel;

});