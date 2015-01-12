/**
 * Touch Screen Directory Admin
 *
 * @fileoverview
 * @package tdir
 */

$(document).ready(function ()
{
    // Setup tabs for editable room details
    $('div#edit-tabs').tabs();

    // Make the diagram droppable to accept draggables from the toolbar
    $('div#admin-diagram').droppable({
        scope: 'toolbar',
        drop: function (e, ui)
        {
            var clone = $(ui.draggable).clone();

            clone.css({
                left: (ui.offset.left - $('div#admin-diagram').offset().left) + 'px',
                top: (ui.offset.top - $('div#admin-diagram').offset().top) + 'px'
            });
            $('div#admin-diagram').append(clone);

            new Marker(clone);
        }
    });

    // Make the toolbar markers draggable so they can be dragged and dropped on the diagram to make new markers
    $('ul#marker-toolbar li div.marker-box').draggable({
        scope: 'toolbar',
        cursor: 'move',
        helper: 'clone',
        opacity: 0.75,
        zIndex: 3,
        revert: 'invalid',
        start: function (e, ui)
        {
            $('ul#marker-toolbar li div.marker-box').not(this).not(ui.helper).animate({ opacity: 0.33 }, 250);
        },
        stop: function (e, ui)
        {
            $('ul#marker-toolbar li div.marker-box').animate({ opacity: 1.0 }, 250);
        }
    });

    // Do not follow toolbar links
    $('ul#marker-toolbar a')
        .bind('mouseup', function (e) { e.preventDefault(); })
        .bind('click', function (e) { e.preventDefault(); });

    // Make Marker objects for all of the markers on the diagram
    $('div#admin-diagram div.marker-box').each(function ()
    {
        new Marker($(this));
    });

    // Prevent annoying default browser text selection behavior if you click and drag over the diagram but miss a marker target
    $('div#admin-diagram').bind('mousedown', function (e) { e.preventDefault(); });
});

/**
 * @constructor
 * @param {Object} marker
 */
function Marker(marker)
{
    var self = this;

    this.marker = marker;
    this.tabUID = null;
    this.tab = null
    this.form == null;

    /**
     * On mouse down
     *
     * @param {Event} e
     */
    this.onMouseDown = function (e)
    {
        e.preventDefault();

        // Load up edit form for data related to this marker
        self.ajaxGetEditForm();

        // Highlight the clicked marker
        self.highlight();
    };

    /**
     * Highlight a marker on the diagram
     */
    this.highlight = function ()
    {
        self.marker.animate({opacity: 1.0}, 250);
        $('div#admin-diagram .marker-box').not(self.marker).animate({ opacity: 0.5 }, 250);
    };

    /**
     * AJAX delete
     *
     * @param {Event} e
     */
    this.ajaxDelete = function (e)
    {
        e.preventDefault();

        $.get(
            $(e.target).attr('href'),
            function (data)
            {
                if (data == 'SUCCESS')
                {
                    self.marker.find('div.marker-inner').fadeOut();
                    $('div#edit-tabs').tabs('remove', $('div#edit-tabs ul li a').index(self.tab));
                }
            }
        );
    };

    // Do not follow links or we'll leave the page mid-magic
    this.marker.find('div.marker-inner a')
        .bind('mouseup', this.clickHandler)
        .bind('click', this.clickHandler);

    this.url = this.marker.find('a').attr('href');
    if (this.url.match(/add/))
    {
        this.tabUID = 'new_' + new Date().getTime();
        this.highlight();
        this.ajaxAdd();
    }
    else
    {
        this.makeEditable();
    }
}

Marker.prototype =
{
    /**
     * Make a marker draggable and attach AJAX events
     */
    makeDraggable: function ()
    {
        var self = this;

        this.marker.draggable({
            delay: 100,
            containment: 'parent',
            handle: '.marker-inner',
            cursor: 'move',
            helper: 'clone',
            opacity: 0.75,
            stack: {
                group: 'div.marker-box',
                min: 3
            },
            start: function (e, ui)
            {
                $('div#admin-diagram div.marker-box').not(this).not(ui.helper).animate({ opacity: 0.33 }, 250);
            },
            stop: function (e, ui)
            {
                self.ajaxUpdateXY(ui.position.left, ui.position.top);
                $('div#admin-diagram div.marker-box').not(this).not(ui.helper).animate({ opacity: 0.5 }, 250);
            }
        });
    },

    /**
     * Make a marker editable
     */
    makeEditable: function ()
    {
        this.tabUID = 'edit_' + this.url.split('/').pop();
        this.makeDraggable();

        // Capture mouse events for marker
        this.marker.find('div.marker-inner a').bind('mousedown', this.onMouseDown);
    },

    /**
     * Do not follow links
     *
     * @param {Event} e
     */
    clickHandler: function (e)
    {
        e.preventDefault();
        return;
    },

    /**
     * Retrieve the edit form for a marker
     */
    ajaxGetEditForm: function ()
    {
        var self = this;

        // If a tab for the edit form doesn't exist, fetch the form and add the tab
        if (self.tab === null)
        {
            // Loading markers...
            $('div#edit-tabs').append('<div id="' + self.tabUID + '">Loading&hellip;</div>');
            $('div#edit-tabs').tabs('add', '#' + self.tabUID, 'Loading&hellip;', 0);

            // We want the marker to be able to know about its tab
            self.tab = $('div#edit-tabs .ui-tabs-nav li a[href$=' + self.tabUID + ']');

            // Highlight the associated marker when clicked
            self.tab.bind(
                'mouseup',
                function (e)
                {
                    self.highlight();
                }
            );

            $('div#edit-tabs').tabs('select', 0);

            $.get(
                self.url,
                function (data)
                {
                    $('div#edit-tabs div#' + self.tabUID).html(data);

                    // Marker should know about its form
                    self.form = $('div#edit-tabs div#' + self.tabUID + ' form');

                    // Bind the delete link
                    $('div#edit-tabs div#' + self.tabUID + ' p.delete a').click(self.ajaxDelete);

                    self.form.bind('submit', function (e)
                    {
                        e.preventDefault();
                        self.ajaxSave();
                    });
                    self.form.find('input[name=room]').bind(
                        'keyup',
                        function ()
                        {
                            self.marker.find('div.marker-inner a').html($(this).val());
                        }
                    );
                    self.form.find('input[name=label_x]').bind(
                        'keyup',
                        function ()
                        {
                            if (parseInt($(this).val()))
                            {
                                self.marker.css('left', Math.round(window.scale * parseInt($(this).val())));
                            }
                        }
                    );
                    self.form.find('input[name=label_y]').bind(
                        'keyup',
                        function ()
                        {
                            if (parseInt($(this).val()))
                            {
                                self.marker.css('top', Math.round(window.scale * parseInt($(this).val())));
                            }
                        }
                    );
                    self.form.find('input[name=label_z]').bind(
                        'keyup',
                        function ()
                        {
                            if (parseInt($(this).val()))
                            {
                                self.marker.css('z-index', parseInt($(this).val()));
                            }
                        }
                    );

                    var newLabel = self.form.find('input[name=room]').val();
                    if (newLabel == '')
                    {
                        // TODO: use the actual name of the type of object
                        newLabel = 'Obj';
                    }

                    self.tab.html(newLabel);
                    $('#' + self.tabUID + ' form').slideDown(500);
                }
            );
        }
        // If the tab with the form already exists, show it
        else
        {
            $('div#edit-tabs').tabs('select', '#' + self.tabUID);
        }
    },

    /**
     * AJAX save
     */
    ajaxSave: function ()
    {
        var self = this;

        // If form is null, how did they click save?
        if (self.form !== null)
        {
            var data = self.form.serialize();

            self.tab.addClass('loading');
            self.form.showLoading();

            $.post(
                self.form.attr('action'),
                data,
                function (data)
                {
                    if (data == 'SUCCESS')
                    {
                        self.tab.removeClass('loading');
                        self.form.hideLoading();
                    }
                }
            );
        }
    },

    /**
     * Update X and Y coordinates
     *
     * @param {Number} x
     * @param {Number} y
     */
    ajaxUpdateXY: function (x, y)
    {
        var self = this;

        self.marker.css({
            left: x + 'px',
            top: y + 'px'
        });

        if (self.form !== null)
        {
            self.form.find('input[name=label_x]').val(Math.round(x / window.scale));
            self.form.find('input[name=label_y]').val(Math.round(y / window.scale));

            var data = this.form.serialize();

            self.tab.addClass('loading');
            self.form.showLoading();

            $.post(
                self.form.attr('action'),
                data,
                function (data)
                {
                    if (data == 'SUCCESS')
                    {
                        self.tab.removeClass('loading');
                        self.form.hideLoading();
                    }
                }
            );
        }
    },

    /**
     * AJAX add
     */
    ajaxAdd: function ()
    {
        var self = this;

        // If we're adding there really better not already be a tab...
        if (self.tab === null)
        {
            $('div#edit-tabs').append('<div id="' + self.tabUID + '">Adding&hellip;</div>');
            $('div#edit-tabs').tabs('add', '#' + self.tabUID, 'Adding&hellip;', 0);

            // We want the marker to be able to know about its tab.
            self.tab = $('div#edit-tabs .ui-tabs-nav li a[href$=' + self.tabUID + ']');

            // When a tab is clicked, we want to highlight the associated marker
            self.tab.bind(
                'mouseup',
                function (e)
                {
                    self.highlight();
                }
            );

            $('div#edit-tabs').tabs('select', 0);

            var position = this.marker.position();
            $.get(
                self.url + '?label_x=' + Math.round(position.left / window.scale) + '&label_y=' + Math.round(position.top / window.scale),
                function (data)
                {
                    // Returned data should be ID of thing we just added
                    if (data.match(/edit\/\d+/))
                    {
                        // Select this "adding..." tab
                        $('div#edit-tabs').tabs('select', '#' + self.tabUID);

                        // Get the index of the currently selected tab which should be this "adding..." tab
                        var selectedIndex = $('div#edit-tabs').tabs('option', 'selected');

                        // http://dev.jqueryui.com/ticket/4960
                        if ($('div#edit-tabs').tabs('length') == 1 && selectedIndex == -1)
                        {
                            selectedIndex = 0;
                        }

                        // Remove this "adding..." tab\
                        $('div#edit-tabs').tabs('remove', selectedIndex);

                        self.tab = null;
                        self.url = data;

                        self.marker.find('div.marker-inner a').attr('href', self.url);

                        self.makeEditable();
                        self.ajaxGetEditForm();
                    }
                }
            );
        }
    }
};

/**
 * Disable forms whilst AJAX is loading
 */
(function ($)
{
    $.fn.showLoading = function ()
    {
        $(this).before('<p class="loading">Loading&hellip;</p>');
        $(this).find('input, select, textarea').attr('disabled', 'disabled');
        $(this).fadeTo(500, 0.25);
    }

    $.fn.hideLoading = function ()
    {
        $(this).parent().find('p.loading').remove();
        $(this).find('input, select, textarea').removeAttr('disabled');
        $(this).fadeTo(500, 1.0);
    }
})(jQuery);
