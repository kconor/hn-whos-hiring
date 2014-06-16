/* jshint -W097 */
"use strict";
/*
Copyright (c) 2008-2013 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

define(["./Spec", 
        "./Env",
        "./CallTracker",
				"./QueueRunner",
				"./Suite",
				"./Matchers",
				"./Base",
				"./Timer",
				"./Clock",
				"./DelayedFunctionScheduler",
				"./Spy",
				"./ReportDispatcher",
				"./PP",
				"./Expectation",
				"./ObjectContaining",
				"./Any",
				"./Util",
				"./JsApiReporter",
				"./ExceptionFormatter",
				"./Core"], 
				
function(Spec,
				Env,
				CallTracker,
				QueueRunner,
				Suite,
				Matchers,
        Base,
				Timer,
				Clock,
				DelayedFunctionScheduler,
				Spy,
				ReportDispatcher,
				PP,
				Expectation,
				ObjectContaining,
				Any,
				Util,
				JsApiReporter,
				ExceptionFormatter,
				Core) 
{

var jasmine = {};

/*
 * Similar to pythons dict.update(other dict).
 * Copies the attributes from otherObj to this.
 *
 * @param {object}
 */
jasmine.update = function(otherObj) {
	for (var key in otherObj) {
		if (key in this) {
			throw new Error("duplicate key!");
		} else {
			this[key] = otherObj[key];
		}
	}
};


jasmine.update(Core);
jasmine.update(Base);
jasmine.update(Util);
jasmine.update(Spec);
jasmine.update(Env);
jasmine.update(JsApiReporter);
jasmine.update(Any);
jasmine.update(CallTracker);
jasmine.update(Clock);
jasmine.update(DelayedFunctionScheduler);
jasmine.update(ExceptionFormatter);
jasmine.update(Expectation);
jasmine.update(ObjectContaining);
jasmine.update(PP);
jasmine.update(QueueRunner);
jasmine.update(Spy);
jasmine.update(ReportDispatcher);
jasmine.update(Suite);
jasmine.update(Matchers);
jasmine.update(Timer);

jasmine.version = function() {
  return "2.0.0";
};

	return jasmine;
});
