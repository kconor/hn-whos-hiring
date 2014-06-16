/* jshint -W097 */
"use strict";

define([], function() {
	var constants = {
		7679431: {
				more_link: "NpBba5pCAD7VK7rhBf7Q3x"
		}
	};
	
	function get() {
		var item_id = /[0-9]+/.exec(window.location.href)[0];
		if (constants[item_id]) {
			return constants[item_id];
		} else {
			throw "Can't find constants for item id: " + item_id;
		}
	}

	return {
		get: get
	};

});
