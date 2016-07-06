define(function(require) {

	var Backbone	= require("backbone");
	var Utils		= require("utils");

	var ContactView = Utils.Page.extend({

		constructorName: 	"ContactView",

		id: 		"contact-view",
		
		events: {      
			"click #contact" 	: "contact",
			"click #sendMail" 	: "sendMail"
		},

		initialize: function() {
			/** Load precompiled template [ you have to set path into templates.js ] **/
			this.template = Utils.templates.contact;
		},

		/** Render Template **/
		render: function() {

			$(this.el).html(this.template());
			return this;

		},

		/** open contact modal **/
		contact: function(e){
		
			$('#modal').openModal();
			$('select').material_select();
		
		},

		/** send email to loveitaly **/
		sendMail: function() {

			var recipient = "info@loveitaly.net"; 
			
			var subjectElement 	= document.getElementById('subject');
			var subject 		= subjectElement.options[subjectElement.selectedIndex].text;

			var name 	= document.getElementById('name').value;
			var sender 	= document.getElementById('email').value;
			
			var message = document.getElementById('message').value;

			if (name == "" || sender == "" || message == "" || (
				subject != "Adesioni" && subject != "Servizio Clienti" && subject != "Webmaster" && subject != "Altro" )
				) {
				
				Materialize.toast("Completa tutti i campi!", 2000);	
				
			} else {
					
				message = message + "%0D%0A%0D%0A%0D%0A%0D%0A%0D%0ADa: " + name + " - " + sender;

				location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + message;

			}

		},	
	
	});

	return ContactView;

});