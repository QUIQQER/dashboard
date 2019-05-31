/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Messages
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Bookmarks', [

    'Locale',

//    'controls/desktop/panels/Bookmarks',
    'qui/controls/bookmarks/Panel',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/Bookmarks/style.css'

], function (QUILocale, BookmarksPanel, QUICard) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Bookmarks',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-bookmarks',
                icon   : 'fa fa-bookmark',
                title  : QUILocale.get(lg, 'dashboard.bookmarks'),
                content: '<div></div>',
                footer : false,
                styles : false,
                size   : 25
            });
        },

        refresh: function () {
            var BookmarksControl = new BookmarksPanel();

            BookmarksControl.inject(this.getContent());
            BookmarksControl.refresh();

            BookmarksControl.getHeader().hide();
        }
    });
});