define([], function() {
var matchers = {};

matchers.requireMatchers = function(jRequire, j$) {
  var availableMatchers = [
      "toBe",
      "toBeCloseTo",
      "toBeDefined",
      "toBeFalsy",
      "toBeGreaterThan",
      "toBeLessThan",
      "toBeNaN",
      "toBeNull",
      "toBeTruthy",
      "toBeUndefined",
      "toContain",
      "toEqual",
      "toHaveBeenCalled",
      "toHaveBeenCalledWith",
      "toMatch",
      "toThrow",
      "toThrowError"
    ],
    matchers = {};

  for (var i = 0; i < availableMatchers.length; i++) {
    var name = availableMatchers[i];
    matchers[name] = jRequire[name](j$);
  }

  return matchers;
};


matchers.matchersUtil = function(j$) {
  // TODO: what to do about jasmine.pp not being inject? move to JSON.stringify? gut PrettyPrinter?

  return {
    equals: function(a, b, customTesters) {
      customTesters = customTesters || [];

      return eq(a, b, [], [], customTesters);
    },

    contains: function(haystack, needle, customTesters) {
      customTesters = customTesters || [];

      if (Object.prototype.toString.apply(haystack) === "[object Array]") {
        for (var i = 0; i < haystack.length; i++) {
          if (eq(haystack[i], needle, [], [], customTesters)) {
            return true;
          }
        }
        return false;
      }
      return haystack.indexOf(needle) >= 0;
    },

    buildFailureMessage: function() {
      var args = Array.prototype.slice.call(arguments, 0),
        matcherName = args[0],
        isNot = args[1],
        actual = args[2],
        expected = args.slice(3),
        englishyPredicate = matcherName.replace(/[A-Z]/g, function(s) { return ' ' + s.toLowerCase(); });

      var message = "Expected " +
        j$.pp(actual) +
        (isNot ? " not " : " ") +
        englishyPredicate;

      if (expected.length > 0) {
        for (var i = 0; i < expected.length; i++) {
          if (i > 0) {
            message += ",";
          }
          message += " " + j$.pp(expected[i]);
        }
      }

      return message + ".";
    }
  };

  // Equality function lovingly adapted from isEqual in
  //   [Underscore](http://underscorejs.org)
  function eq(a, b, aStack, bStack, customTesters) {
    var result = true;

    for (var i = 0; i < customTesters.length; i++) {
      var customTesterResult = customTesters[i](a, b);
      if (!j$.util.isUndefined(customTesterResult)) {
        return customTesterResult;
      }
    }

    if (a instanceof j$.Any) {
      result = a.jasmineMatches(b);
      if (result) {
        return true;
      }
    }

    if (b instanceof j$.Any) {
      result = b.jasmineMatches(a);
      if (result) {
        return true;
      }
    }

    if (b instanceof j$.ObjectContaining) {
      result = b.jasmineMatches(a);
      if (result) {
        return true;
      }
    }

    if (a instanceof Error && b instanceof Error) {
      return a.message == b.message;
    }

    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) { return a !== 0 || 1 / a == 1 / b; }
    // A strict comparison is necessary because `null == undefined`.
    if (a === null || b === null) { return a === b; }
    var className = Object.prototype.toString.call(a);
    if (className != Object.prototype.toString.call(b)) { return false; }
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a === 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') { return false; }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) { return bStack[length] == b; }
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack, customTesters))) { break; }
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction(aCtor) && (aCtor instanceof aCtor) &&
        isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = has(b, key) && eq(a[key], b[key], aStack, bStack, customTesters))) { break; }
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (has(b, key) && !(size--)) { break; }
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();

    return result;

    function has(obj, key) {
      return obj.hasOwnProperty(key);
    }

    function isFunction(obj) {
      return typeof obj === 'function';
    }
  }
};

matchers.toBe = function() {
  function toBe() {
    return {
      compare: function(actual, expected) {
        return {
          pass: actual === expected
        };
      }
    };
  }

  return toBe;
};

matchers.toBeCloseTo = function() {

  function toBeCloseTo() {
    return {
      compare: function(actual, expected, precision) {
        if (precision !== 0) {
          precision = precision || 2;
        }

        return {
          pass: Math.abs(expected - actual) < (Math.pow(10, -precision) / 2)
        };
      }
    };
  }

  return toBeCloseTo;
};

matchers.toBeDefined = function() {
  function toBeDefined() {
    return {
      compare: function(actual) {
        return {
          pass: (void 0 !== actual)
        };
      }
    };
  }

  return toBeDefined;
};

matchers.toBeFalsy = function() {
  function toBeFalsy() {
    return {
      compare: function(actual) {
        return {
          pass: !!!actual
        };
      }
    };
  }

  return toBeFalsy;
};

matchers.toBeGreaterThan = function() {

  function toBeGreaterThan() {
    return {
      compare: function(actual, expected) {
        return {
          pass: actual > expected
        };
      }
    };
  }

  return toBeGreaterThan;
};


matchers.toBeLessThan = function() {
  function toBeLessThan() {
    return {

      compare: function(actual, expected) {
        return {
          pass: actual < expected
        };
      }
    };
  }

  return toBeLessThan;
};
matchers.toBeNaN = function(j$) {

  function toBeNaN() {
    return {
      compare: function(actual) {
        var result = {
          pass: (actual !== actual)
        };

        if (result.pass) {
          result.message = "Expected actual not to be NaN.";
        } else {
          result.message = "Expected " + j$.pp(actual) + " to be NaN.";
        }

        return result;
      }
    };
  }

  return toBeNaN;
};

matchers.toBeNull = function() {

  function toBeNull() {
    return {
      compare: function(actual) {
        return {
          pass: actual === null
        };
      }
    };
  }

  return toBeNull;
};

matchers.toBeTruthy = function() {

  function toBeTruthy() {
    return {
      compare: function(actual) {
        return {
          pass: !!actual
        };
      }
    };
  }

  return toBeTruthy;
};

matchers.toBeUndefined = function() {

  function toBeUndefined() {
    return {
      compare: function(actual) {
        return {
          pass: void 0 === actual
        };
      }
    };
  }

  return toBeUndefined;
};

matchers.toContain = function() {
  function toContain(util, customEqualityTesters) {
    customEqualityTesters = customEqualityTesters || [];

    return {
      compare: function(actual, expected) {

        return {
          pass: util.contains(actual, expected, customEqualityTesters)
        };
      }
    };
  }

  return toContain;
};

matchers.toEqual = function() {

  function toEqual(util, customEqualityTesters) {
    customEqualityTesters = customEqualityTesters || [];

    return {
      compare: function(actual, expected) {
        var result = {
          pass: false
        };

        result.pass = util.equals(actual, expected, customEqualityTesters);

        return result;
      }
    };
  }

  return toEqual;
};

matchers.toHaveBeenCalled = function(j$) {

  function toHaveBeenCalled() {
    return {
      compare: function(actual) {
        var result = {};

        if (!j$.isSpy(actual)) {
          throw new Error('Expected a spy, but got ' + j$.pp(actual) + '.');
        }

        if (arguments.length > 1) {
          throw new Error('toHaveBeenCalled does not take arguments, use toHaveBeenCalledWith');
        }

        result.pass = actual.calls.any();

        result.message = result.pass ?
          "Expected spy " + actual.and.identity() + " not to have been called." :
          "Expected spy " + actual.and.identity() + " to have been called.";

        return result;
      }
    };
  }

  return toHaveBeenCalled;
};

matchers.toHaveBeenCalledWith = function(j$) {

  function toHaveBeenCalledWith(util) {
    return {
      compare: function() {
        var args = Array.prototype.slice.call(arguments, 0),
          actual = args[0],
          expectedArgs = args.slice(1),
          result = { pass: false };

        if (!j$.isSpy(actual)) {
          throw new Error('Expected a spy, but got ' + j$.pp(actual) + '.');
        }

        if (!actual.calls.any()) {
          result.message = "Expected spy " + actual.and.identity() + " to have been called with " + j$.pp(expectedArgs) + " but it was never called.";
          return result;
        }

        if (util.contains(actual.calls.allArgs(), expectedArgs)) {
          result.pass = true;
          result.message = "Expected spy " + actual.and.identity() + " not to have been called with " + j$.pp(expectedArgs) + " but it was.";
        } else {
          result.message = "Expected spy " + actual.and.identity() + " to have been called with " + j$.pp(expectedArgs) + " but actual calls were " + j$.pp(actual.calls.allArgs()).replace(/^\[ | \]$/g, '') + ".";
        }

        return result;
      }
    };
  }

  return toHaveBeenCalledWith;
};

matchers.toMatch = function() {

  function toMatch() {
    return {
      compare: function(actual, expected) {
        var regexp = new RegExp(expected);

        return {
          pass: regexp.test(actual)
        };
      }
    };
  }

  return toMatch;
};

matchers.toThrow = function(j$) {

  function toThrow(util) {
    return {
      compare: function(actual, expected) {
        var result = { pass: false },
          threw = false,
          thrown;

        if (typeof actual != "function") {
          throw new Error("Actual is not a Function");
        }

        try {
          actual();
        } catch (e) {
          threw = true;
          thrown = e;
        }

        if (!threw) {
          result.message = "Expected function to throw an exception.";
          return result;
        }

        if (arguments.length == 1) {
          result.pass = true;
          result.message = "Expected function not to throw, but it threw " + j$.pp(thrown) + ".";

          return result;
        }

        if (util.equals(thrown, expected)) {
          result.pass = true;
          result.message = "Expected function not to throw " + j$.pp(expected) + ".";
        } else {
          result.message = "Expected function to throw " + j$.pp(expected) + ", but it threw " +  j$.pp(thrown) + ".";
        }

        return result;
      }
    };
  }

  return toThrow;
};

matchers.toThrowError = function(j$) {
  function toThrowError (util) {
    return {
      compare: function(actual) {
        var threw = false,
          thrown,
          errorType,
          message,
          regexp,
          name,
          constructorName;

        if (typeof actual != "function") {
          throw new Error("Actual is not a Function");
        }

        extractExpectedParams.apply(null, arguments);

        try {
          actual();
        } catch (e) {
          threw = true;
          thrown = e;
        }

        if (!threw) {
          return fail("Expected function to throw an Error.");
        }

        if (!(thrown instanceof Error)) {
          return fail("Expected function to throw an Error, but it threw " + thrown + ".");
        }

        if (arguments.length == 1) {
          return pass("Expected function not to throw an Error, but it threw " + fnNameFor(thrown) + ".");
        }

        if (errorType) {
          name = fnNameFor(errorType);
          constructorName = fnNameFor(thrown.constructor);
        }

        if (errorType && message) {
          if (thrown.constructor == errorType && util.equals(thrown.message, message)) {
            return pass("Expected function not to throw " + name + " with message \"" + message + "\".");
          } else {
            return fail("Expected function to throw " + name + " with message \"" + message +
                        "\", but it threw " + constructorName + " with message \"" + thrown.message + "\".");
          }
        }

        if (errorType && regexp) {
          if (thrown.constructor == errorType && regexp.test(thrown.message)) {
            return pass("Expected function not to throw " + name + " with message matching " + regexp + ".");
          } else {
            return fail("Expected function to throw " + name + " with message matching " + regexp +
                        ", but it threw " + constructorName + " with message \"" + thrown.message + "\".");
          }
        }

        if (errorType) {
          if (thrown.constructor == errorType) {
            return pass("Expected function not to throw " + name + ".");
          } else {
            return fail("Expected function to throw " + name + ", but it threw " + constructorName + ".");
          }
        }

        if (message) {
          if (thrown.message == message) {
            return pass("Expected function not to throw an exception with message " + j$.pp(message) + ".");
          } else {
            return fail("Expected function to throw an exception with message " + j$.pp(message) +
                        ", but it threw an exception with message " + j$.pp(thrown.message) + ".");
          }
        }

        if (regexp) {
          if (regexp.test(thrown.message)) {
            return pass("Expected function not to throw an exception with a message matching " + j$.pp(regexp) + ".");
          } else {
            return fail("Expected function to throw an exception with a message matching " + j$.pp(regexp) +
                        ", but it threw an exception with message " + j$.pp(thrown.message) + ".");
          }
        }

        function fnNameFor(func) {
            return func.name || func.toString().match(/^\s*function\s*(\w*)\s*\(/)[1];
        }

        function pass(notMessage) {
          return {
            pass: true,
            message: notMessage
          };
        }

        function fail(message) {
          return {
            pass: false,
            message: message
          };
        }

        function extractExpectedParams() {
          if (arguments.length == 1) {
            return;
          }

          if (arguments.length == 2) {
            var expected = arguments[1];

            if (expected instanceof RegExp) {
              regexp = expected;
            } else if (typeof expected == "string") {
              message = expected;
            } else if (checkForAnErrorType(expected)) {
              errorType = expected;
            }

            if (!(errorType || message || regexp)) {
              throw new Error("Expected is not an Error, string, or RegExp.");
            }
          } else {
            if (checkForAnErrorType(arguments[1])) {
              errorType = arguments[1];
            } else {
              throw new Error("Expected error type is not an Error.");
            }

            if (arguments[2] instanceof RegExp) {
              regexp = arguments[2];
            } else if (typeof arguments[2] == "string") {
              message = arguments[2];
            } else {
              throw new Error("Expected error message is not a string or RegExp.");
            }
          }
        }

        function checkForAnErrorType(type) {
          if (typeof type !== "function") {
            return false;
          }

          var Surrogate = function() {};
          Surrogate.prototype = type.prototype;
          return (new Surrogate()) instanceof Error;
        }
      }
    };
  }

  return toThrowError;
};

return matchers;

});
