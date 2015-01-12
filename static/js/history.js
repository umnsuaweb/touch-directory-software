/**
 * Manages navigation w/ back and forward buttons on screen and keeps track
 * of where we are in the history so we can disable the forward button when we
 * reach the end
 * @version 1.0.0
 * @author Tony Thomas <thoma127@umn.edu>
 */


/**
 * Creates a new HistoryController instance.
 * @constructor 
 */ 
function HistoryController() {
    "use strict";
    /**
     * @property {string}
     */
    this.historyIndex = sessionStorage.getItem('historyIndex');

    /**
     * @property {object}
     */
    this.history = window.history;

    /**
     * @property {object}
     */
    this.backButton = $('#back-button');

    /**
     * @property {object}
     */
    this.frwdButton = $('#forward-button');

    // If there is no saved index, set it to 1.
    if (this.historyIndex === null) {
        this.historyIndex = 1;
    }
}

/**
 * @augments HistoryController
 */
HistoryController.prototype = {

    /**
     * Sets the forward button state to 'disabled' if we reach the end of the
     * browser history
     * @since 1.0.0
    */
    setButtonState: function() {
        if (this.isLast()) {
            this.frwdButton.addClass('disabled');
        } else {
            this.frwdButton.removeClass('disabled');
        }
    },

    /**
     * Saves the index of the user's place in the browser history to local
     * storage so it will persist across page views
     * @since 1.0.0
     */
    saveIndex: function() {
        var $dfd = $.Deferred();

        // Save these so they persist across page views.
        sessionStorage.setItem('historyIndex', this.historyIndex);

        console.log('Saving index: ', this.historyIndex, 'history.length: ', window.history.length);

        $dfd.resolve();
        return $dfd.promise();
    },

    /**
     * Compares the saved index in the browser history with the current length
     * of the browser history to determine whether or not we're at the end
     * @since 1.0.0
     */
    isLast: function() {
        
        console.log('isLast: ', parseInt(sessionStorage.getItem('historyIndex')) === this.history.length);

        return parseInt(sessionStorage.getItem('historyIndex')) === this.history.length;
    },

    /**
     * Increments or decrements this.historyIndex and saves the updated count
     * to sessionStorage
     * @param {string} - 'add' or 'subtract'
     * @returns {object}
     * @since 1.0.0
     */
    updateHistoryIndex: function(operator) {
        var $dfd = $.Deferred();

        switch(operator) {
            case "add":
                this.historyIndex++;
                break;
            case "subtract":
                this.historyIndex--;
                break;
        }

        console.log('Updating history index.');

        $dfd.resolve();
        return $dfd.promise();
    },

};

// Instantiate a new HistoryController object.
var hc = new HistoryController();

// Bind events to the back button.
hc.backButton.on('click', function(e) {
    e.preventDefault();
    hc.updateHistoryIndex('subtract')
        .then(function() {
            hc.saveIndex();
        })
        .then(function() {
            hc.history.go(-1);
        });
});

// Bind events to the forward button.
hc.frwdButton.on('click', function(e) {
    e.preventDefault();
    hc.history.go(1);
});

// Set the back and forward button states each time a page loads.
$(window).on('load', function(e) {
    hc.setButtonState(e);

    console.log('historyIndex: ', sessionStorage.getItem('historyIndex'), 'window.history.length: ', window.history.length);

});

// Update the saved history index every time users click on a link.
$('a').on('click', function(e) {
    "use strict";
    var $link = $(this);
    e.preventDefault();

    if (!$link.hasClass('history-index-ignore')) {
        hc.updateHistoryIndex('add')
        .then(function() {
            hc.saveIndex();
        })
        .then(function() {
            if (typeof $link.attr('href') !== 'undefined' && $link.attr('href') !== '#') {
                window.location.href = $link.attr('href');
            }
        });
    }
});

