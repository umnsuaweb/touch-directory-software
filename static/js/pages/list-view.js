var offset_page = function() {
        "use strict";
        var $page = $(this),
            page_number = $page.attr('id').replace('page-', '');

        $page.css('left', ((page_number - 1) * 1350)+ 'px');
    },
    bind_page_buttons = function(){
        "use strict";
        var $link = $(this),
            number = $link.text();

        // Scroll to the page
        $('#list-view').scrollTo('#page-' + number, 800);

        // Re-setup the href attributes
        $('a.page').each(function() {
            $(this).attr('href', '#page-' + $(this).text());
        });

        //$link.removeAttr('href');

        // Update the history
        //$.get(BASE_HREF + '/' + BUILDING + '-' + ORIENTATION + '/history/hash/' + number);
        window.location.hash = number;
    };

$('.page').each(offset_page);
$('td.item, #quick-find').mouseup(go_to_href);
$('a.touch-button').mouseup(bind_page_buttons);

// Pre-defined page
if (window.location.hash != '') {
    var page = window.location.hash.substr(1);
    $('#list-view').scrollLeft($('#page-' + page).position().left);
    $('.open-page-' + page).removeAttr('href');
    $.get(BASE_HREF + '/' + BUILDING + '-' + ORIENTATION + '/history/hash/' + page);
} else {
    $('.open-page-1').removeAttr('href');
}
