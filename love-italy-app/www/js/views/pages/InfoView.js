define(function(require) {

	var Backbone 	= require("backbone");
	var Utils		= require("utils");

	var InfoView = Utils.Page.extend({

		constructorName: 	"InfoView",

		id: "info-view",
    	
		initialize: function() {
		
			/** Load precompiled template [ you have to set path into templates.js ] **/
			this.template = Utils.templates.info;
			this.on("inTheDOM", this.rendered);
		
		},

		/** Render Template **/
		render: function() {
		
			$(this.el).html(this.template());
			return this;
		
		},

		rendered: function() {

			/** Initialize Materialize's stuffs **/
			$('.collapsible').collapsible({accordion : false});		

		},
	
	});

	return InfoView;

});