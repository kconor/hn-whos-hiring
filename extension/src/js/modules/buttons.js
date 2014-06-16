/* jshint -W097 */
"use strict";
define(["underscore",
				"interface",
				"dom_util",
				"storage",
				"logger",
				"text!/html/header.html",
				"text!/html/select.html"], 
function( _,
					Interface,
					dom,
					db,
					logger,
					header_html,
					select_html) { 

	var pub = new Interface();

	var select_options = [
		'status',
		'applied',
		'todo',
		'ignore'
	];

	function selectIndex(str) {
		for (var i=0; i<select_options.length; i++) {
			if (select_options[i] == str)
				return i;
		}
		return -1;
	}
	pub.export(selectIndex);

	/*
	 * Adds new UI elements to each top-level comment
	 *
	 * @param {object} the spacer <img> for the comment
	 */
	function addButtons(comment) {
		//var menu = root.getElementsByClassName("wh-comment-menu");
		//menu.insertAdjancentHTML('afterbegin', 
		var menu = comment.getElementsByClassName("wh-comment-menu")[0];	
		if (menu.childElementCount === 0 ) {
			menu.innerText = "";
			var plus = document.createElement("div");
			plus.innerText = "+";
			plus.className = "wh-button expand";

			/* toggles minimizing of the comment tree */
			plus.addEventListener('click', 
					function(e) {
						if (this.innerText === "+") {
							this.innerText = "-";
							dom.expandTree(comment);
						} else {
							this.innerText = "+";
							dom.shrinkTree(comment);
						}
					}, true);

			menu.insertBefore(plus, null);

			/* add status select element */
			var select = document.createElement("div");
			select.insertAdjacentHTML('afterbegin', select_html);
			select.className = "wh-select-container";

			var control = select.getElementsByTagName("select")[0];
			control.className = "wh-select status";

			control.addEventListener('change',
					function(e) {
						var comment = this.parentElement.parentElement.parentElement;
						var comment_id = getID(comment);
						if (select_options[this.selectedIndex] !== undefined) {
							this.className = "wh-select " + select_options[this.selectedIndex];
							db.set(comment_id.link, 'status', this.selectedIndex);
						} else {
							logger.err("unrecognized select value");
						}
						this.blur();
					});

			menu.insertBefore(select, null);

			loadUIData(comment);
		}
	}
	pub.export(addButtons);

	/*
	 * Loads UI data for a comment from storage.
	 *
	 * @param {object} a comment <tr>
	 */
	function loadUIData(comment) {
		/* this function should only be run on startup.
		 * "wh-button apply" will be initial value for all
		 * apply buttons. */
		var button = comment.getElementsByClassName("wh-button apply")[0];
		var id = getID(comment);
		var key = id.link + 'applied';
		db.get(id.link, 'applied').then(function(item) {
			if (item[key] === true) {
				button.className = "wh-button applied";
				button.innerText = "applied";
			}
		});
		var select = comment.getElementsByClassName("wh-select")[0];
		key = id.link + 'status';
		db.get(id.link, 'status').then(function(item) {
			if (item[key] !== 0) {//0 = default when element created
				select.className = "wh-select " + select_options[item[key]];
				select.selectedIndex = item[key];
			}
		});
	}

	/*
	 * Gets the link and user id for the comment
	 *
	 * @returns {object} link and user id
	 */
	var link_RE = /item\?id=([0-9]+)/;
	var user_RE = /user\?id=([A-z0-9]+)/;

	function getID(comment) {
		if (comment.wh_id !== undefined) {
			return comment.wh_id;
		} else {
			var links = comment.getElementsByTagName("a");
			var id = {};
			_.each(links, function(a,i,ls) {
				if (id.link === undefined) {
					var link_num = link_RE.exec(a.href);
					if (link_num) {
						id.link = link_num[1];
					}
				}
				if (id.user === undefined) {
					var user_id = user_RE.exec(a.href);
					if (user_id !== null) {
						id.user = user_id[1];
					}
				}
			});
			if (id.user === undefined) {
				logger.err("couldn't find user id");
			}
			if (id.link === undefined) {
				logger.err("couldn't find link id");
			}
			comment.wh_id = id;//memoize it
			return id;
		}
	}

	return pub;
});
