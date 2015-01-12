/**
 * Tests the history api.
 *
 * Clicks on a couple of links on the page and then hits the back button on the
 * screen to get back to the home screen.
*/
var thisIsStrictlyThat = function(firstThing, secondThing) {
    return firstThing === secondThing;
};

casper.test.begin('Make sure back and forward buttons properly use the history API', 
    10, 
    function suite(test) {
        var homeUrl = 'http://127.0.0.1:5000/',
            firstUrl,
            secondUrl;

        /** Click on first location link */
        casper.start(homeUrl, function() {
            this.click('tr.tr-has-link a');
        });

        /** Save the url to a var */
        casper.then(function() {
            firstUrl = this.getCurrentUrl();
        });

        /** Click on the first floor link */
        casper.then(function() {
            this.click('#floor-selector a');
        });

        /** Assert that the forward button has the 'disabled' class */
        casper.then(function() {
            test.assertExists('#forward-button.disabled');
        });

        /** Set that url to a var **/
        casper.then(function() {
            secondUrl = this.getCurrentUrl();
        });

        /** Click on the back button */
        casper.then(function() {
            this.click('#back-button');
        });

        /** Assert that we've reached the expected URL */
        casper.then(function() {
            test.assert(thisIsStrictlyThat(this.getCurrentUrl(), firstUrl), "Went to expected page after clicking back button once");
        });

        /** Try moving forward */
        casper.then(function() {
            this.click('#forward-button');
        });

        /** Assert that we reached the expected URL of the forward button */
        casper.then(function() {
            test.assert(thisIsStrictlyThat(this.getCurrentUrl(), secondUrl), "Went to expected page after clicking forward button once");
        });

        /** Click the back button again */
        casper.then(function() {
            this.click('#back-button');
        });

        /** Click the back button again */
        casper.then(function() {
            this.click('#back-button');
        });

        /** Assert that we've reached the expected URL this time too */
        casper.then(function() {
            test.assert(thisIsStrictlyThat(this.getCurrentUrl(), homeUrl), "Went to expected page after clicking back button twice");
        });

        /** Giddyup! */
        casper.run();
    });
