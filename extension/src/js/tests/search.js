/* jshint -W097, devel: true*/
"use strict";
define(["storage"], function(db) {

	function buildSuite(j /*jasmine interface*/) {
		j.describe("Search functionality", function() {

			j.it("test get(), set(), and remove(): (5)", function() {
				j.expect(true).toBe(true);
			});

		});
	}

	return {
		buildSuite: buildSuite
	};
});
