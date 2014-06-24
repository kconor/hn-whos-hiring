/* jshint -W097 */
"use strict";
require.config(requirejs_config);

require(["underscore", 
					//"tests/runner",
					"comments",
					"buttons",
					"dom_util",
					"load_more",
					"search"],
function( _,
					//tests,
					com,
					btn,
					dom,
					load, 
					search) {

	/* run test suite */
	//tests.run();

	//save this first, replaceComments() deletes it
	var more_link = load.findMoreLink(document);
	
	// setup new comments
	var comments = com.getNewComments();
	com.replaceComments(comments);

	// setup form at top
	search.addForm();
	load.updateLoadMoreCount(comments.length);

	search.createIndex(comments);

	/* Single page viewing of the paginated comments.
	 * WARNING: repeatedly reloading the extension with 
	 * this enabled is a good way to get banned by the
	 * rate limiter. */
	load.loadMoreComments(document, more_link);

});
