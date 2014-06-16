
			j.it("test findMoreLink()", function() {
				var href = wh.findMoreLink();
				j.expect(href).toBeDefined();
				//the acutal id changes on each reload...
				j.expect(href.indexOf("x?fnid=")).toBeGreaterThan(-1);
			});
