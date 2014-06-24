/* jshint -W097 */
"use strict";
define(["underscore",
				"logger",
				"interface",
				"comments",
				"search"], 
function(_,
					logger,
					Interface,
					com,
					search) { 

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


	/*
	 * Recursively follow "more" links and 
	 * append comments to main page. 
	 *
	 * @param {object} a document in which to find the link
	 */
	function loadMoreComments(doc, href) {
		var link = href || findMoreLink(doc);
		if (link !== undefined) {
			logger.log("loadMoreComments() - " + link);
			downloadMoreLink(link).then(
				function(response) {
					var new_doc = htmlToDoc(response);
					var new_com = com.getComments(new_doc);
					var new_new_com = com.buildNewComments(new_com);
					com.appendCommentsToDOM(new_new_com);
					com.concatNewCommentsArray(new_new_com);
					updateLoadMoreCount(com.getNewComments().length);
					search.addToIndex(new_new_com);
					loadMoreComments(new_doc);
			},function(error) {
				logger.log(error);
			});
		} else {
			logger.log("loadMoreComments() - didn't find link");
		}
	}
	pub.export(loadMoreComments);


	/*
	 * Every time a new page of job posts is loaded, increment the 
	 * counts underneath the form 
	 *
	 * @param {number} the total number of job posts (top-level comments)
	 */
	var count_RE = /[0-9]+/;
	function updateLoadMoreCount(num_posts) {
		var count_span = document.getElementById("wh-load-count");
		if (count_span.innerText === "") {
			count_span.innerText = "Loaded 1 page containing " + num_posts + " job posts.";
		} else {
			var match = count_RE.exec(count_span.innerText);
			if (match !== null) {
				var count = parseInt(match[0]);
				count++;
				count_span.innerText = "Loaded " + count + " pages containing " + num_posts + " job posts.";
			} else {
				count_span.innnerText = "";
			}
		}
	}
	pub.export(updateLoadMoreCount);

	return pub;
});
