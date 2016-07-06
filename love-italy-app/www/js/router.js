define(function(require) {

	var $								= require("jquery");
	var Backbone 						= require("backbone");

	var StructureView 					= require("views/StructureView");
	var StructureCollection 			= require("collections/StructureCollection");

	var HomeView 						= require("views/pages/HomeView");

	var ManufacturersCollection 		= require("collections/ManufacturersCollection");
	var ManufacturerProductsCollection 	= require("collections/ManufacturerProductsCollection");
	var ManufacturerModel 				= require("models/ManufacturerModel");
	var ManufacturerView 				= require("views/pages/ManufacturerView");

	var CategoryModel 					= require("models/CategoryModel");
	var CategoryCollection 				= require("collections/CategoryCollection");
	var CategoryProductsCollection 		= require("collections/CategoryProductsCollection");
	var CategoryView 					= require("views/pages/CategoryView");

	var ProductModel 					= require("models/ProductModel");
	var ProductView 					= require("views/pages/ProductView");
	var ProductsCollection 				= require("collections/ProductsCollection");

	var SearchView 						= require("views/pages/SearchView");
	var SearchCollection 				= require("collections/SearchCollection");

	var LoginModel 						= require("models/LoginModel");
	var LoginView 						= require("views/pages/LoginView");

	var CartModel 						= require("models/CartModel");
	var CartView 						= require("views/pages/CartView");

	var ContactView 					= require("views/pages/ContactView");

	var SettingsView					= require("views/pages/SettingsView");
	var SettingsModel 					= require("models/SettingsModel");

	var FaqView 						= require("views/pages/FaqView");

	var InfoView 						= require("views/pages/InfoView");


	var AppRouter = Backbone.Router.extend({

		constructorName: "AppRouter",

		routes: {
			/** The Default is the structure view **/
			''							: 'startApp',
			'home'						: 'Home',
			'login'						: 'Login',
			'manufacturer/:id/:name'	: 'Manufacturer',
			'category/:id/:name'		: 'Category',
			'product/:id'				: 'Product',
			'cart'						: 'Cart',
			'search/:query'				: 'Search',
			'contact'					: 'Contact',
			'faq'						: 'Faq',
			'info'						: 'Info',
			'settings'					: 'Settings'
		},

		/** AppRouter constructor **/
		initialize: function(options) {

			this.currentView = undefined;
			this.selectFirstView();

			this.createCart();
			this.getCoordinates();

		},

		startApp: function() {
			
			if(this.isConnected()) {
			
				this.showStructure();
			
			} else {
			
				this.connectionError("showStructure");
			
			}

		},

		/** Create Cart in local storage if it doesn't exist **/
		createCart: function() {

			if(window.localStorage.getItem('Cart') == null){
				window.localStorage.setItem('Cart',JSON.stringify({cart: []}));
			}

		},

		/** Getting Device Coordinates and save them in Local Storage**/
		getCoordinates : function(){

			navigator.geolocation.getCurrentPosition(

				function(position) {

					window.localStorage.setItem("Coords", JSON.stringify({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}));
				},

				function(error) {
					console.log("Impossibile ricevere le Coordinate :(");
					window.localStorage.setItem("Coords", JSON.stringify({
						latitude: 0.000000,
						longitude: 0.000000
					}));
				}
			);

		},

		/** Try to Login User and then to go to HomeView, if it fails First View will be LoginView **/
		selectFirstView: function() {

			/** Checking if Login in LocalStorage is Set **/
			if(JSON.parse(window.localStorage.getItem('Login')) != null) {

				var localStorageLogin = JSON.parse(window.localStorage.getItem("Login"));
				var email = localStorageLogin.email;
				var pass  = localStorageLogin.password;

				var loginModel = new LoginModel(email);

				var that = this;

				loginModel.fetch({

					timeout: 5000,
					async: 	false,
					
					success: function(model, response, options) {

						/** Check if email and password are correct **/
						if(email == loginModel.attributes.email && pass == loginModel.attributes.password && loginModel.valid) {
							
							that.firstView = 'home';

						} else {

							that.firstView = 'login';

						}

					},
					error: function(model, response, options) {

						that.firstView = 'login';

					}

				});
				
			} else {

				this.firstView = 'login';

			}

		},

		/** check phone connection **/
		isConnected: function() {

		    var networkState = navigator.connection.type;

		    var states = {};
		    states[Connection.UNKNOWN]  = 'Tipo di connesssione sconosciuta';
		    states[Connection.ETHERNET] = 'Connesione ethernet';
		    states[Connection.WIFI]     = 'Connessione WiFi';
		    states[Connection.CELL_2G]  = 'Connessione 2G';
		    states[Connection.CELL_3G]  = 'Connessione 3G';
		    states[Connection.CELL_4G]  = 'Connessione 4G';
		    states[Connection.CELL]     = 'Connessione cellulare generica';
		    states[Connection.NONE]     = 'Connessione assente';

		    console.log('Tipo di connesssione: ' + states[networkState]);

		    if(networkState == Connection.NONE) return false;
		    return true;

		},

		reloadView: function(functionName) {

			eval("this." + functionName + "();");

		},

		connectionError: function(functionName) {
				
			/** Caching ConnectionError div **/
			var connectionError = document.getElementById('connectionError');

			/** Hiding Preloader **/
			document.getElementById('preloader').style.display = "none";

			connectionError.removeEventListener("click", this.reloadView(functionName), false);
			connectionError.addEventListener("click", this.reloadView(functionName), false);
			connectionError.style.display = "block";
						
			console.log('Errore nella Richiesta al Server! [Error in ' + functionName + '()]');

			/** Minimal Structure View **/
			that.structureView.resetAppTitle();
			that.structureView.showStructure('minimal');
		
		},

		/** Home View **/
		Home: function() {

			/** Create the ProductCollection **/
			var collection = new ProductsCollection({limit:30});

			var that = this;

			/** Fetching the product collection, time limit is 5 seconds **/
			collection.fetch({

				timeout: 5000,
				success: function(collection, response, options) {

					/** Fetch success, we go to Home View **/
					var page = new HomeView({
						collection: collection
					});

					/** Full Structure View **/
					that.structureView.resetAppTitle();
					that.structureView.showStructure();
					that.changePage(page);

				},
				error: function(collection, response, options){

					/** Fetch Error, we go to Error View **/
					console.log("Errore nella richiesta al Server");

					/** Something went Wrong **/
					that.connectionError("Home");

					/** Minimal Structure View **/
					that.structureView.resetAppTitle();
					that.structureView.showStructure('minimal');
					that.changePage(page);

				}

			});

		},

		/** Product View **/
		Product: function(productID) {

			/** Create ProductModel **/
			var model = new ProductModel(
				JSON.stringify({
					id: productID
				})
			);

			var that = this;

			/** Fetching the product collection, time limit is 20 seconds **/
			model.fetch({

				timeout: 20000,
				success: function(model, response, options) {

					/** Fetch success, we go to Search View **/
					var page = new ProductView({
						model: model
					});

					/** Minimal Structure View **/
					that.structureView.setAppTitle(model.attributes.name);
					that.structureView.showStructure('minimal');
					that.changePage(page);

				},
				error: function(model, response, options){

					/** Fetch Error, Something went Wrong **/
					this.connectionError("Product");

					/** Minimal Structure View **/
					that.structureView.resetAppTitle();
					that.structureView.showStructure('minimal');
					that.changePage(page);

				}

			});

		},

		/** Search View **/
		Search: function(query) {

			/** Create the ProductCollection **/
			var collection = new SearchCollection({
				limit: 30,
				query: query
			});

			var that = this;

			/** Fetching the Search collection, time limit is 20 seconds **/
			collection.fetch({

				timeout: 20000,
				success: function(collection, response, options) {

					/** Fetch success, we go to Search View **/
					var page = new SearchView({
						collection: collection
					});

					/** Minimal Structure View **/
					that.structureView.resetAppTitle();
					that.structureView.showStructure('minimal');
					that.changePage(page);

				},
				error: function(collection, response, options){

					/** Fetch Error, Something went Wrong **/
					this.connectionError("Search");

					/** Minimal Structure View **/
					that.structureView.resetAppTitle();
					that.structureView.showStructure('minimal');
					that.changePage(page);

				}

			});

		},

		/** Login View **/
		Login: function() {

			if(JSON.parse(window.localStorage.getItem("Coords")) == null){
				this.getCoordinates();
			}

			var page = new LoginView();

			/** Full screen view, no Structure View to Show **/
			this.structureView.showStructure('none');
			this.changePage(page);

		},

		/** Contact View **/
		Contact: function() {

			var page = new ContactView();

			/** Minimal Structure View **/
			this.structureView.resetAppTitle();
			this.structureView.showStructure('minimal');
			this.changePage(page);

		},

		/** Faq View **/
		Faq: function(){

			var page = new FaqView();

			/** Minimal Structure View **/
			this.structureView.resetAppTitle();
			this.structureView.showStructure('minimal');
			this.changePage(page);

		},

		/** Info View **/
		Info: function(){

			var page = new InfoView();
			this.structureView.resetAppTitle();
			this.structureView.showStructure('minimal');
			this.changePage(page);

		},

		/** Manufacturer View **/
		Manufacturer: function(id,name) {

			/** Create the Manufacturer Products Collection **/
			var collection = new ManufacturerProductsCollection({
				id: id
			});

			var that = this;

			/** Fetching the Manufacturer Products Collection, time limit is 20 seconds **/
			collection.fetch({

				timeout: 10000,
				success: function(collection, response, options) {

					var model = new ManufacturerModel({
						id: id
					});

					model.fetch({

						timeout: 10000,
						success: function(model, response, options) {

							/** Fetch success, we go to Manufacturer View **/
							var page = new ManufacturerView({
								model: 		model,
								collection: collection
							});

							/** Minimal Structure View **/
							that.structureView.setAppTitle(name);
							that.structureView.showStructure('minimal');
							that.changePage(page);

						},
						error: function(model, response, options) {

							/** Fetch Error, Something went Wrong **/
							that.connectionError("Manufacturer");

						}

					})

				},
				error: function(collection, response, options){

					/** Fetch Error, Something went Wrong **/
					that.connectionError("Manufacturer");

				}

			});

		},

		/** Category View **/
		Category: function(id,name) {

			/** Create the Category Products Collection **/
			var collection = new CategoryProductsCollection({
				id: id
			});

			var that = this;

			/** Fetching the Category Products Collection, time limit is 20 seconds **/
			collection.fetch({

				timeout: 20000,
				success: function(collection, response, options) {

					/** Fetch success, we go to Category View **/
					var page = new CategoryView({
						collection: collection
					});

					/** Minimal Structure View **/
					that.structureView.setAppTitle(name);
					that.structureView.showStructure('minimal');
					that.changePage(page);

				},
				error: function(collection, response, options){

					/** Fetch Error, Something went Wrong **/
					this.connectionError("Category");

					/** Minimal Structure View **/
					that.structureView.resetAppTitle();
					that.structureView.showStructure('minimal');
					that.changePage(page);

				}

			});

		},

		/** Cart View **/
		Cart: function(){

			/** Create the model **/
			var model = new CartModel();

			var that = this;

			/** Fetching the model only if currentCity is not set **/
			if(model.currentCity == "") {

				/** Fetching the Cart Model, time limit is 3 seconds **/
				model.fetch({

					timeout: 3000,
					success: function(model, response, options) {

						/** Coordinates Received **/
						var page = new CartView({
							model : model
						});

						that.structureView.setAppTitle('Carrello');
						that.structureView.showStructure('minimal');
						that.changePage(page);

					},
					error: function(model, response, options) {

						/** Coordinates Not Received **/
						var page = new CartView({
							model : model
						});

						console.log('Errore nel Calcolo della Località');
						that.structureView.setAppTitle('Carrello');
						thats.structureView.showStructure('minimal');
						that.changePage(page);

					}

				});

			} else {

				/** No Need to Fetch, currentCity is already set **/
				var page = new CartView({
					model : model
				});

				that.structureView.setAppTitle('Carrello');
				that.structureView.showStructure('minimal');
				that.changePage(page);
			}

		},

		/** Settings View **/
		Settings: function() {

			var model = new SettingsModel();

			var that = this;

			/** Fetching the model only if currentCity is not set **/
			if(model.currentCity == ""){

				/** Fetching the Settings Model, time limit is 3 seconds **/
				model.fetch({

					timeout: 3000,

					success: function(model, response, options) {
						var page = new SettingsView({
							model: model
						});

						that.structureView.setAppTitle("Impostazioni");
						that.structureView.showStructure('minimal');
						that.changePage(page);

					},
					error: function(model, response, options) {

						console.log('Errore nel Calcolo della Località');
						var page = new SettingsView({
							model: model
						});

						that.structureView.setAppTitle("Impostazioni");
						that.structureView.showStructure('minimal');
						that.changePage(page);

					}

				});

			} else {

				/** No need to Fetch, currentCity is already set **/
				var page = new SettingsView({
					model: model
				});

				that.structureView.setAppTitle("Impostazioni");
				that.structureView.showStructure('minimal');
				that.changePage(page);

			}

		},


		/** Load Structure View **/
		showStructure: function() {

			console.log(this.firstView);

			/** get list of manufacturers **/
			var manufacturers = new ManufacturersCollection();
			var that = this;

			/** Fetching the Manufacturer Collection, time limit is 5 seconds **/
			manufacturers.fetch({

				async : false,
				timeout: 5000,

				success: function(collection, response, options) {

					/** Get Category List **/
					var categories = new CategoryCollection();

					/** Fetching the Category Collection, time limit is 5 seconds **/
					categories.fetch({

						async:false,
						timeout: 5000,

						success: function(collection, response, options) {

						/** Creating Collection of 2 Collections [ Manufacturers & Category ] **/
						var collection = new StructureCollection({manufacturers:manufacturers,categories:categories});

							if (!that.structureView) {

								that.structureView = new StructureView({
									collection : collection,
								});

								/** Put the el element of the structure view into the DOM **/
								document.body.appendChild(that.structureView.render().el);
								that.structureView.trigger("inTheDOM");
								that.navigate(that.firstView, {trigger: true});
							}
							
						},
						error: function() {
							
							/** Fetch Error, Something went Wrong **/
							that.connectionError("showStructure");
						
						}

					});

				},
				error: function() {
					
					/** Fetch Error, Something went Wrong **/
					that.connectionError("showStructure");

				}

			});

		},

	});

	return AppRouter;

});