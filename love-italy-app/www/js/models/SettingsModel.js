define(function(require) {

	var Backbone = require("backbone");
	var Config		= require("config");

	var SettingsModel = Backbone.Model.extend({

		constructorName: "SettingsModel",

		inCity: 		false,
		currentCity: 	"",
		haveCoords: 	false, 

		initialize: function(options) {

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

			var localAddress = JSON.parse(window.localStorage.getItem("Address"));
			if(localAddress != null) {				

				this.address 		= localAddress.address;
				this.setCity(localAddress.city);
				this.zip 			= localAddress.cap;
				this.phone			= localAddress.phone;

			} else {

				try {

					localCoords = JSON.parse(window.localStorage.getItem("Coords"));

					this.latitude = localCoords.latitude;
					this.longitude = localCoords.longitude;

					haveCoords = true;

				} catch(e) {

					haveCoords = false;
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

		//http://nominatim.openstreetmap.org/reverse?format=json&lat=42.052236&lon=13.925386
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

		/** Turn on/off the newsletter **/
		newsletter : function(on){

			var localUser = JSON.parse(window.localStorage.getItem('Login'));
			var localSettings = JSON.parse(window.localStorage.getItem('Settings'));

			if(on == 1){

				window.localStorage.setItem('Settings', JSON.stringify({
					newsletter: true,
					notify: 	localSettings.notify
				}));
			}

			else{

				window.localStorage.setItem('Settings', JSON.stringify({
					newsletter: false,
					notify: 	localSettings.notify
				}));
			}			

			var res = "";
			var id = localUser.id;
		    var lastname = localUser.surname;
		    var firstname = localUser.name;
		    var email = localUser.email;
		    var password = localUser.password;
		    var date_add = localUser.date_add;

			var url_get = Config.apiUrl + 'customers/?ws_key=' + Config.secureKey + '&io_format=XML&display=full&filter[email]=' + email;
        	var url_put = Config.apiUrl + 'customers/?io_format=XML&ws_key=' + Config.secureKey;

			$.get(url_get,function(data) {

		    	xmlString = (new XMLSerializer()).serializeToString(data);

		    	if(on == 0){
		    		res = xmlString.replace("<newsletter><![CDATA[1]]></newsletter>", "<newsletter><![CDATA[0]]></newsletter>");
		    	}
		    	else{
		    		res = xmlString.replace("<newsletter><![CDATA[0]]></newsletter>", "<newsletter><![CDATA[1]]></newsletter>");
		    	}
		       	
		       	res = res.replace(/<!\[CDATA\[/g, '');
		       	res = res.replace(/\]\]>/g, '');
		       	res = res.replace(/\".\"/g, '');
		       	res = res.replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", '');
		       	res = res.replace(" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"", '');
		       	res = res.replace(" xlink:href=\"http:\/\/loveitaly.altervista.org\/api\/groups\/3\"", '');
		       	res = res.replace(" xlink:href=\"http:\/\/loveitaly.altervista.org\/api\/languages\/1\"", '');
		       	res = res.replace(" nodeType=\"groups\" api=\"groups\"", '');
		       	res = res.replace(" xlink:href=\"http:\/\/loveitaly.altervista.org\/api\/groups\/3\"", '');
		       	res = res.replace("<customers>", '');
		       	res = res.replace("</customers>", '');
		    

		  		$.ajax({
		            url: url_put,
		            data: res,
		            type: "PUT",
		            contentType: "text/xml",
		            dataType: "text",

		            error : function (xhr, ajaxOptions, thrownError){
				        console.log(xhr);
		    		},
		   		});

			});
		},

		/** set the Customer's city  **/
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

		/** create a new Customer's Address **/
		newAddress : function(address,city,cap,phone,localCustomer){

			window.localStorage.setItem('Address',JSON.stringify({address:address,city:city,cap:cap,phone:phone}));

			var id_customer = localCustomer.id;
			var lastname = localCustomer.surname;
			var firstname = localCustomer.name;
			var address1 = address;
			var postcode = cap;
			var city = city;
			var phone_mobile = phone;
			var date_add= "";
			var date_upd= "";

			// Save address
			$.ajax({
				url: Config.url +"api/addresses/&io_format=XML&ws_key=" +Config.secureKey,
				data:"<prestashop><address><id></id><id_customer>"+id_customer+"</id_customer><id_manufacturer>0</id_manufacturer><id_supplier>0</id_supplier><id_warehouse>0</id_warehouse><id_country>10</id_country><id_state>148</id_state><alias>indirizzo1</alias><company></company><lastname>"+lastname+"</lastname><firstname>"+firstname+"</firstname><vat_number></vat_number><address1>"+address1+"</address1><address2></address2><postcode>"+postcode+"</postcode><city>"+city+"</city><other></other><phone></phone><phone_mobile>"+phone_mobile+"</phone_mobile><dni></dni><deleted>0</deleted><date_add>"+date_add+"</date_add><date_upd>"+date_upd+"</date_upd></address></prestashop>",
				type: 'POST',
				contentType: "text/xml",
				dataType: "text",

				success: function(){
					// Get address id and save it in local storage
					$.ajax({
						dataType: "json",
						url: Config.url +"api/addresses/?ws_key=" +Config.secureKey+ "&io_format=JSON&display=[id]&filter[id_customer]="+id_customer,
						data: null,

						success: function(data,status,xhr){
							address_id = data.addresses[0].id;
							window.localStorage.setItem('Address',JSON.stringify({address_id:address_id,address:address,city:city,cap:cap,phone:phone}))
						},

						error: function(xhr, ajaxOptions, thrownError){
							console.info( $(xhr.responseText).find("message").text());
						}
					});
				},

				error : function (xhr, ajaxOptions, thrownError){
					console.info( $(xhr.responseText).find("message").text());
				},

			});

		},

		/** Edit the Customer's address **/
		editAddress : function(address,city,cap,phone,localUser){

			window.localStorage.removeItem('Address');
			window.localStorage.setItem('Address',JSON.stringify({address:address,city:city,cap:cap,phone:phone}));

			var address_id;
			var id_customer = localUser.id;
			var lastname = localUser.surname;
			var firstname = localUser.name;
			var address1 = address;
			var postcode = cap;
			var city = city;
			var phone_mobile = phone;

			$.ajax({
				dataType: "json",
				url: Config.url +"api/addresses/?ws_key=" +Config.secureKey+ "&io_format=JSON&display=[id]&filter[id_customer]="+id_customer,
				data: null,

				success: function(data,status,xhr){
					address_id = data.addresses[0].id;

					$.ajax({
						url: Config.url +"api/addresses/&io_format=XML&ws_key=" +Config.secureKey,
						data:"<prestashop><address><id>"+address_id+"</id><id_customer>"+id_customer+"</id_customer><id_manufacturer>0</id_manufacturer><id_supplier>0</id_supplier><id_warehouse>0</id_warehouse><id_country>10</id_country><id_state>148</id_state><alias>indirizzo1</alias><company></company><lastname>"+lastname+"</lastname><firstname>"+firstname+"</firstname><vat_number></vat_number><address1>"+address1+"</address1><address2></address2><postcode>"+postcode+"</postcode><city>"+city+"</city><other></other><phone></phone><phone_mobile>"+phone_mobile+"</phone_mobile><dni></dni><deleted>0</deleted><date_add></date_add><date_upd></date_upd></address></prestashop>",
						type: 'PUT',
						contentType: "text/xml",
						dataType: "text",
						error : function (xhr, ajaxOptions, thrownError){
							console.info( $(xhr.responseText).find("message").text() );
						}
					});
					window.localStorage.removeItem('Address');
					window.localStorage.setItem('Address',JSON.stringify({address_id:address_id,address:address,city:city,cap:cap,phone:phone}));
				},
				error: function(xhr, ajaxOptions, thrownError){
					console.info( $(xhr.responseText).find("message").text() );
				},

			});

		}

	});

	return SettingsModel;

});