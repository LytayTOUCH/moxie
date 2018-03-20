/**
 * Dom.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/utils/Dom
@public
@static
*/

/**
Get DOM Element by it's id.

@method get
@param {String} id Identifier of the DOM Element
@return {DOMElement}
*/
const get = function (id) {
	if (typeof id !== 'string') {
		return id;
	}
	return document.getElementById(id);
};

/**
Checks if specified DOM element has specified class.

@method hasClass
@static
@param {Object} obj DOM element like object to add handler to.
@param {String} name Class name
*/
const hasClass = function (obj, name) {
	if (!obj.className) {
		return false;
	}

	const regExp = new RegExp('(^|\\s+)' + name + '(\\s+|$)');
	return regExp.test(obj.className);
};

/**
Adds specified className to specified DOM element.

@method addClass
@static
@param {Object} obj DOM element like object to add handler to.
@param {String} name Class name
*/
const addClass = function (obj, name) {
	if (!hasClass(obj, name)) {
		obj.className = !obj.className ? name : obj.className.replace(/\s+$/, '') + ' ' + name;
	}
};

/**
Removes specified className from specified DOM element.

@method removeClass
@static
@param {Object} obj DOM element like object to add handler to.
@param {String} name Class name
*/
const removeClass = function (obj, name) {
	if (obj.className) {
		const regExp = new RegExp('(^|\\s+)' + name + '(\\s+|$)');
		obj.className = obj.className.replace(regExp, function ($0, $1, $2) {
			return $1 === ' ' && $2 === ' ' ? ' ' : '';
		});
	}
};

/**
Returns a given computed style of a DOM element.

@method getStyle
@static
@param {Object} obj DOM element like object.
@param {String} name Style you want to get from the DOM element
*/
const getStyle = function (obj, name) {
	if (obj.currentStyle) {
		return obj.currentStyle[name];
	} else if (window.getComputedStyle) {
		return window.getComputedStyle(obj, null)[name];
	}
};

/**
Returns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.

@method getPos
@static
@param {Element} node HTML element or element id to get x, y position from.
@param {Element} root Optional root element to stop calculations at.
@return {object} Absolute position of the specified element object with x, y fields.
*/
const getPos = function (node, root) {
	const doc = document;
	let x = 0, y = 0, parent;

	node = node;
	root = root || doc.body;

	parent = node;
	while (parent && parent !== root && parent.nodeType) {
		x += parent.offsetLeft || 0;
		y += parent.offsetTop || 0;
		parent = parent.offsetParent;
	}

	parent = node.parentNode;
	while (parent && parent !== root && parent.nodeType) {
		x -= parent.scrollLeft || 0;
		y -= parent.scrollTop || 0;
		parent = parent.parentNode;
	}

	return {
		x,
		y
	};
};

/**
Returns the size of the specified node in pixels.

@method getSize
@static
@param {Node} node Node to get the size of.
@return {Object} Object with a w and h property.
*/
const getSize = function (node) {
	return {
		w : node.offsetWidth || node.clientWidth,
		h : node.offsetHeight || node.clientHeight
	};
};

export default {
	get,
	hasClass,
	addClass,
	removeClass,
	getStyle,
	getPos,
	getSize
};
