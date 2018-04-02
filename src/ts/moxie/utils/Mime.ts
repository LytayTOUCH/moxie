/**
 * Mime.js
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

import { trim, inArray, each, typeOf } from './Basic';
import { translate } from './I18n';

/**
@class moxie/utils/Mime
@public
@static
*/

const mimeData = "" +
	"application/msword,doc dot," +
	"application/pdf,pdf," +
	"application/pgp-signature,pgp," +
	"application/postscript,ps ai eps," +
	"application/rtf,rtf," +
	"application/vnd.ms-excel,xls xlb xlt xla," +
	"application/vnd.ms-powerpoint,ppt pps pot ppa," +
	"application/zip,zip," +
	"application/x-shockwave-flash,swf swfl," +
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx," +
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx," +
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx," +
	"application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx," +
	"application/vnd.openxmlformats-officedocument.presentationml.template,potx," +
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx," +
	"application/x-javascript,js," +
	"application/json,json," +
	"audio/mpeg,mp3 mpga mpega mp2," +
	"audio/x-wav,wav," +
	"audio/x-m4a,m4a," +
	"audio/ogg,oga ogg," +
	"audio/aiff,aiff aif," +
	"audio/flac,flac," +
	"audio/aac,aac," +
	"audio/ac3,ac3," +
	"audio/x-ms-wma,wma," +
	"image/bmp,bmp," +
	"image/gif,gif," +
	"image/jpeg,jpg jpeg jpe," +
	"image/photoshop,psd," +
	"image/png,png," +
	"image/svg+xml,svg svgz," +
	"image/tiff,tiff tif," +
	"text/plain,asc txt text diff log," +
	"text/html,htm html xhtml," +
	"text/css,css," +
	"text/csv,csv," +
	"text/rtf,rtf," +
	"video/mpeg,mpeg mpg mpe m2v," +
	"video/quicktime,qt mov," +
	"video/mp4,mp4," +
	"video/x-m4v,m4v," +
	"video/x-flv,flv," +
	"video/x-ms-wmv,wmv," +
	"video/avi,avi," +
	"video/webm,webm," +
	"video/3gpp,3gpp 3gp," +
	"video/3gpp2,3g2," +
	"video/vnd.rn-realvideo,rv," +
	"video/ogg,ogv," +
	"video/x-matroska,mkv," +
	"application/vnd.oasis.opendocument.formula-template,otf," +
	"application/octet-stream,exe";


/**
 * Map of mimes to extensions
 *
 * @property mimes
 * @type {Object}
 */
const mimes = {};

/**
 * Map of extensions to mimes
 *
 * @property extensions
 * @type {Object}
 */
const extensions = {};


/**
* Parses mimeData string into a mimes and extensions lookup maps. String should have the
* following format:
*
* application/msword,doc dot,application/pdf,pdf, ...
*
* so mime-type followed by comma and followed by space-separated list of associated extensions,
* then comma again and then another mime-type, etc.
*
* If invoked externally will replace override internal lookup maps with user-provided data.
*
* @method addMimeType
* @param {String} mimeData
*/
const addMimeType = function (mimeData) {
	let items = mimeData.split(/,/), i, ii, ext;

	for (i = 0; i < items.length; i += 2) {
		ext = items[i + 1].split(/ /);

		// extension to mime lookup
		for (ii = 0; ii < ext.length; ii++) {
			mimes[ext[ii]] = items[i];
		}
		// mime to extension lookup
		extensions[items[i]] = ext;
	}
};


const extList2mimes = function (filters, addMissingExtensions) {
	let ext, i, ii, type, mimes = [];

	// convert extensions to mime types list
	for (i = 0; i < filters.length; i++) {
		ext = filters[i].extensions.toLowerCase().split(/\s*,\s*/);

		for (ii = 0; ii < ext.length; ii++) {

			// if there's an asterisk in the list, then accept attribute is not required
			if (ext[ii] === '*') {
				return [];
			}

			type = mimes[ext[ii]];

			// future browsers should filter by extension, finally
			if (addMissingExtensions && /^\w+$/.test(ext[ii])) {
				mimes.push('.' + ext[ii]);
			} else if (type && inArray(type, mimes) === -1) {
				mimes.push(type);
			} else if (!type) {
				// if we have no type in our map, then accept all
				return [];
			}
		}
	}
	return mimes;
};


const mimes2exts = function (mimes) {
	let exts = [];

	each(mimes, function (mime) {
		mime = mime.toLowerCase();

		if (mime === '*') {
			exts = [];
			return false;
		}

		// check if this thing looks like mime type
		const m = mime.match(/^(\w+)\/(\*|\w+)$/);
		if (m) {
			if (m[2] === '*') {
				// wildcard mime type detected
				each(extensions, function (arr, mime) {
					if ((new RegExp('^' + m[1] + '/')).test(mime)) {
						[].push.apply(exts, extensions[mime]);
					}
				});
			} else if (extensions[mime]) {
				[].push.apply(exts, extensions[mime]);
			}
		}
	});
	return exts;
};


const mimes2extList = function (mimes) {
	let accept = [], exts = [];

	if (typeOf(mimes) === 'string') {
		mimes = trim(mimes).split(/\s*,\s*/);
	}

	exts = mimes2exts(mimes);

	accept.push({
		title: translate('Files'),
		extensions: exts.length ? exts.join(',') : '*'
	});

	return accept;
};

/**
 * Extract extension from the given filename
 *
 * @method getFileExtension
 * @param {String} fileName
 * @return {String} File extension
 */
const getFileExtension = function (fileName) {
	const matches = fileName && fileName.match(/\.([^.]+)$/);
	if (matches) {
		return matches[1].toLowerCase();
	}
	return '';
};


/**
 * Get file mime-type from it's filename - will try to match the extension
 * against internal mime-type lookup map
 *
 * @method getFileMime
 * @param {String} fileName
 * @return File mime-type if found or an empty string if not
 */
const getFileMime = function (fileName) {
	return mimes[getFileExtension(fileName)] || '';
};


addMimeType(mimeData);

export {
	mimes,
	extensions,
	addMimeType,
	extList2mimes,
	mimes2exts,
	mimes2extList,
	getFileExtension,
	getFileMime
};
