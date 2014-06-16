/* jshint -W097 */
"use strict";

define(["jasmine/jasmine", "jasmine/console"], 
function(jasmineRequire,    Console) {

  /**
   * ## Require & Instantiate
   *
   * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
   */
	var jasmine = jasmineRequire.core(jasmineRequire);

  /* Create the Jasmine environment. This is used to run all specs in a project. */
  var env = jasmine.getEnv();

  /**
   * ## The Global Interface
   *
   * Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
   */
  var jasmineInterface = {
    describe: function(description, specDefinitions) {
      return env.describe(description, specDefinitions);
    },

    xdescribe: function(description, specDefinitions) {
      return env.xdescribe(description, specDefinitions);
    },

    it: function(desc, func) {
      return env.it(desc, func);
    },

    xit: function(desc, func) {
      return env.xit(desc, func);
    },

    beforeEach: function(beforeEachFunction) {
      return env.beforeEach(beforeEachFunction);
    },

    afterEach: function(afterEachFunction) {
      return env.afterEach(afterEachFunction);
    },

    expect: function(actual) {
      return env.expect(actual);
    },

    pending: function() {
      return env.pending();
    },

    spyOn: function(obj, methodName) {
      return env.spyOn(obj, methodName);
    },

    jsApiReporter: new jasmine.JsApiReporter({
      timer: new jasmine.Timer()
    })
  };

  /* Expose the interface for adding custom equality testers.  */
  jasmine.addCustomEqualityTester = function(tester) {
    env.addCustomEqualityTester(tester);
  };

  /* Expose the interface for adding custom expectation matchers */
  jasmine.addMatchers = function(matchers) {
    return env.addMatchers(matchers);
  };

  /* Expose the mock interface for the JavaScript timeout functions */
  jasmine.clock = function() {
    return env.clock;
  };

	/** ## Runner Parameters
   *
	 * More browser specific code - wrap the query string in an object and to
	 * allow for getting/setting parameters from the runner user interface.
   */
	env.catchExceptions(false);


	/*The `jsApiReporter` also receives spec results, and is used by any
	 * environment that needs to extract the results  from JavaScript. */
	//env.addReporter(jasmineInterface.jsApiReporter);

	env.addReporter(new Console({}));

	/* Filter which specs will be run by matching the start of the full name
	 * against the `spec` query param. */
  env.specFilter = function(spec) {
    return true;
  };


	return {
		jasmine: jasmine,
		env: env,
		jasmineInterface: jasmineInterface
	};
});
