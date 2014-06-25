/* jshint -W097*/
"use strict";

define(["logger",
				"interface",
				"config",
function(_,
					Interface,
					config) {
	var pub = new Interface();


	function job_status() {
		var req = new XMLHttpRequest();

		req.open("POST", config.url, true, config.user, config.pass);

	}
	pub.export(job_status);

	return pub;
}
