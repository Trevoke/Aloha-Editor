/**
 * colors.js is part of Aloha Editor project http://aloha-editor.org
 *
 * Aloha Editor is a WYSIWYG HTML5 inline editing library and editor.
 * Copyright (c) 2010-2014 Gentics Software GmbH, Vienna, Austria.
 * Contributors http://aloha-editor.org/contribution.php
 */
define([
	'dom',
	'ranges',
	'editing'
], function (
	Dom,
	Ranges,
	Editing
) {
	'use strict';

	var COLOR_PREFIX = /^(#|rgba?|hsl)\(?([^\(\)]+)/i;
	var COMMA = /\s*,\s*/;

	/**
	 * Returns a human readable representation of the given color.
	 *
	 * @param  {Array.<number>} color
	 * @return {string}
	 */
	function toString(color) {
		if ('string' === typeof color[0]) {
			return '#' + color.join('');
		}
		return (4 === color.length)
		     ? 'rgba(' + color.join(',') + ')'
		     : 'rgb('  + color.join(',') + ')';
	}

	/**
	 * Checks whether the two given colors are equal in value (if not in
	 * representation).
	 *
	 * equals('#f00', 'rgb(255,0,0)') == true
	 *
	 * @param  {string} a
	 * @param  {string} b
	 * @return {boolean}
	 */
	function equals(a, b) {
		return (null === a || null === b) ? (a === b) : (hex(a) === hex(b));
	}

	/**
	 * Normalizes hexidecimal colors from #f34 to #ff3344.
	 *
	 * @private
	 * @param  {string} hex
	 * @return {string} Long version of hexidecimal color value
	 */
	function normalizeHex(hex) {
		var r, g, b;
		if (4 === hex.length) {
			r = hex.substr(1, 1);
			g = hex.substr(2, 1);
			b = hex.substr(3, 1);
			r += r;
			g += g;
			b += b;
		} else {
			r = hex.substr(1, 2);
			g = hex.substr(3, 4);
			b = hex.substr(5, 6);
		}
		return [r, g, b];
	}

	/**
	 * Converts the RGB color representation into hexidecimal.
	 *
	 * @private
	 * @param  {Array.<string>} rgb
	 * @return {Array.<string>}
	 */
	function rgb2hex(rgb) {
		return rgb.reduce(function (values, value) {
			var color = parseInt(value, 10).toString(16);
			return values.concat(1 === color.length ? color + color : color);
		}, []);
	}

	/**
	 * Converts the hexidecimal color representation into RGB.
	 *
	 * @private
	 * @param  {Array.<string>} hex
	 * @return {Array.<string>}
	 */
	function hex2rgb(hex) {
		return normalizeHex(hex).reduce(function (values, value) {
			return values.concat(parseInt(value, 16));
		}, []);
	}

	/**
	 * Given a color string will normalize it to a hexidecimal color string.
	 *
	 * @param  {string} value
	 * @return {string}
	 */
	function hex(value) {
		var color = value.match(COLOR_PREFIX);
		switch (color && color[1]) {
		case '#':
			return normalizeHex(color[0]);
		case 'rgb':
		case 'rgba':
			return rgb2hex(color[2].split(COMMA));
		}
	}

	/**
	 * Given a color string will normalize it to a RGB color string.
	 *
	 * @param  {string} value
	 * @return {string}
	 */
	function rgb(value) {
		var color = value.match(COLOR_PREFIX);
		switch (color && color[1]) {
		case '#':
			return hex2rgb(color[0]);
		case 'rgb':
		case 'rgba':
			return color[2].split(COMMA).reduce(function (values, value) {
				return values.concat(parseInt(value, 10));
			}, []);
		}
	}

	/**
	 * Cross fades RGBA color `from` to RBG color `to` by a given percent.
	 *
	 * @param  {Array.<number>} from
	 * @param  {Array.<number>} to
	 * @param  {number}         percent
	 * @return {Array.<number>}
	 */
	function cross(from, to, percent) {
		var r = to[0] - from[0];
		var g = to[1] - from[1];
		var b = to[2] - from[2];
		return [
			from[0] + Math.round(r * percent),
			from[1] + Math.round(g * percent),
			from[2] + Math.round(b * percent)
		];
	}

	return {
		hex      : hex,
		rgb      : rgb,
		cross    : cross,
		equals   : equals,
		toString : toString
	};
});
