var set_page_offset = function () {
        "use strict";
        // Set pagination offsets dynamically
        var $page = $(this),
            page_number = $page.data('page');

        $page.css('top', ((page_number) * 570)+ 'px');
    },
    paginate = function() {
        "use strict";
        var $page = $(this),
            number = $page.data('page');

        // Scroll to the page but only if the button is not disabled
        if (!$page.hasClass('disabled')) {
            $('#event-list').scrollTo('#event-page-' + number, 800, {axis: 'y', margin: true});
        }
        // Re-setup the href attributes
        $('.pagination').each(function () {
            $(this).attr('href', '#event-page-' + number);
        });

        $page.removeAttr('href');

        //enable the disabled button
        $('a.disabled').removeClass('disabled');

        //disable the formerly enabled button
        $page.addClass('disabled');

        // Update the history
        //$.get(BASE_HREF + '/' + BUILDING + '-' + ORIENTATION + '/history/hash/' + number);
        window.location.hash = number;
    };

Handlebars.registerHelper('tidepath', function(path) {
    "use strict";
    if (FREEZING === true) {
        return 'app:/' + path;
    }
    return path;
});
