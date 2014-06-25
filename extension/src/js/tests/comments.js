/* jshint -W097 */
"use strict";
define(["underscore", "comments"], 
function(_,            com) {
	
	function buildSuite(j) {
		var comments;

		j.beforeEach(function() {
			comments = com.getComments();
		});

		j.describe("DOM tests", function() {
			j.it("test getComments()", function() {
				//dumb check, but should be lots on first page
				j.expect(comments.length > 10).toBe(true);
				//comments are table rows
				_.each(comments, function(c, i, ls) {
					j.expect(c.localName).toBe("tr");
				});
			});
		});

		j.describe("Test new comments", function() {

			j.it("test buildComment()", function() {
				_.each(comments, function(c, i, ls) {
					j.expect(com.buildComment(c)).toBeDefined();
				});
			});

			j.it("test buildNewComments()", function() {
				var new_com = com.buildNewComments(comments);
				//some comments will have children
				j.expect(_.some(new_com, function(c) {
					return c.child_comments.length > 0;
				})).toBe(true);
			});

			j.it("test getNewComments()", function() {
				var new_com = com.getNewComments();
				j.expect(new_com.length).toBeGreaterThan(0);
			});

		});
	}

	return {
		buildSuite: buildSuite
	};
});
