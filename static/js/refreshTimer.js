/**
 * Automatically return to the home screen after prolonged inactivity
 *
 * @param {Number} time Milliseconds before refreshing
 */
function RefreshTimer(time) {
    var self = this,
        refreshTime = time,
        timer;

    /**
     * Reset the timer
     */
    this.resetTimer = function() {
        timer = setTimeout(self.refresh, refreshTime);
    };

    /**
     * Return to the home screen
     */
    this.refresh = function () {
        // Skip the homepage
        if ($('#home-container').length === 0) {
            if (FREEZING) {
                window.location = 'app://index.html?sendclicks=true';
            } else {
                window.location = '/?sendclicks=true';
            }
        }
    };

    // Reset the timer with every mouseup
    $('body').on('mouseup', function() {
        clearTimeout(timer);
        self.resetTimer();
    });

    this.resetTimer();
}
