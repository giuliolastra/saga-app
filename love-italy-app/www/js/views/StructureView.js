define(function(require) {

	var $							= require("jquery");
	var Backbone					= require("backbone");
	var Utils						= require("utils");
	var Config						= require("config");

	var ManufacturersCollection		= require("collections/ManufacturersCollection");
	var CategoryCollection			= require("collections/CategoryCollection");
	var StructureCollection			= require("collections/StructureCollection");

	var StructureView = Backbone.View.extend({

		constructorName: "StructureView",

		collection  : StructureCollection,
		
		id: "main",

		events: {
			"click .goToHome"				: 'home',
			"click .goToContact"			: 'contact',
			"click .goToCart"				: 'cart',
			"click #search-submit-button" 	: 'search',
			"submit #search-form"			: 'search',
			"click .goToManufacturer"		: 'manufacturer',
			"click .goToCategory"			: 'category',
			"click #goToFaq"				: 'faq',
			"click #goToInfo"				: 'info',
			"click #goToSettings"			: 'settings',
		},

		initialize: function(options) {

			/** Load precompiled template **/
			this.template = Utils.templates.structure;
			this.on("inTheDOM", this.rendered);

			// Bind the back event to the goBack function
			//document.getElementById("back").addEventListener("back", this.goBack(), false);

		},

		render: function() {

			/** Load the template **/
			this.el.innerHTML = this.template(this.collection);

			/** Cache a reference to the content element **/
			this.contentElement = this.$el.find('#content')[0];

			return this;

		},

		rendered: function() {

			/** Animating SearchBar **/
			$('#search-back-button').click(function(event){
				event.stopPropagation();
				/** Hide Search Bar **/
				$('#search-bar').hide();
				$('#nav-bar').show();
			});
							
			$('#search-bar').click(function(event){
				$('#search').focus();
			}); 

			$('#search-button').click(function(event){
				event.stopPropagation();
				/** Show Search Bar **/
				$("#search-bar").show();
				$('#search').focus();
				$("#nav-bar").hide();
			});

			/** Animating Categories & Manufacturers Collapsible **/
			$('#sidebar-mobile a.collapsible-header').click(function() {
				$(this).children('.rotate').toggleClass('down');
			});

			$('#sidebar-mobile .collapsible-body li a').click(function() {
				$('#sidebar-mobile .collapsible-header').removeClass('active');
				$('#sidebar-mobile .collapsible li').removeClass('active');
				$('#sidebar-mobile a.collapsible-header .rotate').removeClass('down');
				$('#sidebar-mobile .collapsible-body').hide();
			});

		},

		/** Structure depends on Page **/
		showStructure: function(mode) {

			document.getElementById("home-tabs").style.display      = "block";
			document.getElementById("app-navbar").style.display     = "block";
			document.getElementById("sidebar-mobile").style.display = "block";

			switch(mode) {

				case 'minimal':
					document.getElementById("home-tabs").style.display  = "none";
					break;

				case 'none':
					document.getElementById("app-navbar").style.display     = "none";
					document.getElementById("sidebar-mobile").style.display = "none";
					break;
				
				default:
					break;

			}
		},

		// Set the view's title
		setAppTitle: function(title) {

			document.getElementById("app-title").innerHTML = title;
		
		},

		// Reset the view's title
		resetAppTitle: function() {

			document.getElementById("app-title").innerHTML = Config.appName;
		
		},

		/* Generic Go-Back Function **/
		goBack: function() {

			window.history.back();

		},

		/** Go to Home View **/
		home: function(event) {

			Backbone.history.navigate("home", {
				trigger: true
			});

		},

		/** Go to Cart View [only if there's something in] **/
		cart: function(event) {

			var cart = window.localStorage.getItem('Cart');

			if(JSON.parse(cart).cart.length == 0) {

				Materialize.toast("Il carrello è vuoto!", 2000);
			
			} else {
				
				Backbone.history.navigate("cart", {
					trigger: true
				});

			}

		},

		/** Go to Contact View **/
		contact: function(event) {

			Backbone.history.navigate("contact", {
				trigger: true
			});
		
		},

		/** Go to F.A.Q. View **/
		faq: function(event) {

			Backbone.history.navigate("faq", {
				trigger: true
			});

		},

		/** Go to Info View **/
		info: function(event) {

			Backbone.history.navigate("info", {
				trigger: true
			});

		},

		/** Go to Settings View **/
		settings: function(event) {

			Backbone.history.navigate("settings", {
				trigger: true
			});

		},

		/** Go to Manufacturer View **/
		manufacturer: function(e) {
		
			var id		= e.currentTarget.getAttribute('data-id');
			var name	= e.currentTarget.getAttribute('data-name');

			Backbone.history.navigate("manufacturer/" + id + "/" + name, {
				trigger: true
			});
		
		},

		/** Go to Category View **/
		category: function(e) {

			var id		= e.currentTarget.getAttribute('data-id');
			var name 	= e.currentTarget.getAttribute('data-name');

			Backbone.history.navigate("category/" + id + "/" + name, {
				trigger: true
			});

		},

		/** Go to Search View **/
		search: function(event) {

			/** Preventing default Submit & Bubbling **/
			event.stopPropagation();
			event.preventDefault();

			var query = document.getElementById('search').value;

			if(query != "") {
				
				Backbone.history.navigate("search/" + query, {
					trigger: true
				});

			} else {
				
				Materialize.toast("Scrivi qualcosa per cercare!", 2000);

			}

		},

	});

	return StructureView;

});