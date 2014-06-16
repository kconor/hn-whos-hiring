/* jshint -W097 */
"use strict";
define([], function() {

function checkArgs(link_id, attr) {
	if (link_id === undefined || link_id === null) {
		throw new Error("link_id must be defined and not null");
	} else if (attr === undefined || attr === null) {
		throw new Error("attribute must be defined and not null");
	}
}

function set(link_id, attribute, value) {
	checkArgs(link_id, attribute);
	var key = link_id + attribute;
	return new Promise(function(resolved, error) {
		var item = {};
		item[key] = value;
		chrome.storage.local.set(item, function() {
			if (chrome.runtime.lastError === undefined) {
				resolved(true);
			} else {
				error(new Error(chrome.runtime.lastError));
			}
		});
	});
}

function get(link_id, attribute) {
	checkArgs(link_id, attribute);
	var key = link_id + attribute;
	return new Promise(function(resolved, error) {
		chrome.storage.local.get(key, function(item) {
			//returns and empty object if it can't find the key
			if (Object.keys(item).length > 0) {
				resolved(item);
			} else {
				error(new Error("couldn't find item"));
			}
		});
	});
}

function remove(link_id, attribute) {
	checkArgs(link_id, attribute);
	var key = link_id + attribute;
	return new Promise(function(resolved, error) {
		chrome.storage.local.remove(key, function() {
			if (chrome.runtime.lastError === undefined) {
				resolved(true);
			} else {
				error(new Error(chrome.runtime.lastError));
			}
		});
	});
}

return {
	get: get,
	set: set,
	remove: remove
};

});
