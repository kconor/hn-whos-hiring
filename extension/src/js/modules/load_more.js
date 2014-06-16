/* jshint -W097 */
"use strict";
define(["underscore", "logger", "interface"], 
function(_,            logger,   Interface) { 

	var pub = new Interface();
	/* 
	 * Creates document object from html
	 *
	 * @param {string} html loaded from xhr request
	 * @returns {object} a document object
	 */
	function htmlToDoc(html) {
		var new_doc = document.implementation.createHTMLDocument("");
		new_doc.body.innerHTML = html;
		return new_doc;
	}
	pub.export(htmlToDoc);


	/* 
	 * Searches DOM for "More" link which loads more comments
	 * from the post.
	 *
	 * @returns {string} href of link
	 */

	var link_RE = /href="(\/x\?fnid=[A-z0-9]+)\"/;
	function findMoreLink(doc) {
		var title_class = doc.getElementsByClassName('title');
		var link = _.find(title_class, function(e) {
			return e.innerText.indexOf("More") === 0;
		});
		if (link !== undefined) {
			/* Sometimes a link will look like:
			 *   <a href="/x?fnid=SezN2hvf5wykHUopL2HVn2" rel="nofollow">More</a>
			 * but href will be "".  We can use a regex on the parent's innerHTML
			 * to pull out the href.  */
			if (link.children[0].href === "") {
				var match = link_RE.exec(link.innerHTML);
				if (match[1] !== undefined) {
					return match[1];
				} else {
					return undefined;
				}
			} else {
				return link.children[0].href;
			}
		} else {
			return link;
		}
	}
	pub.export(findMoreLink);


	/* 
	 * Function called on state change by XHR.
	 * Used on loading paginated comments 
	 *
	 * @param {string} href of page to load
	 */
	function downloadMoreLink(href) {
		return new Promise(function(resolved, error) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", href, true);//async=true
			xhr.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						resolved(this.response);
					} else {
						error(new Error("couldn't load " + href));
					}
				}
			};
			xhr.send();
		});
	}
	pub.export(downloadMoreLink);

	return pub;
});
