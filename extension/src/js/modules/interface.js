/* jshint -W097 */
"use strict";
define([], function() {
	function _interface() {
		/* Add a function to the interface */
		this.export = function(fn) {
			this[fn.name] = fn;
		};

		/* merge two interfaces.
		 * used to add everything in a public interface
		 * to a private one to cut down on code. */
		this.merge = function(i) {
			for (var key in i) {
				this[key] = i;
			}
		};
	}
	return _interface;
});
