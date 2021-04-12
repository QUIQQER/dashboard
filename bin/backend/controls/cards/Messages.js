/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Messages
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Messages', [

    'Locale',
    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/Messages.css'

], function (QUILocale, QUICard) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Messages',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-messages',
                icon    : 'fa fa-bullhorn',
                title   : QUILocale.get(lg, 'dashboard.messages'),
                content : '<div></div>',
                footer  : false,
                styles  : false,
                priority: 95
            });

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.getElm().classList.add('col-sm-6');
            this.getElm().classList.add('col-lg-4');

            this.$Content.addClass('card-table');
            this.$Content.removeClass('card-body');
        },

        /**
         * refresh the card
         */
        refresh: function () {
            var self = this;

            // we need the message panel here, because of the css template stuff
            require(['qui/controls/messages/Panel'], function () {

                // we need the window parent panel, because of the parent references
                window.parent.require(['qui/controls/messages/Panel'], function (MessagePanel) {
                    var MessagesControl = new MessagePanel({
                        styles: {
                            height: 300
                        }
                    });

                    MessagesControl.inject(self.getContent());
                    MessagesControl.getHeader().hide();
                    MessagesControl.getContent().setStyle('background', 'none');
                });
            });
        }
    });
});
