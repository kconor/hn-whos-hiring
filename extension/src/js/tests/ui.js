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

			j.it("test getPostTable()", function() {
				var table = ui.getPostTable();
				j.expect(table.innerText.indexOf("hiring")).toBeGreaterThan(-1);
			});

			j.it("test shiftComments()", function() {
				var levels = com.splitCommentsByLevel(comments);//TODO: update
				var total_indent = 
				_.reduce(levels.lower_level, 
					function(memo, c) {
						return memo + ui.getSpacer(c).width;
					}, 0 );
				ui.shiftComments(levels.lower_level, 40);
				var new_indent = 
				_.reduce(levels.lower_level, 
					function(memo, c) {
						return memo + ui.getSpacer(c).width;
					}, 0 );
				j.expect(new_indent).toBe(total_indent + levels.lower_level.length * 40);
				ui.shiftComments(levels.lower_level, -40);
				var new_old_indent = 
				_.reduce(levels.lower_level, 
					function(memo, c) {
						return memo + ui.getSpacer(c).width;
					}, 0 );
				j.expect(new_old_indent).toBe(total_indent);
			});

			j.it("test clicking apply button", function() {
				var buttons = com.getButtons("appl");
				_.each(buttons, function(btn, i, ls) {
					if (btn.innerText === "apply") {
						btn.click();
						j.expect(btn.innerText).toBe("applied");
					} else if (btn.innerText === "applied") {
						btn.click();
						j.expect(btn.innerText).toBe("apply");
					} else {
						j.expect(true).toBe(false);
					}
				});
			});

		});
	}

	return {
		buildSuite: buildSuite
	};
});
