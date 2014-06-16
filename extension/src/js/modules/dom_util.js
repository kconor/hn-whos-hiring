/* jshint -W097 */
"use strict";
define(["underscore", "interface"], 
function(_,            Interface) { 

	var pub = new Interface();

	/*
	 * Hides DOM element
	 *
	 * @param {object} DOM element
	 */
	function hide(e) {
		e.style.display='none';
	}
	pub.export(hide);

	/*
	 * Shows comments by setting display attribute to block
	 *
	 * @param {object} array of DOM elements contain comments
	 */
	function show(e) {
		e.style.display = "block";
	}
	pub.export(show);

	/*
	 * Sets class of comment to shrink its size
	 *
	 * @param {object} a comment <tr>
	 */
	function shrinkComment(comment) {
		comment.style.maxHeight = "7em";
		comment.style.overflow = "hidden";
	}
	pub.export(shrinkComment);

	/*
	 * Shrinks an entire "comment tree"
	 * Starts with the top-level comment and shrinks it.
	 * Then hides all the child comments.
	 *
	 * @param {object} top-level comment
	 */
	function shrinkTree(comment) {
		shrinkComment(comment);
		_.each(comment.child_comments, function(c, i, ls) {
			hide(c);
		});
	}
	pub.export(shrinkTree);

	/*
	 * Sets class of comment to restore its size
	 *
	 * @param {object} comment <tr>
	 */
	function expand(comment) {
		comment.style.maxHeight = "none";
		comment.style.overflow = "none";
	}
	pub.export(expand);

	/*
	 * Expands "comment tree" for viewing
	 * First expands the top-level comment.
	 * Then shows each of the child comments.
	 *
	 * @param {object} top-level comment <tr>
	 */
	function expandTree(comment) {
		expand(comment);
		_.each(comment.child_comments, function(c, i, ls) {
			show(c);
		});
	}
	pub.export(expandTree);

	return pub;
});
