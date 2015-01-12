var location_diagram = new Diagram('location-details-floor-map'),
    $fancybox_elem = $('.fancybox'),
    image,
    destination_marker;

// Bounce SPSC's single, lonely elevator
if (BUILDING == 'spsc') {
    location_diagram.bounceMarkerCategory('connection-elevator');
}

// Add fancybox pop-up to "Destination" marker if a photo is available
if ($fancybox_elem.length !== 0) {
    image = $fancybox_elem.attr('href');
    destination_marker = $('#location-details-floor-map .marker-box.destination .marker-inner a');

    // Copy the URL from the description box
    destination_marker.attr('href', image);

    // Setup Fancybox for the destination link
    destination_marker.fancybox(fancybox_settings);
}

// Bounce destination marker when the user clicks on the floor map
$('a.destination').unbind('mouseup').click(function (e) {
    e.preventDefault();
})
.bind('mouseup', function () {
    location_diagram.bounceMarkerCategory('destination');
});
