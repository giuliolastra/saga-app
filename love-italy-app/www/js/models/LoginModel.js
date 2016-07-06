define(function(require) {

	var Backbone 	= require("backbone");
	var Md5			= require("md5");
	var Config		= require("config");


	var Login = Backbone.Model.extend({
	
		constructorName: "Login",
		
		valid: 		false,

		url: function() {

			var url = 	Config.apiUrl + "customers/";
			url += 		"?io_format=JSON&ws_key=" + Config.secureKey;
			url +=		"&filter[email]=" + this.email,
			url +=		"&display=[id,email,passwd,firstname,lastname,date_add,newsletter]";

			return url;

		},

		initialize: function(email) {

			this.email = email;

		},

    	parse: function(data) {

    		try {

	    		var subData = data.customers[0];

				subData.id			= subData['id'];
				subData.email		= subData['email'];
				subData.password	= subData['passwd'];
				subData.name		= subData['firstname'];
				subData.surname		= subData['lastname'];
				subData.date_add	= subData['date_add'];
				subData.newsletter	= subData['newsletter'];
				this.valid			= true;
    			
    		} catch(e) {

    			console.log(e);
    			this.valid = false;

    		}


			
			return subData;
		
		},

		/** Store User data into local storage **/
		storeLogin: function(i,e,p,n,s,d,nl) {

			/** Create User object for local storage **/
			function U(i,e,p,n,s,d,nl){
				this.id 		= i;
				this.email 		= e;
				this.password 	= p;
				this.name       = n;
				this.surname    = s;
				this.date_add	= d;
				this.newsletter = nl;
			}

			var url = 	Config.apiUrl + "addresses/";
			url += 		"?ws_key=" + Config.secureKey + "&io_format=JSON";
			url +=		"&display=[id,address1,postcode,city,phone_mobile]";
			url +=		"&filter[id_customer]=" + i;

			/** Store User info into Local Storage **/
			window.localStorage.setItem("Login",JSON.stringify(new U(i,e,p,n,s,d,nl)));

			$.ajax({
				dataType: 	"json",
				url: 		url,
				data: 		null,		
								  
				success: function(data,status,xhr){

					if (data.length > 0) {
						
						var tempAddress = data.addresses[0];
		
						/** Store User Address into Local Storage **/
						window.localStorage.setItem("Address", JSON.stringify({
							address_id:	tempAddress.id,
							address:	tempAddress.address1,
							city:		tempAddress.city,
							cap:		tempAddress.postcode,
							phone:		tempAddress.phone_mobile
						}));

					}

				},
				error: function(xhr, ajaxOptions, thrownError) {
				    
				    console.log($(xhr.responseText).find("message").text());
				
				}
			
			}); 
		
		},

		/** Set Default Settings into Local Storage **/
		setDefaultSettings: function(id) {

			window.localStorage.setItem('Settings',JSON.stringify({
				notify: 	true,
				newsletter: false
			}));

		}
	});

	return Login;

});