/**
 * Creates a new FloorSelectorController instance.
 * @constructor 
 */ 
FloorSelectorController = function() {
    this.currentFloor = null;
    this.destinationFloor = null;
    this.sameHtml = '<span class="indicator same">Same Floor &#8594;</span>';
    this.currHtml = '<span class="indicator here">Current Floor &#8594;</span>';
    this.destHtml = '<span class="indicator there">Destination &#8594;</span>';
};

FloorSelectorController.prototype = {
    
    isSameFloor: function() {
        "use strict";

        console.log(this.currentFloor, this.destinationFloor);

        return this.currentFloor === this.destinationFloor;
    },

    setCurrent: function(floor) {
        "use strict";
        $('.current-floor').removeClass('current-floor');
        $('#' + floor + '-selector').addClass('current-floor');
    },
    
    init: function(currentFloor, destinationFloor) {
        "use strict";
        var $dfd = $.Deferred();

        this.currentFloor = currentFloor;
        this.destinationFloor = destinationFloor;
        $dfd.resolve();

        return $dfd.promise();
    },

    update: function() {
        "use strict";
        var $destination = $('#' + this.destinationFloor + '-selector'),
            $current = $('#' + this.currentFloor + '-selector');

        $('.floor-selector-link').removeClass('same-floor destination');

        if (this.isSameFloor()) {
            $destination.addClass('same-floor');
            $destination.parent().append(this.sameHtml);
        } else {
            $destination.addClass('destination');
            $destination.parent().append(this.destHtml);
            $current.parent().append(this.currHtml);
        }
        this.setCurrent(this.currentFloor);
    },

    run: function(currentFloor, destinationFloor) {
        "use strict";
        var self = this;
        self.init(currentFloor, destinationFloor)

        .then(function() {
            self.update();
        });
    }
};
