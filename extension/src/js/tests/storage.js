/* jshint -W097, devel: true*/
"use strict";
define(["storage"], function(db) {

	function buildSuite(j /*jasmine interface*/) {
		j.describe("Storage API tests", function() {
			var link_id = 'badbeef'; //will not collide with actual link id's
			var attr = 'feebdab';
			var key = link_id + attr;
			var value = true;

			j.afterEach(function(done) {
				db.remove(link_id, attr);
				done();
			});

			j.it("test get(), set(), and remove(): (5)", function(done) {
				/* verify link_id isn't in db*/
				db.get(link_id, attr).then(function(result) {
					//promise not expected to be fulfilled, fail test:
					j.expect(false).toBe(true);
					done();
				}, function(error) {
					//expect and error b/c it doesn't exist yet
					j.expect(error).toBeDefined();
					return db.set(link_id, attr, value);
				}).then(function(result) {
					//expect applied() not to throw exception
					j.expect(result).toBe(true);
					return db.get(link_id, attr);
				}, function(error) {//applied()
					console.log(error);
					j.expect(false).toBe(true);
					done();
				}).then(function(result) {
					//expect applied to be set to true
					j.expect(result[key]).toBe(true);
					return db.remove(link_id, attr);
				}, function(error) {//getApplied()
					console.log(error);
					j.expect(false).toBe(true);
					done();
				}).then(function(result) {
					//expect clearApplied() not to throw an exception
					j.expect(result).toBe(true);
					return db.get(link_id, attr);
				}, function(error) {//clearApplied()
					console.log(error);
					j.expect(false).toBe(true);
					done();
				}).then(function(result) {
					j.expect(false).toBe(true);
					done();
				}, function(error) {//getApplied()
					/* expect getApplied() to throw an exception after
					 * applied has been cleared */
					j.expect(error).toBeDefined();
					done();
				});
			});
		});
	}
	return {
		buildSuite: buildSuite
	};
});
