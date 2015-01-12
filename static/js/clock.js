/**
 * Clock
 */
function Clock() {
    $('p#time').text('').append('<span id="time-hours"></span><span id="time-sep">:</span><span id="time-details"></span>');

    $('span#time-hours').jclock({
        format: '%I', // 04:13PM Jan 4
        timeout: 60000 // 1 minute
    });

    $('span#time-details').jclock({
        format: '%M%P %b %d',
        timeout: 60000
    });
}
