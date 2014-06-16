define(["./CallTracker"], function(CallTracker) {
	function _SpyStrategy() {
		function SpyStrategy(options) {
			options = options || {};

			var identity = options.name || "unknown",
					originalFn = options.fn || function() {},
					getSpy = options.getSpy || function() {},
					plan = function() {};

			this.identity = function() {
				return identity;
			};

			this.exec = function() {
				return plan.apply(this, arguments);
			};

			this.callThrough = function() {
				plan = originalFn;
				return getSpy();
			};

			this.returnValue = function(value) {
				plan = function() {
					return value;
				};
				return getSpy();
			};

			this.throwError = function(something) {
				var error = (something instanceof Error) ? something : new Error(something);
				plan = function() {
					throw error;
				};
				return getSpy();
			};

			this.callFake = function(fn) {
				plan = fn;
				return getSpy();
			};

			this.stub = function(fn) {
				plan = function() {};
				return getSpy();
			};
		}

		return SpyStrategy;
	}

	function createSpy(name, originalFn) {

		var spyStrategy = new SpyStrategy({
				name: name,
				fn: originalFn,
				getSpy: function() { return spy; }
			}),
			callTracker = new CallTracker.CallTracker(),
			spy = function() {
				callTracker.track({
					object: this,
					args: Array.prototype.slice.apply(arguments)
				});
				return spyStrategy.exec.apply(this, arguments);
			};

		for (var prop in originalFn) {
			if (prop === 'and' || prop === 'calls') {
				throw new Error("Jasmine spies would overwrite the 'and' and 'calls' properties on the object being spied upon");
			}

			spy[prop] = originalFn[prop];
		}

		spy.and = spyStrategy;
		spy.calls = callTracker;

		return spy;
	}

	function isSpy(putativeSpy) {
		if (!putativeSpy) {
			return false;
		}
		return putativeSpy.and instanceof j$.SpyStrategy &&
			putativeSpy.calls instanceof j$.CallTracker;
	}

	function createSpyObj(baseName, methodNames) {
		if (!j$.isArray_(methodNames) || methodNames.length === 0) {
			throw "createSpyObj requires a non-empty array of method names to create spies for";
		}
		var obj = {};
		for (var i = 0; i < methodNames.length; i++) {
			obj[methodNames[i]] = j$.createSpy(baseName + '.' + methodNames[i]);
		}
		return obj;
	}

	return {
		SpyStrategy: _SpyStrategy,
		isSpy: isSpy,
		createSpyObj: createSpyObj
	};
});
