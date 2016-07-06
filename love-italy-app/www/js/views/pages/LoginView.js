define(function(require) {

	var Backbone 			= require("backbone");
	var Utils 				= require("utils");
	var LoginModel 			= require("models/LoginModel");
	var RegistrationModel 	= require("models/RegistrationModel");
	var Md5 				= require("md5");
	var Config				= require("config");

	var LoginView = Utils.Page.extend({

		constructorName: 	"LoginView",

		id: 				"login-view",
		
		model: 				LoginModel,

		events: {
			"click #login-button"		    : "login",
			"click #register" 				: "register",
			"click #registration-button" 	: "registration",
			"click #forgotPassword"			: "forgotPassword",
		}, 

		initialize: function() {

			this.template = Utils.templates.login;
		
		}, 

		render: function() {

			$(this.el).html(this.template());
			return this;

		},

		/** Open a Browser into the app and go to prestashop's page:  password-recupero **/
		forgotPassword: function() {

			cordova.InAppBrowser.open(Config.url + "password-recupero", "_blank", "location=yes");
		
		},

		/** Do Login  and go to HomeView **/
		login: function(e) {

			/** Getting Email and Password **/
			var email 		= document.getElementById('email').value;
			var password	= document.getElementById('password').value;

			/** Hashing Password **/
			var passMd5 = Md5(Config.encryptionKey + password);

			/** New LoginModel **/
			var model = new LoginModel(email);

			model.fetch({

     			success: function(model, response, options) {

     				/** Validating Email & Password **/
					if(email == model.attributes.email && passMd5 == model.attributes.password && model.valid) {

						/** Login Done  **/
						if(JSON.parse(window.localStorage.getItem("Settings")) == null) {

							model.setDefaultSettings(model.id);
						
						}  
					
						model.storeLogin(model.id,model.email,model.attributes.password,model.attributes.name,model.attributes.surname,model.attributes.date_add,model.attributes.newsletter);
						
						Backbone.history.navigate("home", {
		        			trigger: true
		      			});

					} else {

						/** Wrong Email/Password **/
						Materialize.toast("Email e/o password non validi.", 2000);

						window.localStorage.setItem('Login',null);
						window.localStorage.setItem("Settings", null);

					}
   
   				},
   				error: function(model, response, options) {

   					/** Wrong Email/Password [something went wrong] **/
					Materialize.toast("Errore nell'accesso al sistema, riprova fra qualche istante.", 2000);
					window.localStorage.setItem('Login',null);
					window.localStorage.setItem("Settings", null);
					
   				}
   		
   			});
				
		},

		/** Open Registration Modal **/
		register: function(e){

			$('#modal1').openModal();
		
		},

		/** Register a New Customer **/
		registration: function() {

			var email 		= document.getElementById('emailR').value;
			var password 	= document.getElementById('passwordR').value;
			var lastname 	= document.getElementById('surname').value;
			var firstname 	= document.getElementById('name').value;

			if(email == '' || password == '' || lastname == '' || firstname == '') {

				Materialize.toast("Completa tutti i campi per favore.", 2000);

			} else {

				/** Initialize Registration Model **/
				var modelR = new RegistrationModel(email,password,lastname,firstname);

				/** Try to Register User **/
				if(modelR.registerUser()) {

					/** Registration success! **/
					Materialize.toast("Registrazione effettuata con successo! Fai il Login per accedere.", 2000);

				} else {

					/** Something went Wrong **/
					Materialize.toast("Errore nella registrazione, riprova fra qualche istante.", 2000);

				}

			}

		},

	}); 

	return LoginView;

});