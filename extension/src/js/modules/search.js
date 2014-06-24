/* jshint -W097 */
"use strict";
define(["underscore", 
				"interface",
				"dom_util",
				"comments",
				"buttons",
				"lunr",
				"logger",
				"text!/html/header.html"], 
function( _, 
					Interface,
					dom,
					com,
					btn,
					lunr,
					logger,
					header_html) { 

	/*
	 * Override tokenizer function to split on "/" as well.
	 *
	 * @param{String} the string to convert into tokens
	 *
	 * @returns{object} an array of tokens
	 */
	lunr.tokenizer = function(obj) {
		if (!arguments.length || obj === null || obj === undefined)
			return [];
		if (Array.isArray(obj)) {
			return obj.map(function (t) { 
				return t.toLowerCase(); 
			});
		}

		var str = obj.toString().trim();
		
		return str
			.split(/\s+/)
			.map(function(token) {
				return token.split("/");
			})
			.reduce(function(prev, curr) {
				return prev.concat(curr);
			}, [])
			.map(function(token) {
				return token.toLowerCase();
			});
	};



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
		var comments = com.getNewComments();
		var visible = 0;
		_.each(comments, function(c) {
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
				var query_results = index.search(query);
				query_results = _.sortBy(query_results, function(id) {
					return parseInt(id.ref);
				});
				var selected = status_select.selectedOptions[0].value;
				var status_num = btn.selectIndex(selected);

				var id = 0;
				var found = search(function(comment) {
					var comment_status = com.getStatus(comment);
					if (status_num === -1 || comment_status === status_num) {
						if  (query === "") {
							return true;
						} else if (query_results && 
												id < query_results.length && 
												comment.search_id == query_results[id].ref)
						{
							id++;
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				});
				logger.log("search() results: " + found);
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

	var index;
	var max_doc_id = 0;

	function createIndex(comments) {
		index = lunr(function() {
			this.field("body");
			this.field("id");
		});

		if (comments !== undefined) {
			addToIndex(comments);
		}
	}
	pub.export(createIndex);

	//TODO: make this async?
	function addToIndex(comments) {
		_.each(comments, function(c) {
			c.search_id = max_doc_id;
			index.add({id: max_doc_id, body: c.innerText});
			max_doc_id += 1;
		});
		logger.log("max id: " + max_doc_id);
	}
	pub.export(addToIndex);

	return pub;
});
