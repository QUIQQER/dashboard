/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Messages
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Bookmarks', [

    'qui/QUI',
    'Locale',

    'qui/controls/bookmarks/Panel',

    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUI, QUILocale, BookmarksPanel, QUICard) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Bookmarks',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-bookmarks',
                icon    : 'fa fa-bookmark',
                title   : QUILocale.get(lg, 'dashboard.bookmarks'),
                content : '<span></span>',
                footer  : false,
                styles  : false,
                priority: 85,
                size    : 25
            });
        },

        refresh: function () {
            var Content = this.getContent();

            Content.empty();

            Content.setStyles({
                'display'        : 'flex',
                'justify-content': 'center',
                'align-items'    : 'center',
                'flex-direction' : 'column'
            });

            // There is no "nice" way to directly access the user's bookmarks.
            // Therefore we have to use the existing bookmarks-control/-panel.
            var bookmarkControls = QUI.Controls.getByType('controls/desktop/panels/Bookmarks');

            // If the control is not present, we should do nothing
            if (!bookmarkControls.length) {
                return;
            }

            // The first match should be the control
            var bookmarks = bookmarkControls[0].$bookmarks;

            // Show set no bookmarks are set
            if (bookmarks.length === 0) {
                new Element('span', {
                    text   : QUILocale.get(lg, 'dashboard.bookmarks.none'),
                    'class': 'inactive-value'
                }).inject(Content);

                return;
            }

            // Now add all the bookmarks to our card
            // Since we're lazy we can just clone the elements from the panel into our card.
            // Furthermore there was no proper way to access the used icon without parsing a bunch of HTML.
            for (var i = 0; i < bookmarks.length; i++) {
                // Make sure to not only clone the element but also it's event
                var clonedBookmark = bookmarks[i].clone().cloneEvents(bookmarks[i]);

                // Reset the text's width since the original control might have shrunken it
                clonedBookmark.querySelector('.qui-bookmark-text').style.width = 'initial';

                // Put it onto our card.
                clonedBookmark.inject(Content);
            }
        }
    });
});