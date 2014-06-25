/* jshint -W097 */
"use strict";
define(["underscore", "comments"], 
function(_,            com) {
	
	function buildSuite(j, ui) {
		var comments;

		j.beforeEach(function() {
			comments = com.getComments();
		});

		j.describe("DOM tests", function() {

		});
	}

	return {
		buildSuite: buildSuite
	};
});
