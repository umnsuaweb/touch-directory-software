var restart_interval,
    table_links = $('.tr-has-link'),
    diagram = new Diagram('diagram-container'),

    toggle_active = function() {
        "use strict";
        // Add the pseudo hover state after the mouse has moved to
        // avoid highlighting a row before use touches the screen
        table_links.mouseover(function () {
            $(this).addClass('active');
        }
        ).mouseout(function () {
            $(this).removeClass('active');
        });
    },

    go_to_href = function(e) {
        "use strict";
        // Make the whole <tr> clickable
        var href = $(this).find('a').attr('href');
        ClickController.saveClick(e);
        window.location = href;
    },

    clickable_icons = function () {
        "use strict";
        var className = $(this).parent().attr('class').split(' ')[1],
            category = className.split('-')[0],
            reset_markers = function() {
                // Allow icons to be clickable, highlighting that category
                diagram.showAllMarkers();
                diagram.cycleThroughMarkers(2800, 'restroom');
            };

        // Clear the timer so it can be reset later
        if (typeof restart_interval != 'undefined') {
            clearTimeout(restart_interval);
        }

        // Determine the category name
        diagram.fadeMarkerCategory(category);
        diagram.stopCycle();

        // Restart the cycle after a few seconds
        restart_interval = setTimeout(reset_markers, 10000);
    };


//table_links.mouseup(go_to_href);
table_links.on('click mouseup', go_to_href);

$('body').mousemove(toggle_active);

diagram.cycleThroughMarkers(2800, 'restroom');

$('.diagram-container .marker-box:not(.touch-directory) .marker-inner').mouseup(clickable_icons);

