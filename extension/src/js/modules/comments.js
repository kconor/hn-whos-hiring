/* jshint -W097 */
"use strict";

define(["underscore",
				"interface",
				"logger",
				"dom_util",
				"buttons",
				"text!/html/comment.html"], 
function(_,
					Interface,
					logger,
					dom,
					btn,
					comment_html) 
{ 

	var pub = new Interface();
	
	/* Construct new comment from old comment.
	 *
	 * @param {object} comment <tr> from hacker news
	 *
	 * @returns {object} new <div> with similar content
	 */
	function buildComment(comment) {
		//the inner cell with everything
		var td = comment.getElementsByClassName("default")[0];
		//contains user link and date
		var header = td.getElementsByTagName("div")[0];
		//contains comment text and formatting
		var span = td.getElementsByTagName("span")[1];


		//create root div for comment
		var root = document.createElement("div");
		root.className = "wh-comment-wrapper";
		root.insertAdjacentHTML('afterbegin', comment_html);

		//add content from original comment
		var new_header = root.getElementsByClassName("wh-comment-header")[0];
		new_header.insertAdjacentHTML('afterbegin', header.innerHTML);

		var new_content = root.getElementsByClassName("wh-comment-content")[0];
		new_content.insertAdjacentHTML('afterbegin', span.innerHTML);
		removeDashes(new_content);

		var spacer = getSpacer(comment);
		var menu = root.getElementsByClassName("wh-comment-menu")[0];
		if (spacer.width > 0)
			root.style['padding-left'] = spacer.width;
			//menu.style.width = spacer.width + 65;


		return root;	
	}
	pub.export(buildComment);

	function removeDashes(elem) {
		if (elem.innerText.indexOf("-----") > -1) {
			var p = elem.getElementsByTagName("p");
			var to_remove = p[p.length - 1];
			to_remove.parentElement.removeChild(to_remove);
		}
	}
	pub.export(removeDashes);


	/*
	 * @param {object} array of hacker news <tr> comments
	 *
	 * @returns {object} array of new <div> comments
	 */
	function buildNewComments(comments) {
		var levels = splitCommentsByLevel(comments);
		var new_com = _.map(levels.top_level, function(c) {
			var new_comment = buildComment(c);
			btn.addButtons(new_comment);
			var children = getChildComments(c);
			new_comment.child_comments = _.map(children, function(cc) {
				return buildComment(cc);
			});
			dom.shrinkTree(new_comment);
			return new_comment;
		});
		return new_com;
	}
	pub.export(buildNewComments);
	/*
	 * returns {object} array of new comments.
	 */

	var new_comments = [];

	function getNewComments() {
		if (new_comments.length === 0) {
			var comments = getComments();
			new_comments = buildNewComments(comments);
		}
		return new_comments;
	}
	pub.export(getNewComments);


	function concatNewCommentsArray(comments) {
		new_comments = new_comments.concat(comments);
	}
	pub.export(concatNewCommentsArray);


	/*
	 * Gets the table from the DOM that contains the post text
	 *
	 * @returns {object} a <table> containing post text
	 */
	function getPostTable() {
		return document.getElementsByTagName('table')[2];
	}
	pub.export(getPostTable);

	/*
	 * Replace the HN comments table with a <div> of
	 * comments we constructed.
	 *
	 * @param {object} array of new comments
	 */
	function replaceComments(new_comments) {
		var tbody = commentsTbody();
		//remove enclosing <table> with all the comments
		tbody.parentElement.parentElement.removeChild(tbody.parentElement);
		var post_tbl = getPostTable();
		var new_container = createCommentsDOMFragment(new_comments);
		post_tbl.parentElement.insertBefore(new_container, post_tbl.nextSibling);
	}
	pub.export(replaceComments);

	/*
	 * Appends comments to the HN page DOM.
	 *
	 * @param {object} array of new comments
	 */
	function appendCommentsToDOM(comments) {
		var new_frag = createCommentsDOMFragment(comments);
		var all_frags = document.getElementsByClassName("wh-comments-container");
		var last_frag = all_frags[all_frags.length - 1];
		last_frag.parentElement.insertBefore(new_frag, last_frag.nextSibling);
	}
	pub.export(appendCommentsToDOM);

	/*
	 * This avoid reflowing the page on each insert.
	 *
	 * @param {object} array of new comments
	 *
	 * @returns {object> <div> with all the comments inserted
	 */
	function createCommentsDOMFragment(comments) {
		var container = document.createElement("div");
		container.className = "wh-comments-container";
		_.each(comments, function(c, i, ls) {
			var tree_container = document.createElement("div");
			tree_container.className = "wh-comment-tree-container";
			container.insertBefore(tree_container, null);
			tree_container.insertBefore(c, null);
			dom.shrinkComment(c);
			_.each(c.child_comments, function(c_, i_, ls_) {
				tree_container.insertBefore(c_, null);
				dom.hide(c_);
			});
		});
		return container;
	}

	/*
	 * Get DOM element from XPATH.
	 *
	 * @param {string} xpath
	 *
	 * @param {object} context for path, i.e. an element
	 */
	function xGet(path, c) { 
		var context = c || document; 
		return document.evaluate(path, 
															context,
															null,
															XPathResult.FIRST_ORDERED_NODE_TYPE
														).singleNodeValue; 
	}

	/*
	 * Gets the table from the DOM that contains all the comments
	 *
	 * @param {object} a document
	 *
	 * @returns {object} a <table> containing the comments
	 */
	function commentsTbody(d) {
		var doc = d || document;
		/* sometimes a notice is added to the top of the page which
		 * breaks this function.  first we check for that table and 
		 * remove it if it exists. */
		var notice_path = '/html/body/center/table/tbody/tr[2]/td/table';
		var notice = xGet(notice_path, doc);
		if (notice !== null) {
			var row = notice.parentElement.parentElement;
			row.parentElement.removeChild(row);
		}
		
		//location on first page
		var comments_tbody_xpath = '/html/body/center/table/tbody/tr[3]/td/table[2]/tbody';
		var tbody = xGet(comments_tbody_xpath, doc);
		if (tbody !== null && isComment(tbody.children[0])) {
			return tbody;
		} 
		//location on page # > 1
		var more_comments_tbody_xpath = '/html/body/center/table/tbody/tr[3]/td/table/tbody';
		var tbody_more = xGet(more_comments_tbody_xpath, doc);
		if (tbody_more !== null && isComment(tbody_more.children[0])) {
			return tbody_more;
		}
		throw new Error("couldn't find comments tbody");
	}
	pub.export(commentsTbody);

	/* 
	 * Gets comments from DOM
	 *
	 * @param {object} a document object
	 *
	 * @returns {object} array of table rows 
	 */
	function getComments(d) {
		var doc = d || document;
		var comments_tbody = commentsTbody(doc);
		var comment_rows = comments_tbody.children;
		comment_rows = _.filter(comment_rows, isComment);
		return comment_rows;
	}
	pub.export(getComments);


	/* 
	 * Returns the "child" comments of a top-level comment.
	 * Child comments are sibling <tr> in the DOM.
	 *
	 * @param {object} a top-level comment
	 * @returns {object} array of child comments
	 */
	function getChildComments(comment) {
		if (comment.child_comments !== undefined) {
			return comment.child_comments;
		} else {
			var children = [];
			var sibling = comment.nextElementSibling;
			while (sibling && isComment(sibling) && !isTopLevelComment(sibling)) {
				children.push(sibling);
				sibling = sibling.nextElementSibling;
			}
			return children;
		}
	}

	/* 
	 * Splits rows in content table into two sets:  one
	 * for top level comments and one for the rest 
	 *
	 * @param{object} array of table rows containing comments 
	 *
	 * @returns {object} map of two arrays: 
	 *	top-level comments and not top-level comments
	 */
	function splitCommentsByLevel(comments) {
		var split = _.partition(comments, isTopLevelComment);
		return {
			'top_level': split[0],
			'lower_level': split[1]
		};
	}
	pub.export(splitCommentsByLevel);//TODO: remove


	/* Tests if a DOM element is a comment.
	 * First test: is it a table row
	 * Second test: does is have some of the same DOM structure as a comment
	 *
	 * @param {object} DOM element
	 *
	 * @returns {boolean}
	 */
	function isComment(elem) {
		if (elem.localName === "tr") {
			var user_link = xGet('td/table/tbody/tr/td[3]/div/span/a[1]', elem);
			return user_link !== null;
		} else {
			return false;
		}
	}

	/* 
	 * Test if comment is top level comment.
	 * Hacker News uses an image with a fixed width to
	 * indent comments.  The width of that image determines
	 * whether a comment is "top level" or not.
	 *
	 * @param {object} table row containing a comment
	 * @returns {boolean} 
	 */
	function isTopLevelComment(comment) {
		var spacer = getSpacer(comment);
		return spacer && spacer.width === 0;
	}

	/*
	 * Function for finding the <img> tag for 
	 * the spacer of a comment
	 *
	 * @param {object} tr containing a comment
	 * @returns {object} img containing the spacer gif
	 */
	function getSpacer(comment) {
			return comment.getElementsByTagName("img")[0];
	}
	pub.export(getSpacer);

	function getStatus(comment) {
		var select = comment.getElementsByClassName("wh-select")[0];
		return select.selectedIndex;
	}
	pub.export(getStatus);


	return pub;
});
