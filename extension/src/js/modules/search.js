/* jshint -W097 */
"use strict";
define(["underscore", 
				"interface",
				"dom_util",
				"comments",
				"buttons",
				"text!/html/header.html"], 
function( _, 
					Interface,
					dom,
					com,
					btn,
					header_html) { 

	var pub = new Interface();


	/* 
	 * Search function.  Iterates over comments
	 * and shows/hides comment tree depending
	 * on output of provided predicate.  Also
	 * counts how many satisfy the predicate.
	 *
	 * @param {object} boolean predicate that takes a comment
	 *
	 * @returns {number} # satisfying predicate
	 */
	function search(predicate) {
		var visible = 0;
		var comments = com.getNewComments();
		_.each(comments, function(c, i, ls) {
			if (predicate(c)) {
				dom.show(c);
				visible++;
			} else {
				dom.shrinkTree(c);
				dom.hide(c);
			}
		});
		return visible;
	}

	/* 
	 * Generate an event listener that shows or hides
	 * the comments based on an optional search query
	 * and a status 
	 * 
	 * @returns {object} a search function
	 */
	function genListener() {
		var status_select = document.getElementById("wh-filter-by-status");
		var filter = document.getElementById('wh-text-filter');

		function listener(e) {
			try {
				var query = filter.value.toLowerCase();
				var selected = status_select.selectedOptions[0].value;
				var status_num = btn.selectIndex(selected);

				var found = search(function(comment) {
					var comment_status = com.getStatus(comment);
					//status_num === -1 => view all statuses
					if (status_num === -1 || comment_status === status_num) {
						if (filter.value === "") {
							return true;
						} else {
							return comment.innerText.toLowerCase().indexOf(query) > -1;
						}
					} else {
						return false;
					}
				});
			} catch (ex) {
				throw ex;
			} finally {
				e.preventDefault();
			}
		}
		return listener;
	}

	/*
	 * Adds the tools at the top of the post for filtering comments
	 */
	function addForm() {
		if (document.getElementById("wh-header") === null) {
			var table = com.getPostTable();
			table.insertAdjacentHTML('afterend', header_html);
			/* add full text search and status filtering to comments.
			 * filter on search term submit or status select change.
			 * searches only top-level comments (the job posts). */
			var form = document.getElementById('wh-form');
			var status_select = document.getElementById("wh-filter-by-status");
			var listener = genListener();
			form.addEventListener('submit', listener);
			status_select.addEventListener('change', listener);
		}
	}
	pub.export(addForm);

	return pub;
});
