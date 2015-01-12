/**
 * Standard library for JavaScript
 *
 * @fileoverview
 */

/**
 * Avoid closure by creating a dummy function
 *
 * @param {Object} object
 * @param {String} method
 */
function bind(object, method)
{
    return function ()
    {
        object[method]();
    };
}

/**
 * Shortcut prototype-based inheritance
 *
 * @author http://phrogz.net/js/classes/OOPinJS2.html
 * @param  {Object|Function} parentClassOrObject
 * @type   Function
 */
Function.prototype.inheritsFrom = function (parentClassOrObject)
{
    // Normal inheritance
    if (parentClassOrObject.constructor == Function)
    {
        this.prototype = new parentClassOrObject();
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    }
    // Pure virtual inheritance
    else
    {
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }

    return this;
};

/**
 * JavaScript equivalent of PHP's in_array()
 *
 * @author Ethan Poole
 * @param  {String} value
 * @type   Boolean
 */
Array.prototype.inArray = function (value)
{
    var l = this.length;
    while (l--)
    {
        if (this[l] == value)
        {
            return true;
        }
    }

    return false;
};

/**
 * Fisher-Yates shuffling
 *
 * @author http://stackoverflow.com/questions/962802/is-it-correct-to-use-javascript-array-sort-method-for-shuffling
 * @type   Array
 */
Array.prototype.shuffle = function ()
{
    var tmp, current, top = this.length;

    if (top)
    {
        while(--top)
        {
            current = Math.floor(Math.random() * (top + 1));
            tmp = this[current];
            this[current] = this[top];
            this[top] = tmp;
        }
    }

    return this;
};

/**
 * Remove duplicates from an array
 */
Array.prototype.unique = function ()
{
    var r = [];

    o: for (var i = 0, n = this.length; i < n; i++)
    {
        for (var x = 0, y = r.length; x < y; x++)
        {
            if (r[x] == this[i])
            {
                continue o;
            }
        }

        r[r.length] = this[i];
    }

    return r;
};

/**
 * Remove an array element specified by index
 * Array Remove - By John Resig (MIT Licensed)
 * http://stackoverflow.com/a/9815010/2296282
 */
Array.prototype.remove = function(from, to) {
    "use strict";
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
