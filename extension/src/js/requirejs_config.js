/*
 * Configuration variables for require.js.
 *
 * Loads modules from /js/modules by default.
 *
 * Paths to libs are also shortened.
 */
var requirejs_config = {
  baseUrl: "/js/modules",
  paths: {
		jquery: "/js/lib/jquery-2.1.1",
		underscore: "/js/lib/underscore",
		jasmine: "/js/lib/jasmine",
		lunr: "/js/lib/lunr",
		tests: "/js/tests",
		text: "/js/lib/text",
		config: "/js/config"
  },
	config: {
		text: {
			env: 'chrome extension'
		}
	}
};
