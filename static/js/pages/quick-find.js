var initial_floor_hash,
    initial_floor = DEFAULT_FLOOR,
    $button_list = $('#button-list'),
    $floor_buttons = $('.floor-button'),
    quick_find_diagram = new Diagram('quick-find-floor-map'),
    overall_category = $('#quick-find-floor-map').data('category'),
    $diagram = $('#diagram-pane'),

    // Updates the h1
    update_heading = function(text) {
        "use strict";
        $('h1').text(text);
    },

    // Changes the state of the page when floor buttons are clicked
    // Right now this is creating two entries in history for each click.
    floor_button_click_handler = function(e) {
        "use strict";
        var $floor_button = $(this),
            heading_text = $floor_button.data('floor-text'),
            hash = '#floor-' + $floor_button.data('floor');

        e.preventDefault();
        update_heading(heading_text);
        window.location.hash = hash;
    },

    // Changes the state of the page according the url hash
    hashchange_handler = function() {
        "use strict";
        var hash = window.location.hash.replace('floor-', ''),
            $button = $(hash + '-link'),
            heading_text = $button.data('floor-text');

        console.log('quick-find.js > hashchange_hander: hash: ', hash);

        activate_scroll(hash)
    }
    
    // Scrolling works because of a CSS transition for the top property
    activate_scroll = function(hash) {
        "use strict";
        var $dfd = $.Deferred();

        if (typeof $(hash).position().top !== 'undefined') {
            $diagram.css('top', ($(hash).position().top * -1) + 'px');
        }

        $dfd.resolve();
        return $dfd.promise();
    };

/*
 * If the default floor doesn't have anything in the category, start w/ the 
 * first floor that does.
 */
if ($("#" + initial_floor).length === 0) {
    initial_floor = $floor_buttons.first().data('floor');
}

/*
 * Set up a listener for a hashchange event so we can trigger scrolling and 
 * preserve the state of the page for the forward and back buttons.
 */
$(window).on('hashchange', hashchange_handler);

$(window).on('load', function() {
    "use strict";
    var hash = window.location.hash.replace('floor-', '');
    activate_scroll(hash);
});

// Bounce the category markers.
quick_find_diagram.bounceMarkerCategory(overall_category, floor_button_click_handler);

// Bind the floor buttons to the floor button handler function.
$floor_buttons.on('click', floor_button_click_handler);

// Set the history button state on in-page links
$('.history-button').on('click', function() {
    hc.setButtonState();
});

