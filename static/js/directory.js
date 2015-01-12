/**
 * Touch Screen Directory
 *
 * @fileoverview
 * @package tdir
 */

/**
 * @final
 */
var fancybox_settings = {
    hideOnContentClick: true,
    hideOnOverlayClick: true,
    overlayOpacity: 0.0,
    overlayShow: true,
    title: 'Touch anywhere to close image',
    transitionIn: 'elastic',
    transitionOut: 'elastic',
    zoomSpeedIn: 800,
    zoomSpeedOut: 800
};

$(document).ready(function () {
    "use strict";

    // Load the tool container, floor selector, directory elements and
    // destination elements into vars so we only have to find them once.
    var tool_container = $('#tool-container'),
        $pulse_directories = $('canvas.touch-directory'),
        $pulse_destinations = $('canvas.destination');

    // Show/hide the menu in the upper right.
    $('#tool-container-touch').on('mouseup', function () {
        tool_container.toggleClass('hidden');
    });

    // Return to the home screen after 2 minutes of no activity, but only in
    // production mode.
    if (DEBUG === false) {
        new RefreshTimer(120000);
        console.log('DEBUG is false. Instantiating RefreshTimer().');
    }

    // <canvas> pulsators
    $pulse_directories.each(function() {
        new Pulse($(this).get(0), 10, '0, 196, 0', '0, 127, 0', true, -0.4);
    });

    // <canvas> pulsators
    $pulse_destinations.each(function() {
        new Pulse($(this).get(0), 7, '140, 0, 0', '200, 0, 0');
    });

    // Fancybox settings
    $('a.fancybox').fancybox(fancybox_settings);

    // Real-time clock
    new Clock();

    // Refresh the page when someone clicks the clock
    $('#time').on('mouseup', function () {
        window.location.reload();
    });
});
