/****************************************************
 *													*
 *	App Config File									*
 *	---------------									*
 *													*
 *	Contains variables needed into the whole App 	*
 *													*
 *													*
 ****************************************************/


define(function(require){

	/** Creating config Object **/
	var Config = {};

	/** App Name **/
	Config.appName = "Love Italy";

	/** Here can be set website url visible to all System. **/
	Config.url = 'http://loveitaly.altervista.org/';
	/** Altervista url:      http://loveitaly.altervista.org/ **/
	/** Virtual Machine url: http://192.168.56.101/loveitaly/ **/

	/** Here can be set an apiurl visible to all System. **/
	Config.apiUrl = Config.url + 'api/';	
	/** Altervista url:      http://loveitaly.altervista.org/api/ **/
	/** Virtual Machine url: http://192.168.56.101/loveitaly/api/ **/

	/** Prestashop ws_key **/
	Config.secureKey = "IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H";

	/** Prestashop encryption **/
	Config.encryptionKey = "7j3EQiXxwscCNaOIORd8YqmvkjfEmDVxs4EcihNJNVNyCG4bHA3ThTnk"; 

	return Config;

});