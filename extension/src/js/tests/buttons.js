/* jshint -W097 */
"use strict";
define(["underscore", "comments", "buttons"], 
function(_,            com,        btn) {
	
	function buildSuite(j) {
		var comments;

		j.beforeEach(function() {
			comments = com.getNewComments();
		});

		j.describe("DOM tests", function() {

			j.it("test hide(elements) and show(elements)", function() {
				_.each(comments, function(c, i, ls) {
					ui.hide(c);
				});
				_.each(comments, function(c, i, ls) {
					j.expect(c.style.display).toBe("none");
				});
				_.each(comments, function(c, i, ls) {
					ui.show(c);
				});
				_.each(comments, function(c, i, ls) {
					j.expect(c.style.display).toBe("block");
				});
			});

			j.it("test getID()", function() {
				var IDs = [];
				_.each(comments, function(c, i, ls) {
					try {
						IDs.push(btn.getID(c));
					} catch (e) {
						debugger;
					}
				});
				var links = [];
				_.each(IDs, function(id, i, ls) {
					links.push(id.link);
					j.expect(id.link).toBeDefined();
					j.expect(id.user).toBeDefined();
				});
				//check we found unqiue link ids
				j.expect(_.uniq(links).length).toBe(IDs.length);
			});

			j.it("test getPostTable()", function() {
				var table = ui.getPostTable();
				j.expect(table.innerText.indexOf("hiring")).toBeGreaterThan(-1);
			});

		});
	}

	return {
		buildSuite: buildSuite
	};
});
