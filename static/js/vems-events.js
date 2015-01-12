/**
 * Parses VEMS data and outputs HTML using Handlebars.js.
 * @version 1.0.0
 * @author Tony Thomas <thoma127@umn.edu>
 */

/**
 * Creates a new VemsEventsController instance.
 * @constructor 
 */ 
VemsEventsController = function() {
    "use strict";
    /**
     * @property {object}
     */
    this.paginatedData = {};

    /**
     * @property {number}
     */
    this.resultsPerPage = 10;

    /**
     * @property {string}
     */
    this.url = 'http://api.sua.umn.edu/api/v1/ems_event/';

    /**
     * @property {object}
     */
    this.handlebarsContainer = $('#event-list-container'),


    /**
     * @property {string}
     */
    this.pageButtonHtml = '<div style="margin: 10px auto 0 auto; text-align:center; width:100%;">';
};

/**
 * @augments VemsEventsController
 */
VemsEventsController.prototype = {

    /**
     * Handlebars.js helper method to append pagination buttons based on
     * this.paginatedEvents
     * @since 1.0.0
     */
    appendButton: function(index, data) {
        "use strict";
        var page_number = index - 1;
        pageButtonHtml = pageButtonHtml + 
                           '<a href="#" id="page-' + page_number + 
                           '" data-page="' + page_number + 
                           '" class="touch-button maroon pagination';
        
        if (index === 1) {
            pageButtonHtml = pageButtonHtml + ' disabled';
        }
        
        pageButtonHtml = pageButtonHtml + 
                         '" style="margin-right: 25px;">Page ' + 
                         index + '</a>';
    },

    /**
     * Deferred method to handle pagination logic for Handlebars.js output
     * @param {object} data - returned from the AJAX request
     * @returns {object} - JQuery promise
     * @since 1.0.0
     */
    paginateEvents: function(data) {
        "use strict";
        var $dfd = $.Deferred(),
            self = this;
        
        console.log("Paginating...");

        $.each(data.objects, function() {
            var i=0,
                page = 1;
            if (!(page in self.paginatedData)) {
                self.paginatedData[page] = [];
            }

            // Compare first 3 characters of room (for CMU) or first 4 (for SPSC)
            if (this.room.substring(0, 3) === BUILDING.toUpperCase() || 
                    this.room.substring(0, 4) === BUILDING.toUpperCase()) {

                this.room_data = ems_rooms_to_locations[this.room];

                self.paginatedData[page].push(this);
                i++;
                if (i === self.resultsPerPage) {
                    page++;
                    i = 0;
                }
            }
        });

        $dfd.resolve();
        return $dfd.promise();
    },

    /**
     * Deferred method to render data to Handlebars.js
     * 
     * @since 1.0.0
     * @returns {object} - JQuery promise
    */
    renderEvents: function() {
        "use strict";
        var $dfd = $.Deferred(),
            context = {events: this.paginatedData},
            source  = $("#events-template").html(),
            template = Handlebars.compile(source),
            html = template(context);

        console.log('Rendering events in Handlebars...');

        this.handlebarsContainer.html(html);
        $dfd.resolve();
        return $dfd.promise();
    },

    /**
     * Binds newly loaded elements to existing functions after Handlebars.js
     * does it's thing
     * 
     * @since 1.0.0
    */
    binder: function() {
        "use strict";
        console.log('Binding new elements...');

        $('.pagination').on('mouseup', paginate);
        $('.tr-has-link').on('mouseup', go_to_href);
    },

};

// Instantiate the controller.
vec = new VemsEventsController();

// Make the request.
$.ajax({
    type: 'GET',
    url: vec.url,
    data: {
            format: 'jsonp',
        },
    dataType: 'jsonp',
}).done()
.then(function(data) {
    "use strict";
    // Paginate the data.
    vec.paginateEvents(data);
})
.then(function() {
    "use strict";
    // Render the events in Handlebars.
    vec.renderEvents();
})
.then(function() {
    "use strict";
    // Bind the new elements to necessary JS events after everything is
    // rendered.
    vec.binder();
});

/* Handlebars time formatting helper */
formatVemsTime = function(date_string) {
    "use strict";
    return moment(date_string).format('h:mma');
};

/* Handlebars helper to build buttons for pagination */
buildPageButtons = function(events) {
    "use strict";

    if (Object.keys(events).length > 1) {
        $.each(events, vec.appendButton);
        vec.pageButtonHtml = vec.pageButtonHtml + '</div>';
    } else {
        vec.pageButtonHtml = '';
    }
    return vec.pageButtonHtml;
};

/* Register Handlebars helpers. */
Handlebars.registerHelper('formatVemsTime', formatVemsTime);
Handlebars.registerHelper('buildPageButtons', function(events) {
    "use strict";
    buildPageButtons(events);
});

