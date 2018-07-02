testing strategy notes

problems with end to end / integrated testing in practice:
it's easy to write the tests that don't exercise the edge cases of integration (e.g. http status codes)
but instead just test a happy path journey through the browser.

therefore there can be a tendancy to write these simple tests in an overly integrated environment when you can prove just as much with these tests in a non-integrated environment.

and the tests that are important to write in an integrated environment (e.g. when my external systems start acting strangely, not happy path) are much harder to write so get missed. The problem is that these are pretty much the ONLY tests worth writing as integration tests anyway!
