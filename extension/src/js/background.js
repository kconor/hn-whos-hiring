/* jshint -W097 */
"use strict";
/* Add a listener that runs when the extension is installed
 * or updated */
chrome.runtime.onInstalled.addListener(function() {

	/* Remove all rules then add a rule that displays the page
	 * action icon when the browser is at hacker news. */
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { urlContains: '127.0.0.1:8080' },
          }),
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      },
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'news.ycombinator.com' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      },
    ]);
  });

	/* Add a listener for when the page action icon is clicked.
	 * The listener injects the javascript needed to run the extension */
	chrome.pageAction.onClicked.addListener(
		/* TODO
		 * this does not get run "onClick" if the page has been refreshed... */
		function(message, sender, sendResponse) {
			/* We want to inject four javascript files when the icon is clicked:
			 * 1: require.js to load modules
			 * 2: require_config.js to setup paths for require.js
			 * 3: requirejs_new_load.js to override require.js's load function
			 *		so modules are loaded from their appropriate extension url
			 * 4: content.js so our content script runs */
			chrome.tabs.executeScript(null, { code: "console.log('page action clicked');" });
			chrome.tabs.executeScript(null, { file: 'js/lib/require.js' } );
			chrome.tabs.executeScript(null, { file: 'js/requirejs_config.js' } );
			chrome.tabs.executeScript(null, { file: 'js/requirejs_new_load.js' } );
			chrome.tabs.executeScript(null, { file: 'js/content.js' } );

			/* add CSS to page */
			chrome.tabs.insertCSS(null, { file: 'css/content.css' } );
		});
});
