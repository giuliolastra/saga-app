requirejs.config({

	waitSeconds: 30,

	paths: {
		jquery:       '../lib/jquery/jquery-2.2.4', 
		underscore:   '../lib/underscore/underscore',
		backbone:     '../lib/backbone/backbone',
		text:         '../lib/require/text',
		async:        '../lib/require/async',
		handlebars:   '../lib/handlebars/handlebars',
		preloader:    '../lib/preloader/pre-loader',
		md5:    	  '../lib/md5/md5.min',
		utils:        '../lib/utils/base-utils',
		hammerjs:     '../lib/hammerjs/hammer.min',
		velocity:     '../lib/velocity/velocity.min',
		materialize:  '../lib/materialize/js/materialize.amd',
		templates:    '../templates',
		config:        './config',
	},

	shim: {

		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'handlebars': {
			exports: 'Handlebars'
		},
		'velocity': {
			deps: ['jquery']
		},
		'materialize': {
			//These script dependencies should be loaded before loading
			deps: ['jquery', 'velocity', 'hammerjs'],
			//module value.
			exports: 'Materialize'
		},
		'config': {
			exports: 'Config'
		},

	}

});


/** Launch the App **/
requirejs(['backbone', 'utils'], function(Backbone, Utils) {

	requirejs(['preloader', 'router'], function(PreLoader, AppRouter) {

		document.addEventListener("deviceready", run, false);

		function run() {

			// Here we precompile ALL the templates so that the app will be quickier when switching views
			// see utils.js
			Utils.loadTemplates().once("templatesLoaded", function() {

			var images = ['./img/wallpaper.jpg', './img/logo.png']; // here the developer can add the paths to the images that he would like to be preloaded

			if (images.length) {
					new PreLoader(images, {
						onComplete: startRouter
					});
				} else {
					// start the router directly if there are no images to be preloaded
					startRouter();
				}

				function startRouter() {
					// launch the router
					var router = new AppRouter();
					Backbone.history.start();
				}
			});
		}

		requirejs(['jquery', 'materialize'], function($) {
			
			document.addEventListener("deviceready", initializeComponents, false);
		
			function initializeComponents() {
		
				requirejs([ 
					'velocity',     'jquery.easing',    'animation',    'hammerjs',     'jquery.hammer',  
					'global',       'collapsible',      'dropdown',     'leanModal',    'materialbox',  
					'parallax',     'tabs',             'tooltip',      'waves',        'toasts',     
					'sideNav',      'scrollspy',        'forms',        'slider',       'cards',
					'pushpin',      'buttons',          'scrollFire',   'transitions',  'picker',
					'picker.date',  'character_counter'
				], function() {
						
					/** Initialize Materialize Elements **/              
					$('.button-collapse').sideNav({closeOnClick: true});
					$('ul.tabs').tabs();

				});
			}

		});
	
	});

});