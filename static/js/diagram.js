/**
 * Diagram class for handling markers
 *
 * This constructor takes an inventory of the markers
 * categories and class names.
 *
 * @constructor
 * @author Ethan Poole
 * @param  {String} diagram ID of the floor diagram
 */
function Diagram(diagram) {
    var self = this;

    // ID of the floor diagram
    this.diagram = diagram;

    // Marker categories and corresponding class names
    this.categories = [];
    this.categoryClasses = {};

    //  Used to prevent markers jumping around
    this.bouncingMarkers = [];

    // Timeouts
    this.descriptionTimeout = null;

    /**
     * Show a connection object's description
     *
     * @param {Event}  e
     * @param {jQuery} description
     */
    this.showDescription = function (e, description) {
        // Stop any set timeouts and remove mouseup bind
        clearTimeout(self.descriptionTimeout);
        $('#viewport').unbind('mouseup');

        // Get the description (via the event or the parameter)
        if (typeof description == 'undefined') {
            description = $(this).siblings('div.description-container');
        }

        // Hide the description
        if (description.hasClass('show')) {
            description.css('width', '0px').removeClass('show');
            $('div.to-top').removeClass('to-top');
        } else {
            // Hide any existing descriptions
            $('div.description-container.show').css('width', '0px').removeClass('show');
            $('div.to-top').removeClass('to-top');

            description.css('width', '122px').addClass('show');
            description.parent().addClass('to-top');

            // Timeout to remove
            self.descriptionTimeout = setTimeout(function() {
                self.showDescription(null, description);
            }, 5000);

            // Bind to remove upon tap
            description.one('webkitTransitionEnd', function () {
                $('#viewport').on('mouseup', function () {
                    self.showDescription(null, description);
                });
            });
        }

        // Stop event bubbling
        return false;
    };

    // Require a floor diagram to be set and present
    if (typeof this.diagram == 'undefined' || $('.' + this.diagram).length === 0) {
        return false;
    }

    // Loop through markers to extract class names and categories
    $('.' + this.diagram + ' div.marker-box').each(function() {
        // Note: this == the current marker box, use self for properties/methods of Diagram

        var className = $(this).attr('class').split(' ')[1];

        // Exclude the touch-directory icon
        if (className != 'touch-directory') {
            var category = className.split('-')[0];

            // Add the category
            self.categories.push(category);

            // Add the class to the category array or create the array need be
            if (typeof self.categoryClasses[category] == 'undefined') {
                self.categoryClasses[category] = new Array(className);
            } else {
                self.categoryClasses[category].push(className);
            }

            self.categoryClasses[category] = self.categoryClasses[category].unique();

            if ($(this).find('div.description-container').length !== 0) {
                // Tell the popup to slide out the left (right positioning) if it will overflow
                var markerPosition = $(this).position().left;
                var markerOffset = $(this).offset().left;
                var parentWidth = $(this).parent().width();
                if ((markerPosition + 122) - parentWidth > 0 || (markerOffset + 122) - $('div#viewport').width() > 0) {
                    $(this).find('div.description-container').addClass('right');
                }

                $(this).find('div.marker-inner').on('mouseup', self.showDescription);
            }
        }
    });

    self.categories = self.categories.unique();
}

Diagram.prototype = {
    /**
     * Fade in a specific marker category
     *
     * @param {String} category
     */
    fadeMarkerCategory: function(category) {
        var fadeIn = null,
            fadeOut = null;

        // Highlight an entire category of markers (e.g. restroom)
        if (typeof this.categoryClasses[category] != 'undefined') {
            fadeIn = $('.' + this.diagram + 
                       ' div.marker-box.' +
                       this.categoryClasses[category].join(' .marker-inner, .' + 
                       this.diagram + ' div.marker-box.') + 
                       ' .marker-inner');

            fadeOut = $('.' + this.diagram + 
                        ' div.marker-box:not(.touch-directory.' + 
                        this.categoryClasses[category].join('.') + 
                        ')  .marker-inner');
        } else {
            // Highlight just a specific class (e.g. restroom-men)
            fadeIn = $('.' + this.diagram + 
                       ' div.marker-box.' + 
                       category + 
                       ' .marker-inner');
            fadeOut = $('.' + this.diagram + 
                        ' div.marker-box:not(.touch-directory.' + 
                        category + 
                        ')  .marker-inner');
        }

        fadeOut.fadeTo(300, 0.3);
        fadeIn.fadeTo(300, 1.0);
    },

    /**
     * Show all markers
     */
    showAllMarkers: function() {
        $('.' + this.diagram + ' div.marker-box .marker-inner').fadeTo(300, 1.0);
    },

    /**
     * Cycle through the markers on a diagram to enhance legibility
     *
     * @param {Number} speed     Milliseconds between each rotation
     * @param {String} showFirst Which marker set to show first
     */
    cycleThroughMarkers: function(speed, showFirst) {
        var self = this;

        // Set the default rotation speed
        if (typeof speed === 'undefined') {
            speed = 1000;
        }

        // Determine which marker to use first
        var x = 0;
        if (typeof showFirst != 'undefined') {
            var y = self.categories.length;
            while (y--) {
                if (self.categories[y] == showFirst) {
                    x = y;
                    break;
                }
            }
        }

        // Create the interval to rotate through the marker categories
        var z = self.categories.length;
        self.cycleInterval = setInterval(function() {
            // Show all markers before continuing to the next cycle
            if (x == z) {
                self.showAllMarkers();
                x = 0;
            } else {
                self.fadeMarkerCategory(self.categories[x]);
                x++;
            }
        },
        speed);
    },

    /**
     * Stop the marker cycle
     */
    stopCycle: function ()
    {
        clearInterval(this.cycleInterval);
    },

    /**
     * Bounce a specific marker category
     *
     * @param {String}   category
     * @param {Function} bindFunction Function to bind to the legend after animation
     */
    bounceMarkerCategory: function(category, bindFunction) {
        var self = this;

        // Unbind the click event to avoid weird animation
        $('#diagram-legend ul li a[rel=' + category + ']').unbind('mouseup', bindFunction);

        // Further protection from the weird animation
        if (!self.bouncingMarkers.inArray(category)) {
            // Record category as bouncing
            self.bouncingMarkers.push(category);

            $('div#' + self.diagram + ' div.marker-box[class*=' + category + '] .marker-inner').addClass('bounce');

            // Callback
            setTimeout(function() {
                // Re-bind the click event and remove bounce class
                $('#diagram-legend ul li a[rel=' + category + ']').bind('mouseup', bindFunction);
                $('div#' + self.diagram + ' div.marker-box[class*=' + category + '] .marker-inner').removeClass('bounce');

                // Remove the category as bouncing
                var x = self.bouncingMarkers.length;
                while (x--) {
                    if (self.bouncingMarkers[x] == category) {
                        self.bouncingMarkers.splice(x, 1);
                        break;
                    }
                }
            }, 1000);
        }
    }
};

