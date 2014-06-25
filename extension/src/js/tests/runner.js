/* jshint -W097 */
"use strict";
define(["./boot",
				"./comments",
				"./storage",
				"./ui",
				"./buttons"],
function( boot,
					comments,
					db,
					ui,
					btn) {

	function run() {
		/* TODO
		 * each time the page action is clicked, duplicates of the 
		 * specs are added to something to be run... */
		comments.buildSuite(boot.jasmineInterface);
		db.buildSuite(boot.jasmineInterface);
		btn.buildSuite(boot.jasmineInterface);
		//ui.buildSuite(boot.jasmineInterface);
		boot.env.execute();
	}

	return {
		run: run
	};
});
