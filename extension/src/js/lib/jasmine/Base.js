define([], function() {

return {
	base: function(j$) {
		j$.unimplementedMethod_ = function() {
			throw new Error("unimplemented method");
		};

		j$.MAX_PRETTY_PRINT_DEPTH = 40;
		j$.DEFAULT_TIMEOUT_INTERVAL = 5000;

		j$.getGlobal = (function() {
			var jasmineGlobal = eval.call(null, "this");
			return function() {
				return jasmineGlobal;
			};
		})();

		j$.getEnv = function(options) {
			var env = j$.currentEnv_ = j$.currentEnv_ || new j$.Env(options);
			//jasmine. singletons in here (setTimeout blah blah).
			return env;
		};

		j$.isArray_ = function(value) {
			return j$.isA_("Array", value);
		};

		j$.isString_ = function(value) {
			return j$.isA_("String", value);
		};

		j$.isNumber_ = function(value) {
			return j$.isA_("Number", value);
		};

		j$.isA_ = function(typeName, value) {
			return Object.prototype.toString.apply(value) === '[object ' + typeName + ']';
		};

		j$.isDomNode = function(obj) {
			return obj.nodeType > 0;
		};

		j$.any = function(clazz) {
			return new j$.Any(clazz);
		};

		j$.objectContaining = function(sample) {
			return new j$.ObjectContaining(sample);
		};
	}
};
});
