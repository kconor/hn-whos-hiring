/* jshint devel: true, -W097 */
"use strict";
define(["interface"], function(Interface) {

	var pub = new Interface();

	function log(str) { 
		console.log(str);
	}
	pub.export(log);


	function err(str) {
		log("ERROR: " + str);
		var error = new Error("dummy error for stack trace");
		log(error.stack);
	}
	pub.export(err);

	return pub;
});
