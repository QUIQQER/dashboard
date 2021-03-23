/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Groups
 * @author www.pcsg.de (Jan Wennrich)
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Groups', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUIAjax, QUILocale, Mustache, QUICard) {
    "use strict";

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Groups',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-stats-groups',
                title   : false,
                priority: 100
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

            require([
                'utils/Panels',
                'controls/groups/Panel'
            ], function (PanelUtils, GroupsPanel) {
                self.getElm().addEvent('click', function () {
                    PanelUtils.openPanelInTasks(
                        new GroupsPanel()
                    );
                });
            });
        },

        /**
         * refresh the display
         */
        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getGroupCount', function (result) {
                self.$Content.classList.add('text-center');

                self.setContent(
                    '<div class="row align-items-center">' +
                    '   <div class="h1 m-0">' +
                    '        ' + result +
                    '   </div>' +
                    '   <div class="text-muted">' +
                    '       ' + QUILocale.get('quiqqer/dashboard', 'dashboard.stats.groups') +
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
