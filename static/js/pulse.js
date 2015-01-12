/**
 * Pulse initiator
 *
 * @param {Object}  JQuery object
 * @param {Number}  radius
 * @param {String}  strokeColor x, y, z
 * @param {String}  fillColor   x, y, z
 * @param {Boolean} addLine
 * @param {Number}  startAngle
 */
function Pulse($canvas, radius, strokeColor, fillColor, addLine, startAngle) {
    "use strict";
    var ctx = $canvas.getContext('2d'),
        rings = [],
        ring = new Ring(radius, ctx, strokeColor, fillColor, addLine, startAngle),
        proxy = ring.grow;

    ring.radiusDiff = 0;
    ring.maxRings = 3;

    ring.grow = function() {
        var radiusBefore = this.radius;
        proxy.call(this);
        this.radiusDiff += this.radius - radiusBefore;

        if (this.radiusDiff > 3 && rings.length <= this.maxRings) {
            this.radiusDiff = 0;
            rings.push(new Ring(radius, ctx, strokeColor, fillColor, addLine, startAngle));
        }
    };

    rings.push(ring);
    ctx.lineWidth = 1;

    // To center on origin
    ctx.translate(25, 25);

    // So nib points straight up
    ctx.transform(Math.cos(Math.PI / 2), -Math.sin(Math.PI / 2), Math.sin(Math.PI / 2), Math.cos(Math.PI / 2), 0, 0);

    setInterval(
        function() {
            ctx.clearRect(-25, -25, 50, 50);

            var x = rings.length;
            while (x--) {
                rings[x].draw();
            }
        },
        50
    );
}

/**
 * Pulse ring
 *
 * @constructor
 * @param {Number}  radius
 * @param {Object}  ctx          Canvas rendering object
 * @param {String}  strokeColor x, y, z
 * @param {String}  fillColor   x, y, z
 * @param {Boolean} addLine
 * @param {Number}  startAngle
 */
function Ring(radius, ctx, strokeColor, fillColor, addLine, startAngle) {
    // Initial values used for resetting
    this.radiusInit = radius;
    this.opacityInit = 1;
    this.radius = radius;
    this.opacity = this.opacityInit;

    // Canvas object
    this.ctx = ctx;

    // Colors
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;

    this.addLine = (typeof addLine != 'undefined') ? addLine : false;
    this.startAngle = (typeof startAngle != 'undefined') ? startAngle : 0;
}

Ring.prototype = {
    twoPi: 2 * Math.PI,

    /**
     * Increase the radius and opacity of the ring
     */
    grow: function() {
        this.radius += 0.5;
        this.opacity -= 0.075;

        // Reset?
        if (this.opacity <= 0) {
            this.radius = this.radiusInit;
            this.opacity = this.opacityInit;
        }
    },

    /**
     * Draw the ring
     */
    draw: function() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, this.startAngle, this.twoPi + Math.abs(this.startAngle), 'clockwise');
        if (this.addLine === true) {
            this.ctx.lineTo(2 * this.radius, 0);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = 'rgba(' + this.strokeColor + ', ' + this.opacity + ')';
        this.ctx.fillStyle = 'rgba(' + this.fillColor + ', ' + this.opacity + ')';
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius + 1, this.startAngle, this.twoPi + Math.abs(this.startAngle), 'clockwise');
        if (this.addLine === true) {
            this.ctx.lineTo((this.radius + 1) * 2, 0);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
        this.ctx.stroke();

        this.grow();
    }
};
