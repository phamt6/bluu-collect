/*global analytics */
analytics.uid = (function() {
	// Constants

	/**
	 * Unique identifier
	 * @type {string}
	 */
	var _uid = null;

	return {
		get: get,
		getDecile: getDecile,
		isDefined: isDefined,
		isInComparisonGroup: isInComparisonGroup,
		newUid: newUid,
		set: set,

		// For testing only
		_testResetUID: _testResetUID
	};

	/**
	 * Retrieve UID
	 *
	 * analytics.uid.get(); // user's UID
	 *
	 * @memberof analytics.uid
	 * @returns {string} uid Unique identifier string
	 */
	function get() {
		return _uid;
	}

	/**
	 * Calculate decile according to uid
	 *
	 * @example
	 * var uid = analytics.uid.get();
	 * analytics.uid.getDecile(uid)
	 *
	 * @memberof analytics.uid
	 * @param {string} uid Unique identifier string
	 * @returns {number} decile
	 */
	function getDecile(uid) {
		var randDecile = uid + 'randomized decile';
		var rand = parseInt(analytics.md5(randDecile).substr(0, 8), 16) / Math.pow(2, 32);

		return parseInt(rand * 10, 10) + 1;
	}

	/**
	 * Check if the unique identifier has been created i.e. already defined
	 *
	 * @example
	 * analytics.uid.isDefined(); // true or false
	 *
	 * @memberof analytics.uid
	 * @returns {boolean} True, the unique identifier string has been created; otherwise, false
	 */
	function isDefined() {
		return get() !== null;
	}

	/**
	 * Check if the unique identifier string is in the comparison group
	 *
	 * @example
	 * var uid = analytics.uid.get();
	 * analytics.uid.isInComparisonGroup(uid); // true or false
	 *
	 * @memberof analytics.uid
	 * @param {string} uid Unique identifier string
	 * @returns {boolean} True, the unique identifier string is in the comparison group; otherwise, false
	 */
	function isInComparisonGroup(uid) {
		// In PHP this is hexdec(substr(md5($cookieId), 0, 8)) / (1 << 32);
		var value = parseInt(analytics.md5(uid).substr(0, 8), 16) / Math.pow(2, 32);

		return value < 0.1;
	}

	/**
	 * Generate the same uid on single pageload. This generated uid is stored in module.
	 * This allows creation to happen in quick-messages or analytics without conflicts.
	 *
	 * @ignore
	 * @example
	 * analytics.uid.newUid(navigator.userAgent);
	 *
	 * @throws {Error} User agent string is empty or not a string
	 * @memberof analytics.uid
	 * @param {string} userAgent User agent string
	 * @returns {(string|null)} uid Unique identifier string; otherwise, null on error
	 */
	function newUid(userAgent) {
		// User agent must be a string and defined
		if (!userAgent || !analytics.utils.isString(userAgent)) {
			throw new Error('Invalid argument, userAgent must be string:' + typeof userAgent);
		}

		if (!isDefined()) {
			set(_getCrawlerUserId(userAgent) || _generate(userAgent));
		}

		return get();
	}

	/**
	 * Set a unique identifier string
	 *
	 * @example
	 * analytics.uid.set('uid');
	 *
	 * @throws {Error} Unique identifier is empty or not a string
	 * @memberof analytics.uid
	 * @param {string} uid Unique identifier string
	 * @returns {void}
	 */
	function set(uid) {
		if (!uid) {
			throw new Error('Invalid uid must be non-empty string:' + uid);
		}

		_uid = uid;
	}

	/**
	 * Generate a unique identifier string
	 *
	 * @memberof analytics.uid
	 * @private
	 * @param {string} userAgent User agent string
	 * @returns {string} Generated unique identifier string
	 */
	function _generate(userAgent) {
		/* eslint-disable no-bitwise */
		var seed = 0x811c9dc5;
		for (var i = 0, length = userAgent.length; i < length; i++) {
			seed += (seed << 1) + (seed << 4) + (seed << 7) + (seed << 8) + (seed << 24);
			seed ^= userAgent.charCodeAt(i);
		}

		var hash = seed & 0x7fffffff;
		/* eslint-enable no-bitwise */

		return hash.toString(36) + '.' + Date.now().toString(36);
	}

	/**
	 * Get a crawler user id
	 *
	 * @memberof analytics.uid
	 * @private
	 * @param {string} userAgent User agent string
	 * @returns {string} Crawler user id; otherwise, undefined on error
	 */
	function _getCrawlerUserId(userAgent) {
		var crawlers = {
			// http://www.bing.com/webmaster/help/which-crawlers-does-bing-use-8c184ec0
			'bingbot|adidxbot|BingPreview': function() {
				return 'bingbot.00000000';
			},

			// https://support.google.com/webmasters/answer/1061943?hl=en
			'Google Web Preview|Googlebot|Mediapartners-Google|AdsBot-Google': function() {
				return 'webpreview.00000000';
			},

			'AdobeAIR/(\\d+(\\.\\d+)*)': function(match) {
				return 'adobeair_' + match[1].replace(/\./g, '') + '.00000000';
			}
		};

		var uid;
		analytics.utils.each(crawlers, function(fn, reCrawler) {
			var match = userAgent.match(new RegExp(reCrawler));
			if (!uid && match) {
				uid = fn(match);
			}
		});

		return uid;
	}

	/**
	 * Reset the UID for testing purposes.
	 * Note: For testing only
	 *
	 * @memberof analytics.uid
	 * @private
	 * @returns {void}
	 */
	function _testResetUID() {
		_uid = null;
	}
}());
