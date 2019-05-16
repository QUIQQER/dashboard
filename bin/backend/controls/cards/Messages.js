/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Messages
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Messages', [

    'Locale',

    'qui/controls/messages/Panel',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/Messages/style.css'

], function (QUILocale, MessagePanel, QUICard) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Messages',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-messages',
                icon   : 'fa fa-bullhorn',
                title  : QUILocale.get(lg, 'dashboard.messages'),
                content: '<div></div>',
                footer : false,
                styles : false,
                size   : 25
            });
        },

        refresh: function () {
            var MessagesControl = new MessagePanel();

            MessagesControl.inject(this.getContent());
            MessagesControl.getHeader().hide();

            var Content = MessagesControl.getContent();
            Content.setStyle('background', 'none');

            setTimeout(function() {
                // card-height minus header minus button-menu
                Content.setStyle('height', 'calc(433px - 50px - 49px)');
            }, 500);
        }
    });
});