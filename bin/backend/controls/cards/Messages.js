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
                id      : 'quiqqer-dashboard-messages',
                icon    : 'fa fa-bullhorn',
                title   : QUILocale.get(lg, 'dashboard.messages'),
                content : '<div></div>',
                footer  : false,
                styles  : false,
                priority: 95,
                size    : 25
            });
        },

        refresh: function () {
            var self = this;

            var MessagesControl = new MessagePanel();

            MessagesControl.inject(this.getContent());
            MessagesControl.getHeader().hide();

            var MessageControlContent = MessagesControl.getContent();
            MessageControlContent.setStyle('background', 'none');

            setTimeout(function () {
                var cardHeight = self.getElm().getSize().y;

                // card-height minus header minus button-menu
                MessageControlContent.setStyle('height', 'calc(' + cardHeight + 'px - 50px - 49px)');
            }, 500);
        }
    });
});