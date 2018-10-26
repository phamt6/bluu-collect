/* global unescape, analytics */

/**
 * The analytics.utils module provides functionality for generic utilities and browser polyfills
 * @namespace
 */
analytics.utils = (function() {
	// Constants
	// var MODULE = '[utils]';

	var DEVICE_ANDROID = 'android';
	var DEVICE_ANDROIDTABLET = 'androidtablet';
	var DEVICE_IOS = 'ios';
	var DEVICE_IPAD = 'ipad';
	var DEVICE_DESKTOP = 'desktop';
	var DEVICE_OTHERMOBILE = 'othermobile';
	var DEVICE_OTHERTABLET = 'othertablet';
	var DEVICE_WINDOWSPHONE = 'windowsphone';
	var DEVICE_WINDOWSTABLET = 'windowstablet';

	/**
	 * Parse uri options
	 * @type {Object}
	 */
	var _parseUri = {
		strictMode: false,
		key: [
			'source',
			'protocol',
			'authority',
			'userInfo',
			'user',
			'password',
			'host',
			'port',
			'relative',
			'path',
			'directory',
			'file',
			'query',
			'anchor'
		],
		queryKey: {
			name: 'queryKey',
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose: /^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#/]*\.[^?#/.]+(?:[?#]|$)))*\/?)?([^?#/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};

	return {
		each: each,
		entries: entries,
		every: every,
		filter: filter,
		find: find,
		keys: keys,
		map: map,
		reduce: reduce,
		some: some,
		values: values,
		isArray: isArray,
		isBoolean: isBoolean,
		isDate: isDate,
		isEmpty: isEmpty,
		isFunction: isFunction,
		isNil: isNil,
		isNumber: isNumber,
		isNumeric: isNumeric,
		isObject: isObject,
		isPositiveInteger: isPositiveInteger,
		isString: isString,
		arrayFrom: arrayFrom,
		clone: clone,
		extend: extend,
		addQueryString: addQueryString,
		getLocationFromUrl: getLocationFromUrl,
		matchStringUrls: matchStringUrls,
		parseUri: parseUri,
		getDateFromContextFormat: getDateFromContextFormat,
		getDateInContextFormat: getDateInContextFormat,
		getTargetGroupsFromCookie: getTargetGroupsFromCookie,
		addClassName: addClassName,
		getClassNames: getClassNames,
		hasClassName: hasClassName,
		removeClassName: removeClassName,
		getIEVersion: getIEVersion,
		getByDotString: getByDotString,
		getTimestamp: getTimestamp,
		isDesktop: isDesktop,
		isDevice: isDevice,
		isMobile: isMobile,
		isTablet: isTablet,
		setInterval: setIntervalFn,
		setTimeout: setTimeoutFn,
		waitFor: waitFor,
		inArray: inArray,
		indexOf: indexOf,
		uniq: uniq,
		escapeRegExp: escapeRegExp,
		pad: pad,
		subs: subs,
		trim: trim,
		trimInside: trimInside,

		// @deprecated as of Jefferson Park
		// addStyles: analytics.deprecate('analytics.utils.addStyles', 'analytics.domElements.addStyles', analytics.domElements.addStyles)
	};

	// COLLECTIONS

	/**
	 * Iterate over either an array or object
	 * Polyfill for Array.prototype.forEach
	 *
	 * @summary jQuery.each, Array.prototype.forEach, _.forEach
	 *
	 * @example
	 * analytics.utils.each([1, 2, 3], function (value, index) {
	 *     analytics.console.log(index, value);
	 * });
	 *
	 * @example
	 * analytics.utils.each({foo:'bar', baz:'bar'}, function (value, key) {
	 *     analytics.console.log(key, value);
	 * });
	 *
	 * @example
	 * var utils = {
	 *     power: function (base, exponent) {
	 *         return Math.pow(base, exponent);
	 *     }
	 * };
	 *
	 * analytics.utils.each([1, 2, 3], function (value, index) {
	 *     // "this" references the utils object where the function "power" is available
	 *     analytics.console.log(index, value, this.power(value));
	 * }, utils);
	 *
	 * @example
	 * analytics.utils.each({foo:'bar', baz:'bar'}, function (value, key) {
	 *     // "this" references the global object where the built-in String object is available
	 *     analytics.console.log(key, value, this.String.prototype.toUpperCase.call(value));
	 * });
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to iterate over
	 * @param {Function} iterator Iterator function. Passes the arguments value, index/key and array/object reference
	 * @param {Object} [context] Optional context to use as "this" when invoking the iterator function
	 * @returns {void}
	 */
	function each(obj, iterator, context) {
		_forEach(obj, iterator, context);
	}

	/**
	 * Polyfill for Object.prototype.entries
	 *
	 * @summary Array.prototype.entries, Object.entries
	 *
	 * @example
	 * analytics.utils.entries([1, 2, 3]); // [[0, 1], [1, 2], [2, 3]]
	 *
	 * @example
	 * analytics.utils.entries({foo:'bar'}); // [['foo', 'bar']]
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to get the entries of
	 * @returns {Array} An array of arrays, that contain the key and value of each entry
	 */
	function entries(obj) {
		return map(obj, function(value, key) {
			return [key, value];
		});
	}

	/**
	 * Polyfill for Array.prototype.every
	 *
	 * @summary Array.prototype.every, _.every
	 *
	 * @example
	 * analytics.utils.every([1, 2, 3], function (value) { // true
	 *     return value > 0;
	 * });
	 *
	 * @example
	 * analytics.utils.every([1, 2, 3], function (value) { // false
	 *     return value !== 1 && value !== 2;
	 * });
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to iterate over
	 * @param {Function} predicate Predicate function that tests whether the value exists. Passes the arguments value, index/key and array/object
	 * @param {Object} [context] Optional context to use as "this" when invoking the predicate function
	 * @returns {boolean} True, all values match the predicate; otherwise, false
	 */
	function every(obj, predicate, context) {
		var hasEvery = true;
		_forEach(obj, function(value, index, obj) {
			if (!predicate.call(context, value, index, obj)) {
				hasEvery = false;
				return false;
			}

			return true;
		}, context, 0, true);

		return hasEvery;
	}

	/**
	 * Polyfill for Array.prototype.filter
	 *
	 * @summary jQuery.grep, Array.prototype.filter, _.filter
	 *
	 * @example
	 * analytics.utils.filter([1, 2, 3], function (value) { // [2]
	 *     // Return true to add to the filtered array
	 *     return value % 2 === 0;
	 * });
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to iterate over
	 * @param {Function} predicate Predicate function that determines whether to add to the filtered array. Passes the arguments value, index/key and array/object reference
	 * @param {Object} [context] Optional context to use as "this" when invoking the predicate function
	 * @returns {Array} Filtered array; otherwise, an empty array
	 */
	function filter(obj, predicate, context) {
		var filtered = [];
		_forEach(obj, function(value, index, obj) {
			if (predicate.call(context, value, index, obj)) {
				filtered.push(value);
			}
		});

		return filtered;
	}

	/**
	 * Polyfill for Array.prototype.find
	 *
	 * @summary Array.prototype.find, _.find
	 *
	 * @example
	 * analytics.utils.find([1, 2, 3], function (value) { // 2
	 *     return value === 2;
	 * });
	 *
	 * @example
	 * analytics.utils.find({foo:'bar', baz:'bar'}, function (value, key) { // 'bar'
	 *      return key === 'baz';
	 * });
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to iterate over
	 * @param {Function} predicate Predicate function that determines whether to return the match. Passes the arguments value, index/key and array/object reference
	 * @param {Object} [context] Optional context to use as "this" when invoking the predicate function
	 * @returns {*} First matching item; otherwise, undefined on matching item not found
	 */
	function find(obj, predicate, context) {
		var match = undefined;
		_forEach(obj, function(value, index, obj) {
			if (predicate.call(context, value, index, obj)) {
				match = value;
				return false;
			}

			return true;
		}, context, 0, true);

		return match;
	}

	/**
	 * Polyfill for Object.prototype.keys
	 *
	 * @summary Object.prototype.keys, _.keys
	 *
	 * @example
	 * analytics.utils.keys({foo:'bar', baz:'bar'}); // ['foo', 'baz']
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to get the keys of
	 * @returns {Array} An array of keys; otherwise, an empty array
	 */
	function keys(obj) {
		return map(obj, function(value, key) {
			return String(key);
		});
	}

	/**
	 * Polyfill for Array.prototype.map
	 *
	 * @summary jQuery.map, Array.prototype.map, _.map
	 *
	 * @example
	 * analytics.utils.map([1, 2, 3], function (value, index) { // [0, 2, 6]
	 *     return value * index;
	 * });
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to map
	 * @param {Function} fn A function that maps each value in the array/object. Passes the arguments value, index/key and array/object reference
	 * @param {Object} [context] Optional context to use as "this" when invoking the iterator function
	 * @returns {Array} Mapped array; otherwise, an empty array
	 */
	function map(obj, fn, context) {
		var mapped = [];
		_forEach(obj, function(value, index, obj) {
			mapped.push(fn.call(context, value, index, obj));
		});

		return mapped;
	}

	/**
	 * Polyfill for Array.prototype.reduce
	 *
	 * @summary Array.prototype.reduce, _.reduce
	 *
	 * @example
	 * analytics.utils.reduce([1, 2, 3], function (sum, value) { // 6
	 *     return sum + value;
	 * }, 0);
	 *
	 * @memberof analytics.utils
	 * @param {Array} obj Array or object to reduce
	 * @param {Function} fn A function to execute on each value in the array/object. Passes the arguments previous value, current value, index/key and array/object reference
	 * @param {*} [initial] Optional initial value
	 * @param {Object} [context] Optional context to use as "this" when invoking the iterator function
	 * @returns {*} Reduced value; otherwise, the inital value or undefined
	 */
	function reduce(obj, fn, initial, context) {
		var noInitial = initial === undefined;
		_forEach(obj, function(value, index, obj) {
			if (noInitial) {
				noInitial = false;
				initial = value;
			} else {
				initial = fn.call(context, initial, value, index, obj);
			}
		});

		return initial;
	}

	/**
	 * Polyfill for Array.prototype.some
	 *
	 * @summary Array.prototype.some, _.some
	 *
	 * @example
	 * analytics.utils.some([1, 2, 3], function (value) { // true
	 *     return value > 0;
	 * });
	 *
	 * @example
	 * analytics.utils.some([1, 2, 3], function (value) { // false
	 *     return value === 0;
	 * });
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to iterate over
	 * @param {Function} predicate Predicate function that tests whether the value exists. Passes the arguments value, index/key and array/object reference
	 * @param {Object} [context] Optional context to use as "this" when invoking the predicate function
	 * @returns {boolean} True, some values match the predicate function; otherwise, false
	 */
	function some(obj, predicate, context) {
		var hasSome = false;
		_forEach(obj, function(value, index, obj) {
			if (predicate.call(context, value, index, obj)) {
				hasSome = true;
				return false;
			}

			return true;
		}, context, 0, true);

		return hasSome;
	}

	/**
	 * Polyfill for Object.prototype.values
	 *
	 * @summary Object.values, _.values
	 *
	 * @example
	 * analytics.utils.values([1, 2, 3]); // [1, 2, 3]
	 *
	 * @example
	 * analytics.utils.values({foo:'bar'}); // ['bar']
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} obj Array or object to get the values of
	 * @returns {Array} An array of values; otherwise, an empty array
	 */
	function values(obj) {
		return map(obj, function(value) {
			return value;
		});
	}

	// IS CHECKS

	/**
	 * Check if a variable is an array
	 *
	 * @summary jQuery.isArray, Array.isArray, _.isArray
	 *
	 * @example
	 * analytics.utils.isArray([1, 2, 3]);
	 *
	 * @example
	 * analytics.utils.isArray(null);
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is an array; otherwise, false
	 */
	function isArray(obj) {
		return Array.isArray(obj);
	}

	/**
	 * Check if a variable is a boolean
	 *
	 * @summary _.isBoolean
	 *
	 * @example
	 * analytics.utils.isBoolean(true); // true
	 *
	 * @example
	 * analytics.utils.isBoolean('true'); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is a boolean; otherwise, false
	 */
	function isBoolean(obj) {
		return typeof obj === 'boolean' || Object.prototype.toString.call(obj) === '[object Boolean]';
	}

	/**
	 * Check if a variable is a date
	 *
	 * @summary _.isDate
	 *
	 * @example
	 * var now = Date.now();
	 * analytics.utils.isDate(now); // true
	 *
	 * @example
	 * analytics.utils.isDate(true); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is a date; otherwise, false
	 */
	function isDate(obj) {
		return Object.prototype.toString.call(obj) === '[object Date]';
	}

	/**
	 * Check if a variable is empty
	 *
	 * @summary jQuery.isEmptyObject, _.isEmpty
	 *
	 * @example
	 * analytics.utils.isEmpty(null); // true
	 *
	 * @example
	 * analytics.utils.isEmpty(undefined); // true
	 *
	 * @example
	 * analytics.utils.isEmpty({}); // true
	 *
	 * @example
	 * analytics.utils.isEmpty([]); // true
	 *
	 * @example
	 * analytics.utils.isEmpty(''); // true
	 *
	 * @example
	 * analytics.utils.isEmpty([1, 2, 3]); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is empty; otherwise, false
	 */
	function isEmpty(obj) {
		if (isNil(obj)) {
			return true;
		}

		if (_isArrayLike(obj) || isString(obj)) {
			return obj.length === 0;
		}

		return keys(obj).length === 0;
	}

	/**
	 * Check if a variable is a function
	 *
	 * @summary jQuery.isFunction, _.isFunction
	 *
	 * @example
	 * analytics.utils.isFunction(analytics.utils.isFunction); // true
	 *
	 * @example
	 * analytics.utils.isFunction(null); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is a function; otherwise, false
	 */
	function isFunction(obj) {
		return typeof obj === 'function' || Object.prototype.toString.call(obj) === '[object Function]';
	}

	/**
	 * Check if a variable is either null or undefined
	 *
	 * @summary _.isNil
	 *
	 * @example
	 * analytics.utils.isNil(null); // true
	 *
	 * @example
	 * analytics.utils.isNil(undefined); // true
	 *
	 * @example
	 * analytics.utils.isNil(''); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is either null or undefined; otherwise, false
	 */
	function isNil(obj) {
		return obj === null || obj === undefined;
	}

	/**
	 * Check if a variable is a number
	 *
	 * @summary _.isNumber
	 *
	 * @example
	 * analytics.utils.isNumber(99); // true
	 *
	 * @example
	 * analytics.utils.isNumber('99'); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is a number; otherwise, false
	 */
	function isNumber(obj) {
		return typeof obj === 'number' || Object.prototype.toString.call(obj) === '[object Number]';
	}

	/**
	 * Check if a variable (string or number datatype) is numerical
	 *
	 * @summary jQuery.isNumeric, _.isNumeric
	 *
	 * @example
	 * analytics.utils.isNumeric(99); // true
	 *
	 * @example
	 * analytics.utils.isNumeric('99'); // true
	 *
	 * @example
	 * analytics.utils.isNumeric('ninety-nine'); // false
	 *
	 * @memberof analytics.utils
	 * @param {(number|string)} obj Variable to check
	 * @returns {boolean} True, the variable is numerical; otherwise, false
	 */
	function isNumeric(obj) {
		return (isNumber(obj) || isString(obj)) && !isNaN(obj - parseFloat(obj));
	}

	/**
	 * Check if a variable is an object
	 *
	 * @summary jQuery.isPlainObject, _.isObject
	 *
	 * @example
	 * analytics.utils.isObject({foo:'bar'}); // true
	 *
	 * @example
	 * analytics.utils.isObject(function() {}); // true
	 *
	 * @example
	 * analytics.utils.isObject(null); // true
	 *
	 * @example
	 * analytics.utils.isObject(undefined); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is an object; otherwise, false
	 */
	function isObject(obj) {
		return obj === Object(obj);
	}

	/**
	 * Check if a string is a positive number
	 * @see http://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
	 *
	 * @example
	 * analytics.utils.isPositiveInteger('99'); // true
	 *
	 * @example
	 * analytics.utils.isPositiveInteger(99); // false
	 *
	 * @memberof analytics.utils
	 * @param {string} str String to check
	 * @returns {boolean} True, the string is a positive number; otherwise, false
	 */
	function isPositiveInteger(str) {
		var value = ~~Number(str); // eslint-disable-line no-bitwise
		return String(value) === str && value > 0;
	}

	/**
	 * Check if a variable is a string
	 *
	 * @summary _.isString
	 *
	 * @example
	 * analytics.utils.isString('some-string'); // true
	 *
	 * @example
	 * analytics.utils.isString(null); // false
	 *
	 * @memberof analytics.utils
	 * @param {*} obj Variable to check
	 * @returns {boolean} True, the variable is a string; otherwise, false
	 */
	function isString(obj) {
		return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
	}

	// CLONING/EXTENDING/SERIALIZING

	/**
	 * Create a new array from instance from an array-like or iterable object
	 *
	 * @summary jQuery.makeArray, Array.from, _.toArray
	 *
	 * @example
	 * var array = [1, 2, 3];
	 * var newArray = analytics.utils.arrayFrom(array);
	 * analytics.console.log(array !== newArray); // prints true
	 *
	 * @example
	 * var elements = document.querySelectorAll('a');
	 * var arrayElements = analytics.utils.arrayFrom(elements);
	 * analytics.console.log(arrayElements); // prints an array of element nodes
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Object)} arrayLike An array-like or iterable object to convert to an array
	 * @param {Function} [mapFn] Optional map function to call on every element of the array
	 * @param {Object} [context] Optional context to use as "this" when invoking the mapping function
	 * @returns {Array} New array
	 */
	function arrayFrom(arrayLike, mapFn, context) {
		if (!_isArrayLike(arrayLike)) {
			return [];
		}

		return isFunction(mapFn) ? map(arrayLike, mapFn, context) : values(arrayLike);
	}


	/**
	 * Create a deep-cloned duplicate of an object or a clone of primitive value
	 * The function clones, arrays, Dates, primitive values and plain objects
	 *
	 * @summary _.clone
	 *
	 * @example
	 * analytics.utils.clone({foo:'bar'}); // {foo:'bar'}
	 *
	 * @example
	 * analytics.utils.clone('some-string'); // 'some-string'
	 *
	 * @memberof analytics.utils
	 * @param {Object} obj Object or primitive value to clone
	 * @returns {Object} Cloned object or primitive value
	 */
	function clone(obj) {
		if (!isObject(obj)) {
			return obj;
		}

		if (isArray(obj)) {
			return map(obj, function(value) {
				return clone(value);
			});
		}

		if (isDate(obj)) {
			return new Date(obj.getTime());
		}

		var target = {};
		_forEach(obj, function(value, key) {
			target[key] = clone(value);
		});

		return target;
	}

	/**
	 * Extend an object with one or more objects passed as arguments.
	 * Note: Mutates to the target object
	 *
	 * @summary $.extend, Object.assign, _.assign
	 *
	 * @example
	 * analytics.utils.extend({foo:'bar'}, {baz:'bar'}); // {foo:'bar', baz:'bar'}
	 *
	 * @memberof analytics.utils
	 * @param {Object} target Target object to extend
	 * @param {...Object} sources Objects to extend with
	 * @returns {Object} Returns a reference to the original extended object
	 */
	function extend(target) {
		// The following is used, because the first argument is skipped
		_forEach(arguments, function(arg) {
			_forEach(arg, function(value, key) {
				target[key] = value;
			});
		}, undefined, 1);

		return target;
	}

	// PATHS/URLS

	/**
	 * Add a query parameters to an existing URL using an object of key/value pairs
	 *
	 * @example
	 * var params = {foo:'bar', baz: 'bar'};
	 * analytics.utils.addQueryString('http://example.url', params); // http://example.url?foo=bar&baz=bar
	 *
	 * @memberof analytics.utils
	 * @param {string} url URL string
	 * @param {Object} params Object of key/value pairs to serialize to a query parameter string
	 * @returns {string} URL string with the serialized query parameters string concatanated
	 */
	function addQueryString(url, params) {
		params = map(params, function(value, name) {
			if (isObject(value)) {
				analytics.console.error('Invalid value, arrays or objects should ideally be serialized beforehand', value, name, url, params);
			}

			return encodeURIComponent(name) + '=' + encodeURIComponent(value);
		});

		if (params.length === 0) {
			return url;
		}

		var reHasQueryParams = /\?/;
		var seperator = reHasQueryParams.test(url) ? '&' : '?';

		return url + seperator + params.join('&');
	}

	/**
	 * Get a location object from a URL string
	 *
	 * @example
	 * analytics.utils.getLocationFromUrl('http://example.url') // {anchor:'',host:'example.url',params:{},path:'',queryVariables:{}}
	 *
	 * @memberof analytics.utils
	 * @param {string} url URL string to parse
	 * @returns {Object} Current location object with properties 'anchor', 'host', 'params', 'path' and 'queryVariables'
	 */
	function getLocationFromUrl(url) {
		var obj = {
			anchor: '',
			host: '',
			params: {},
			path: '',
			queryVariables: {}
		};

		if (isNil(url) || String(url).length === 0) {
			return obj;
		}

		var parsed = parseUri(url);
		if (parsed.anchor) {
			try {
				obj.anchor = decodeURIComponent(parsed.anchor);
			} catch (ex) {
				// Invalid URL anchors must be supported
				obj.anchor = parsed.anchor;
			}
		}

		obj.host = parsed.host;

		// Try to decode the query param(s) to a string
		_forEach(parsed.queryKey, function(value, key) {
			try {
				key = decodeURIComponent(key);
				value = decodeURIComponent(value);
				obj.params[key] = value;
			} catch (ex) {
				// Invalid URL parameters must be supported
				obj.params[key] = value;
			}
		});

		// Try to decode the path to a string
		try {
			obj.path = decodeURIComponent(parsed.path);
		} catch (ex) {
			// Invalid URL paths must be supported
			obj.path = parsed.path;
		}

		obj.queryVariables = parsed.queryKey;

		return obj;
	}

	/**
	 * Prepares comparable formats from rule definitions and element URLs, then
	 * compares them through the evaluator. In this comparison, the host also counts,
	 * regardless of the protocol or www.
	 *
	 * @ignore
	 * @memberof analytics.utils
	 * @param {string} matcher The matcher used for uri path
	 * @param {string} urlDefinition The definition which the current URL has to match
	 * @param {string} elementUrl Complete URL e.g. protocol://domain/uri
	 * @returns {boolean} True, the URLs match; otherwise, false
	 */
	function matchStringUrls(matcher, urlDefinition, elementUrl) {
		// If the host is not defined, we have to add current URL's, since
		// the element URL will always contain it and external URLs are
		// also possible
		if (/^\//.test(urlDefinition)) {
			urlDefinition = _getCurrentDomain() + urlDefinition;
		}

		var definitionLocation = getLocationFromUrl(urlDefinition);

		// Since definition is always a single string, we have to use matchExact for these
		var queryParams = {};
		_forEach(definitionLocation.queryVariables, function(value, key) {
			queryParams[key] = ['matchExact', value];
		});

		var anchor = {
			anchor: definitionLocation.anchor,
			matcher: 'matchExact'
		};

		var reHostCanonizer = /^www\./;
		var elementLocation = getLocationFromUrl(elementUrl);
		var hostMatches = definitionLocation.host.toLowerCase().replace(reHostCanonizer, '') === elementLocation.host.toLowerCase().replace(reHostCanonizer, '');

		return hostMatches && analytics.evaluator.matchUrl(matcher, definitionLocation.path, queryParams, anchor, elementLocation);
	}

	/**
	 * @memberof analytics.utils
	 * @typedef {Object} URI
	 * @property {string} anchor Anchor string
	 * @property {string} authority Authority string
	 * @property {string} directory Directory part
	 * @property {string} file File part
	 * @property {string} host Host part
	 * @property {string} password Password part
	 * @property {string} port Port number
	 * @property {string} protocol Protocol part
	 * @property {string} query Query string
	 * @property {Object} queryKey Object of key/value pairs for the query string
	 * @property {string} relative Relative string
	 * @property {string} user User string
	 * @property {string} userInfo User info string
	 */

	/**
	 * Parse a URI into formed parts
	 * @see http://blog.stevenlevithan.com/archives/parseuri
	 *
	 * @example
	 * analytics.utils.parseUri('http://example.url');
	 *
	 * @example
	 * analytics.utils.parseUri('http://example.url?frosmotest=on');
	 *
	 * @memberof analytics.utils
	 * @param {string} str URI string to parse
	 * @returns {analytics.utils.URI} Parsed URI object
	 */
	function parseUri(str) {
		str = _replaceReservedChars(str);

		var i = 14;
		var uri = {};
		var match = _parseUri.parser[_parseUri.strictMode ? 'strict' : 'loose'].exec(str);

		while ((i - 1) > 0) {
			i -= 1;
			uri[_parseUri.key[i]] = match[i] || '';
		}

		uri[_parseUri.queryKey.name] = {};

		// 12 is related to "file"
		uri[_parseUri.key[12]].replace(_parseUri.queryKey.parser, function($0, $1, $2) {
			if ($1) {
				uri[_parseUri.queryKey.name][$1] = $2;
			}
		});

		return uri;
	}

	// CONTEXT

	/**
	 * Create a date object from a formatted date string as "YYYYMMDD"
	 *
	 * @example
	 * analytics.utils.getDateFromContextFormat('20160101'); // Fri Jan 01 2016 00:00:00 GMT+0200 (FLE Standard Time)
	 *
	 * @throws {Error} If an invalid or empty string is passed
	 * @memberof analytics.utils
	 * @param {string} str Formatted date string as "YYYYMMDD"
	 * @returns {Date} Created date object
	 */
	function getDateFromContextFormat(str) {
		if (!isString(str) || str.length !== 8) {
			throw new Error('Invalid argument, expected string with a length of 8 characters');
		}

		var year = parseInt(str.substring(0, 4), 10);
		var month = parseInt(str.substring(4, 6), 10) - 1;
		var day = parseInt(str.substring(6, 8), 10);

		return new Date(year, month, day, 0, 0, 0, 0);
	}

	/**
	 * Create a formatted date string as "YYYYMMDD" from a date object
	 *
	 * @example
	 * analytics.utils.getDateInContextFormat(new Date());
	 *
	 * @throws {Error} If an invalid date is passed
	 * @memberof analytics.utils
	 * @param {Date} date Date object to format
	 * @returns {string} Formatted date string as "YYYYMMDD"
	 */
	function getDateInContextFormat(date) {
		if (!isDate(date)) {
			throw new Error('Invalid argument, date object expected');
		}

		var year = date.getFullYear();
		var month = pad(date.getMonth() + 1, '0', 2);
		var day = pad(date.getDate(), '0', 2);

		return String(year) + String(month) + String(day);
	}

	/**
	 * This is a direct copy from emediate.js (used by otavamedia) getKeywords function
	 *
	 * @memberof analytics.utils
	 * @returns {Array} Array of target groups
	 */
	function getTargetGroupsFromCookie() {
		var reGetKeywords = /frosmo_keywords=([^;$]+)/;
		var match = document.cookie.match(reGetKeywords);
		if (match) {
			var keywords = unescape(match[1]).split('.');
			return filter(keywords, function(keyword) {
				return keyword.length > 0;
			});
		}

		return [];
	}

	// CLASSES

	/**
	 * Add class name(s) to an element node
	 *
	 * @summary jQuery.fn.addClass, Element.prototype.classList.add
	 *
	 * @example
	 * var el = analytics.domElements.selector('a')[0];
	 * analytics.utils.addClassName(el, 'some-class');
	 *
	 * @example
	 * var el = analytics.domElements.selector('p.first-class')[0];
	 * analytics.utils.addClassName(el, 'some-class some-other-class');
	 *
	 * @example
	 * var el = analytics.domElements.selector('body')[0];
	 * analytics.utils.addClassName(el, ['some-class', 'some-other-class']);
	 *
	 * @example
	 * var els = analytics.domElements.selector('a');
	 * analytics.utils.addClassName(els, ['some-class', 'some-other-class']);
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Element)} els Either an array of element node(s) or a single element node
	 * @param {(Array|string)} classNames Either an array of class name(s) or a string of class name(s) separated by a white-space character
	 * @returns {void}
	 */
	function addClassName(els, classNames) {
		_forEach(_getElementsArray(els), function(el) {
			var elClassNames = uniq(getClassNames(el), _getClassesArray(classNames));
			el.setAttribute('class', elClassNames.join(' '));
		});
	}

	/**
	 * Get an array of class names to an element node
	 *
	 * @example
	 * var el = analytics.domElements.selector('a')[0];
	 * analytics.utils.getClassNames(el);
	 *
	 * @memberof analytics.utils
	 * @param {Element} el Element node
	 * @returns {Array} Array of class names; otherwise, an empty array on error
	 */
	function getClassNames(el) {
		if (_isElementNode(el)) {
			var elClassNames = el.getAttribute('class');
			if (elClassNames) {
				// Strip and collapse white-space according to HTML spec (idea from jQuery)
				// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
				return elClassNames.match(/[^\x20\t\r\n\f]+/g) || [];
			}
		}

		return [];
	}

	/**
	 * Check if class name(s) exists in an element node
	 *
	 * @summary jQuery.fn.hasClass, Element.prototype.classList.contains
	 *
	 * @example
	 * var el = analytics.domElements.selector('a')[0];
	 * analytics.utils.hasClassName(el, 'some-class');
	 *
	 * @example
	 * var el = analytics.domElements.selector('p.first-class')[0];
	 * analytics.utils.hasClassName(el, 'some-class some-other-class');
	 *
	 * @example
	 * var el = analytics.domElements.selector('body')[0];
	 * analytics.utils.hasClassName(el, ['some-class', 'some-other-class']);
	 *
	 * @memberof analytics.utils
	 * @param {Element} el Element node
	 * @param {(Array|string)} classNames Either an array of class name(s) or a string of class name(s) separated by a white-space character
	 * @returns {boolean} True, all class name(s) exists; otherwise, false
	 */
	function hasClassName(el, classNames) {
		var elClassNames = getClassNames(el);
		return every(_getClassesArray(classNames), function(className) {
			return inArray(elClassNames, className);
		});
	}

	/**
	 * Remove class name(s) from an element node
	 *
	 * @summary jQuery.fn.removeClass, Element.prototype.classList.remove
	 *
	 * @example
	 * var el = analytics.domElements.selector('a')[0];
	 * analytics.utils.removeClassName(el, 'some-class');
	 *
	 * @example
	 * var el = analytics.domElements.selector('p.first-class')[0];
	 * analytics.utils.removeClassName(el, 'some-class some-other-class');
	 *
	 * @example
	 * var el = analytics.domElements.selector('body')[0];
	 * analytics.utils.removeClassName(el, ['some-class', 'some-other-class']);
	 *
	 * @example
	 * var els = analytics.domElements.selector('a');
	 * analytics.utils.removeClassName(els, ['some-class', 'some-other-class']);
	 *
	 * @memberof analytics.utils
	 * @param {(Array|Element)} els Either an array of element node(s) or a single element node
	 * @param {(Array|string)} classNames Either an array of class name(s) or a string of class name(s) separated by a white-space character
	 * @returns {void}
	 */
	function removeClassName(els, classNames) {
		classNames = _getClassesArray(classNames);

		_forEach(_getElementsArray(els), function(el) {
			var elClassNames = filter(getClassNames(el), function(className) {
				return !inArray(classNames, className);
			});

			el.setAttribute('class', elClassNames.join(' '));
		});
	}

	// MISCELLANEOUS

	/**
	 * Get the Internet Explorer version number with the option to include Edge
	 *
	 * @example
	 * analytics.utils.getIEVersion(navigator.userAgent);
	 *
	 * @example
	 * analytics.utils.getIEVersion('Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'); // 10
	 *
	 * @example
	 * analytics.utils.getIEVersion('Chrome/50.0.1000.79 Safari/500.00 Edge/14.1000', true); // 14
	 *
	 * @memberof analytics.utils
	 * @param {string} userAgent User agent string e.g. navigator.userAgent
	 * @param {boolean} [includeEdge] Optional argument to include the Edge version number. Default is false
	 * @returns {number} Version number of Internet Explorer or Edge; otherwise, -1 if there is no match
	 */
	function getIEVersion(userAgent, includeEdge) {
		var expression = includeEdge ? '(?:MSIE|Trident.*rv|Edge)[ :/]([0-9]+)' : '(?:MSIE|Trident.*rv)[ :]([0-9]+)';
		var reVersion = new RegExp(expression, 'i');
		var match = userAgent.match(reVersion);

		return match ? parseInt(match[1], 10) : -1;
	}

	/**
	 * Evaluate an object variable string
	 *
	 * @example
	 * analytics.utils.getByDotString('foo.bar', {foo:{bar:{bar:true}}}); // {bar:true}
	 *
	 * @example
	 * analytics.utils.getByDotString('foo.bar', {foo:{bar:'baz'}}, {empty:false, nonObjects:false, self:false}); // 'baz'
	 *
	 * @memberof analytics.utils
	 * @param {string} path Path to evaluate
	 * @param {Object} [context] Optional context to use as "this" when invoking the iterator function. This is normally an object
	 * @param {Object} [exclude] Optional exclude object
	 * @param {boolean} [exclude.empty] True to ignore empty values i.e. falsy; otherwise, false. Default is true
	 * @param {boolean} [exclude.nonObjects] True to ignore primitive values; otherwise, false. Default is true
	 * @param {boolean} [exclude.self] True to ignore when the path is equal to the context provided; otherwise, false. Dfeault is true
	 * @returns {Object} Evaluated object; otherwise undefined if the property doesn't exist or the value is undefined
	 */
	function getByDotString(path, context, exclude) {
		context = context || window;
		exclude = extend({
			empty: true,
			nonObjects: true,
			self: true
		}, exclude);

		var obj;
		if (path === 'window') {
			obj = window;
		} else {
			// Strip window from the start of the string, as this causes issues on IE9-11 when using hasOwnProperty()
			path = path.replace(/^\bwindow\b\.?/, '');
			obj = reduce(path.split('.'), function(context, name) {
				return context && Object.prototype.hasOwnProperty.call(context, name) ?
					context[name] :
					undefined;
			}, context);
		}

		if (exclude.empty && isEmpty(obj)) {
			return undefined;
		}

		if (exclude.self && obj === context) {
			return undefined;
		}

		if (exclude.nonObjects && !isObject(obj)) {
			return undefined;
		}

		return obj;
	}

	/**
	 * Get a unix timestamp i.e. the number seconds elapsed since 1970-01-01 00:00:00
	 *
	 * @example
	 * analytics.utils.getTimestamp(); // current timestamp in seconds
	 *
	 * @example
	 * analytics.utils.getTimestamp(Date.now()); // current timestamp in seconds
	 *
	 * @memberof analytics.utils
	 * @param {Date} [date] Optional date object
	 * @returns {number} Unix timestamp
	 */
	function getTimestamp(date) {
		date = isDate(date) ? date : new Date();
		return Math.round(date.getTime() / 1000);
	}

	/**
	 * Check if on a desktop-like device
	 *
	 * @example
	 * analytics.utils.isDesktop(); // true or false
	 *
	 * @memberof analytics.utils
	 * @returns {boolean} True, on a desktop-like device; otherwise, false
	 */
	function isDesktop() {
		return isDevice(DEVICE_DESKTOP);
	}

	/**
	 * Check the device type. Uses user agent to test the device type.
	 * This is compatible with v1 segmentation.
	 *
	 * @example
	 * analytics.utils.isDevice('ios'); // true or false
	 *
	 * @example
	 * analytics.utils.isDevice('windowsphone'); // true or false
	 *
	 * @memberof analytics.utils
	 * @param {string} deviceType Device type, possible values:
	 *     android, ios, othermobile, androidtablet, ipad, othertablet, windowsphone, windowstablet, desktop
	 * @returns {boolean} True, on the specified device; otherwise, false
	 */
	function isDevice(deviceType) {
		var result = false;
		var userAgent = analytics.context ? analytics.context.userAgent : navigator.userAgent;

		// Handheld user agents can be found at URL: http://www.zytrax.com/tech/web/mobile_ids.html
		switch (deviceType) {
			case DEVICE_ANDROID:
				// IE11 fakes user agent, URL: https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
				result = (analytics.DEVICE_REGEXP_ANDROIDMOBILE.test(userAgent)) &&
					!isDevice(DEVICE_WINDOWSPHONE);
				break;
			case DEVICE_IOS:
				// This doesn't include iMacs, only handheld devices
				// IE11 fakes user agent, URL: https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
				result = analytics.DEVICE_REGEXP_IOS.test(userAgent) &&
					!isDevice(DEVICE_WINDOWSPHONE);
				break;
			case DEVICE_OTHERMOBILE:
				result = analytics.DEVICE_REGEXP_OTHERMOBILE.test(userAgent) &&
					!isDevice(DEVICE_ANDROID) &&
					!isDevice(DEVICE_IOS) &&
					!isDevice(DEVICE_WINDOWSPHONE);
				break;
			case DEVICE_ANDROIDTABLET:
				result = analytics.DEVICE_REGEXP_ANDROIDTABLET.test(userAgent);
				break;
			case DEVICE_IPAD:
				result = (analytics.DEVICE_REGEXP_IPAD.test(userAgent));
				break;
			case DEVICE_OTHERTABLET:
				result = analytics.DEVICE_REGEXP_OTHERTABLET.test(userAgent) &&
					!isDevice(DEVICE_ANDROIDTABLET) &&
					!isDevice(DEVICE_WINDOWSTABLET);
				break;
			case DEVICE_WINDOWSPHONE:
				result = analytics.DEVICE_REGEXP_WINDOWSPHONE.test(userAgent);
				break;
			case DEVICE_WINDOWSTABLET:
				result = analytics.DEVICE_REGEXP_WINDOWSTABLET.test(userAgent) &&
					!isDevice(DEVICE_WINDOWSPHONE);
				break;
			case DEVICE_DESKTOP:
				result = !isDevice(DEVICE_ANDROID) &&
					!isDevice(DEVICE_IOS) &&
					!isDevice(DEVICE_WINDOWSPHONE) &&
					!isDevice(DEVICE_OTHERMOBILE) &&
					!isDevice(DEVICE_ANDROIDTABLET) &&
					!isDevice(DEVICE_IPAD) &&
					!isDevice(DEVICE_WINDOWSTABLET) &&
					!isDevice(DEVICE_OTHERTABLET);
				break;
			default:
				throw new Error('Invalid device type');
		}

		return result;
	}

	/**
	 * Check if on a mobile-like device
	 *
	 * @example
	 * analytics.utils.isMobile(); // true or false
	 *
	 * @memberof analytics.utils
	 * @returns {boolean} True, on a mobile-like device; otherwise, false
	 */
	function isMobile() {
		return isDevice(DEVICE_ANDROID) ||
			isDevice(DEVICE_IOS) ||
			isDevice(DEVICE_OTHERMOBILE) ||
			isDevice(DEVICE_WINDOWSPHONE);
	}

	/**
	 * Check if on a tablet-like device
	 *
	 * @example
	 * analytics.utils.isTable(); // true or false
	 *
	 * @memberof analytics.utils
	 * @returns {boolean} True, on a tablet-like device; otherwise, false
	 */
	function isTablet() {
		return isDevice(DEVICE_ANDROIDTABLET) ||
			isDevice(DEVICE_IPAD) ||
			isDevice(DEVICE_OTHERTABLET) ||
			isDevice(DEVICE_WINDOWSTABLET);
	}

	/**
	 * setInterval with applied error handling
	 *
	 * @summary setInterval
	 *
	 * @example
	 * analytics.utils.setInterval(function () {
	 *     analytics.console.log('Called every second');
	 * }, 1000);
	 *
	 * @memberof analytics.utils
	 * @alias setInterval
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval|setInterval} for more details
	 * @returns {number} Timer id
	 */
	function setIntervalFn() {
		return setInterval(analytics.addExceptionHandling(arguments[0]), arguments[1]);
	}

	/**
	 * setTimeout with applied error handling
	 *
	 * @summary setTimeout, _.delay
	 *
	 * @example
	 * analytics.utils.setTimeout(function () {
	 *     analytics.console.log('Called after a second');
	 * }, 1000);
	 *
	 * @memberof analytics.utils
	 * @alias setTimeout
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout|setTimeout} for more details
	 * @returns {number} Timer id
	 */
	function setTimeoutFn() {
		return setTimeout(analytics.addExceptionHandling(arguments[0]), arguments[1]);
	}

	/**
	 * Wait for the success callback to return a truthy value or timeout
	 *
	 * @example
	 * analytics.utils.waitFor(100, 5000, function () {
	 *     analytics.console.log('Call every 100ms and stop when the function returns true OR has exceeded 5 seconds');
	 *
	 *     // Stop when the current timestamp is an even number
	 *     return Date.now() % 2 === 0;
	 * }, function () {
	 *     analytics.console.error('The timer elapsed i.e. the current timestamp was never even');
	 * });
	 *
	 * @example
	 * analytics.utils.waitFor(100, 2000, function (defer) {
	 *     // defer contains the properties "resolve", "reject" and "promise"
	 *     analytics.console.log('Call every 100ms and stop when the function returns true OR has exceeded 2 seconds');
	 *
	 *     // Resolve the promise when the current timestamp is an even number and pass a new value to the chain.
	 *     // This will automatically stop the timer
	 *     if (Date.now() % 2 === 0) {
	 *         defer.resolve('Value to pass to the next promise chain');
	 *     }
	 * }, function () {
	 *     analytics.console.error('The timer elapsed i.e. the current timestamp was never even');
	 * });
	 *
	 * @memberof analytics.utils
	 * @param {number} retryInterval Number of milliseconds between each retry
	 * @param {number} endTime Total number of milliseconds to run the success function
	 * @param {Function} successFn Predicate function to stop the timer. Must return a truthy value e.g. true or non-zero. The function is passed a deferred object
	 * which contains the properties "resolve", "reject" and "promise". If the promise is manually resolved or rejected using the deferred object, then the timer is cleared.
	 * This allows you to pass values to the next promise in the chain
	 * @param {Function} [errorFn] Optional function to invoke when the timer has elapsed
	 * @returns {Promise} Returns a promise that is either resolved or rejected
	 */
	function waitFor(retryInterval, endTime, successFn, errorFn) {
		var hasCompleted = false;
		var isErrorFn = isFunction(errorFn);
		var timerId;

		var defer = {};

		// Rejection events will not be triggered if an error function is provided
		defer.promise = new analytics.Promise(function(resolve, reject) {
			defer.resolve = polyfills.bind(_onComplete, null, resolve);
			defer.reject = polyfills.bind(_onComplete, null, reject);
		});

		var expiryTime = Date.now() + endTime;

		// Wrap the first call in error handling, as all other calls will be wrapped accordingly with error handling
		var safeWaitForFn = analytics.addExceptionHandling(_waitFor, {
			code: analytics.ERROR_WAIT_FOR_TIMEOUT
		});
		safeWaitForFn();

		return defer.promise;

		/**
		 * Wrap a function in custom error handling, so as to reject the deferred promise on error and
		 * re-throw the error so it's caught by the intial error handling
		 *
		 * @memberof analytics.utils
		 * @private
		 * @param {Function} fn Function to apply error handling to
		 * @param {Object} arg Custom argument, either the deferred object or error object
		 * @returns {*} Either a truthy or falsy value
		 */
		function _customExceptionHandling(fn, arg) {
			try {
				return fn(arg);
			} catch (ex) {
				_onError(ex);
				defer.reject(ex);

				// Re-throw the error so the initial error handling will catch the error
				// and send the relevant error
				if (getIEVersion(navigator.userAgent) !== 9) {
					throw ex;
				} else {
					// For IE9 throwing an error is not caught by the global exception handler
					analytics.sendError(ex.message, analytics.ERROR_WAIT_FOR_TIMEOUT);
				}
			}

			return false;
		}

		/**
		 * Invoke the resolve/reject callback function and clear the internal timer id
		 *
		 * @memberof analytics.utils
		 * @private
		 * @param {Function} fn Either the resolve or reject callback function
		 * @returns {void}
		 */
		function _onComplete(fn) {
			hasCompleted = true;

			if (timerId) {
				clearTimeout(timerId);
				timerId = undefined;
			}

			// Remove the first function argument
			var args = analytics.utils.arrayFrom(arguments).slice(1);
			fn.apply(null, args);
		}

		/**
		 * Invoke the error callback function only once
		 *
		 * @memberof analytics.utils
		 * @private
		 * @param {Object} error Error object
		 * @returns {void}
		 */
		function _onError(error) {
			// Check if an error callback function has been provided or has not been called before
			if (isErrorFn) {
				// Set as false to ensure the error callback function is not invoked more than once
				isErrorFn = false;
				errorFn(error);
			}
		}

		/**
		 * setTimeout waitFor function
		 *
		 * @memberof analytics.utils
		 * @private
		 * @returns {void}
		 */
		function _waitFor() {
			if (hasCompleted) {
				return;
			}

			// Pass the deferred object to the success callback function, so as the promise can be manually
			// resolved
			if (_customExceptionHandling(successFn, defer)) {
				defer.resolve();
			} else if (Date.now() < expiryTime) {
				timerId = setTimeoutFn(_waitFor, retryInterval);
			} else {
				var error = new Error('Timed out after ' + endTime + ' millisecond(s)');
				_customExceptionHandling(_onError, error);
				defer.reject(error);
			}
		}
	}

	// ARRAY

	/**
	 * Check if a value is in an array
	 *
	 * @summary jQuery.inArray, Array.prototype.includes, _.includes
	 *
	 * @example
	 * analytics.utils.inArray([1, 2, 3], 1); // true
	 *
	 * @example
	 * analytics.utils.inArray([1, 2, 3], 4); // false
	 *
	 * @memberof analytics.utils
	 * @param {Array} array Array to check
	 * @param {*} search Value to search for
	 * @returns {boolean} True, the value is in the array; otherwise, false
	 */
	function inArray(array, search) {
		return indexOf(array, search) !== -1;
	}

	/**
	 * Polyfill for Array.prototype.indexOf
	 *
	 * @summary Array.prototype.indexOf, _.indexOf
	 *
	 * @example
	 * analytics.utils.indexOf([1, 2, 3]); // 0
	 *
	 * @example
	 * analytics.utils.indexOf([1, 2, 3]); // -1
	 *
	 * @memberof analytics.utils
	 * @param {Array} array Array to check
	 * @param {*} value Value to check
	 * @param {number} fromIndex Starting index value
	 * @returns {number} Index number of the value; otherwise, -1 on error
	 */
	function indexOf(array, value, fromIndex) {
		if (_isArrayLike(array)) {
			for (var i = parseInt(fromIndex, 10) || 0; i < array.length; i++) {
				if (value === array[i]) {
					return i;
				}
			}
		}

		return -1;
	}

	/**
	 * Get an array of unique values from a parameter list of array
	 * This is often known as 'union'
	 *
	 * @summary jQuery.unique, _.unq, _.union
	 *
	 * @example
	 * analytics.utils.uniq([1, 1, 2, 2, 3]); // [1, 2, 3]
	 *
	 * @example
	 * analytics.utils.uniq([1, 2, 3], [1, 2, 2, 3]); // [1, 2, 3]
	 *
	 * @memberof analytics.utils
	 * @param {...Array} arrays One or more arrays to concat and get the unique values of
	 * @returns {Array} An array containing only unique values; otherwise, an empty array
	 */
	function uniq() {
		return reduce(arguments, function(finalArr, currentArr) {
			_forEach(currentArr, function(value) {
				// Push value onto final array if it doesn't exist
				if (!inArray(finalArr, value)) {
					finalArr.push(value);
				}
			});
			return finalArr;
		}, []);
	}

	// STRING

	/**
	 * Escape regular expression meta characters with a backslash
	 * Note: Supported regular expression meta characters are [].|*?+(){}^$\\:=
	 *
	 * @example
	 * analytics.utils.escapeRegExp('/.*\'); // '/\.\*\*'
	 *
	 * @memberof analytics.utils
	 * @param {string} str String to escape
	 * @returns {string} Escaped string, otherwise, original value on error
	 */
	function escapeRegExp(str) {
		// $& => Last match, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastMatch
		var reRegExpEscape = /([\].|*?+(){}^$\\:=[])/g;
		return isString(str) ? str.replace(reRegExpEscape, '\\$&') : str;
	}

	/**
	 * Pad a string with characters either left (positive maxLength) or right (negative maxLength)
	 *
	 * @summary String.prototype.padEnd/String.prototype.padStart, _.pad
	 *
	 * @example
	 * analytics.utils.pad('1', 0, 3); // 001
	 *
	 * @example
	 * analytics.utils.pad('001', 0, 3); // 001
	 *
	 * @example
	 * analytics.utils.pad('1', 0, -6); // 100000
	 *
	 * @memberof analytics.utils
	 * @param {string} str String value to pad
	 * @param {*} padding Padding value
	 * @param {number} maxLength Maximum string length. If a positive number, padding is to the left; otherwise, negative to the right
	 * @returns {string} Padded string; otherwise, original value coerced to a string
	 */
	function pad(str, padding, maxLength) {
		var leftPadding = maxLength >= 0;

		maxLength = Math.abs(maxLength);

		str = String(str);
		if (str.length === 0 || str.length >= maxLength) {
			return str;
		}

		padding = String(padding);
		if (padding.length === 0) {
			return str;
		}

		var fillLength = maxLength - str.length;
		var timesToRepeat = Math.ceil(fillLength / padding.length) + 1;
		var strRepeated = Array(timesToRepeat)
			.join(padding)
			.slice(0, fillLength);

		return leftPadding ? strRepeated + str : str + strRepeated;
	}

	/**
	 * Substitute corresponding characters in array set 1 with respective characters in array set 2
	 *
	 * @example
	 * analytics.utils.subs('Pyota', ['o'], ['ö']); // 'Pyöta'
	 *
	 * @throws {Error} If the array lengths mismatch
	 * @memberof analytics.utils
	 * @param {string} str String to substitute
	 * @param {Array} set1 Array of characters to substitute
	 * @param {Array} set2 Array of characters to substitute with
	 * @returns {string} Substituted string; otherwise, an error is thrown
	 */
	function subs(str, set1, set2) {
		if (set1.length !== set2.length) {
			throw new Error('Invalid arguments, arrays are of different lengths');
		}

		return reduce(set1, function(str, value, index) {
			return str.replace(new RegExp(value, 'g'), set2[index]);
		}, str);
	}

	/**
	 * LTrim and RTrim white-space or a provided string character set
	 *
	 * @summary jQuery.trim, String.prototype.trim, _.trim
	 *
	 * @example
	 * analytics.utils.trim('    some-string     '); // 'some-string'
	 *
	 * @memberof analytics.utils
	 * @param {string} str String to trim
	 * @param {string} [characters] Optional character set that should contain non-escaped (backslash) characters
	 * @returns {string} Trimmed string; otherwise, original value if not a string
	 */
	function trim(str, characters) {
		// Return the original value, as it states a string is required
		if (!isString(str)) {
			return str;
		}

		characters = isString(characters) ? escapeRegExp(characters) : '\\s\\uFEFF\\xA0';
		return str.replace(new RegExp('^[' + characters + ']+|[' + characters + ']+$', 'g'), '');
	}

	/**
	 * LTrim and RTrim white-space including 2 or more consecutive white-spaces
	 *
	 * @example
	 * analytics.utils.trimInside('  some    string  with    spaces'); // 'some string with spaces'
	 *
	 * @memberof analytics.utils
	 * @param {string} str String to trim
	 * @returns {string} Trimmed string; otherwise, original value if not a string
	 */
	function trimInside(str) {
		var reStrTrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
		var reStrTrimInside = /\s+/g;
		return isString(str) ? str.replace(reStrTrim, '').replace(reStrTrimInside, ' ') : str;
	}

	/**
	 * Iterate over an array that can optionally break by returning false from the iterator function
	 * Idea by MDN, URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
	 *
	 * @memberof analytics.utils
	 * @private
	 * @param {(Array|Object)} obj Array or object to iterate over
	 * @param {Function} fn Iterator function to pass the arguments value, index/key and array/object reference
	 * @param {Object} context Optional context to use as "this" when invoking the iterator function
	 * @param {number} fromIndex Starting index value. If undefined or NaN i.e. falsy, then the default is 0
	 * @param {boolean} breakOnFalse Break the iteration if the iterator function returns false. Default is false
	 * @returns {void}
	 */
	function _forEach(obj, fn, context, fromIndex, breakOnFalse) {
		if (_isArrayLike(obj)) {
			// Array-like
			for (var i = fromIndex || 0; i < obj.length; i++) {
				if (fn.call(context, obj[i], i, obj) === false && breakOnFalse) {
					break;
				}
			}
		} else if (!isNil(obj)) {
			// Objects or dictionaries with named properties
			for (var key in obj) { // eslint-disable-line no-restricted-syntax
				if (Object.prototype.hasOwnProperty.call(obj, key) &&
					fn.call(context, obj[key], key, obj) === false && breakOnFalse) {
					break;
				}
			}
		}
	}

	/**
	 * Get an array of class name(s)
	 *
	 * @memberof analytics.utils
	 * @private
	 * @param {(Array|string)} classNames Either an array of class name(s) or a string of class name(s) separated by a white-space character
	 * @returns {(Array|undefined)} Array of class name(s); otherwise, if not a valid array or string, then undefined
	 */
	function _getClassesArray(classNames) {
		if (isString(classNames)) {
			classNames = trim(classNames).split(' ');
		} else if (!isArray(classNames)) {
			// If not an array, then set to undefined, as it's expected that either a string or array will be passed
			classNames = undefined;
		}

		return classNames;
	}

	/**
	 * Get the current domain
	 *
	 * @memberof analytics.utils
	 * @private
	 * @returns {string} Current domain; otherwise, empty string on error
	 */
	function _getCurrentDomain() {
		var href = analytics.main.getCurrentBrowserData().href;
		return href ? getLocationFromUrl(href).host : '';
	}

	/**
	 * Get an array of element node(s)
	 *
	 * @memberof analytics.utils
	 * @private
	 * @param {(Array|Element)} els Either an array of element node(s) or an element node
	 * @returns {Array} Array of element node(s); otherwise, an empty array
	 */
	function _getElementsArray(els) {
		if (_isElementNode(els)) {
			els = [els];
		} else {
			els = filter(els, _isElementNode);
		}

		return els;
	}

	/**
	 * Checks if an array-like object is array-like i.e. has a property of length that is greater or equal to zero
	 *
	 * @memberof analytics.utils
	 * @private
	 * @param {*} arrayLike Array-like object
	 * @returns {boolean} True, is an array-like object; otherwise, false
	 */
	function _isArrayLike(arrayLike) {
		return !isNil(arrayLike) && isNumber(arrayLike.length) && arrayLike.length >= 0 && arrayLike.length <= (Math.pow(2, 53) - 1);
	}

	/**
	 * Check if a variable is an element node
	 *
	 * @memberof analytics.utils
	 * @private
	 * @param {Element} el Element node to check
	 * @returns {boolean} True, is an element node; otherwise, false
	 */
	function _isElementNode(el) {
		return el && el.nodeType === Node.ELEMENT_NODE;
	}

	/**
	 * Replace reserved characters in a URL
	 *
	 * @memberof analytics.utils
	 * @private
	 * @param {string} url URL to sanitize
	 * @returns {string} Sanitized URL; otherwise, original URL
	 */
	function _replaceReservedChars(url) {
		if (!url) {
			return url;
		}

		var replacements = [
			[/\?&/g, '?'],
			[/@/, encodeURIComponent('@')]
		];

		return reduce(replacements, function(url, replacement) {
			return url.replace(replacement[0], replacement[1]);
		}, url);
	}
}());
