/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users
 *
 * @author www.pcsg.de (Jan Wennrich)
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users', [

    'Ajax',
    'Locale',
    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUIAjax, QUILocale, QUICard) {
    "use strict";

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-stats-users',
                priority: 99
            });

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            var self = this;

            this.getElm().classList.add('card--clickable');
            this.getElm().classList.add('col-sg-2');
            this.getElm().classList.add('col-sm-2');

            self.getElm().addEvent('click', function () {
                window.parent.require([
                    'utils/Panels',
                    'controls/users/Panel'
                ], function (PanelUtils, UsersPanel) {
                    PanelUtils.openPanelInTasks(
                        new UsersPanel()
                    );
                });
            });
        },

        /**
         * refresh the card
         */
        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getUserCount', function (result) {
                self.$Content.classList.add('text-center');

                self.setContent(
                    '<div class="row align-items-center">' +
                    '   <div class="h1 m-0">' +
                    '        ' + result +
                    '   </div>' +
                    '   <div class="text-muted">' +
                    '       ' + QUILocale.get('quiqqer/dashboard', 'dashboard.stats.users') +
                    '   </div>' +
                    '</div>'
                );
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        }
    });
});
