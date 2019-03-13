/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUIAjax, QUILocale, Mustache, QUICard) {
    "use strict";

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users',

        initialize: function (options) {
            var self = this;

            this.parent(options);

            this.setAttributes({
                id    : 'quiqqer-dashboard-stats-users',
                footer: QUILocale.get('quiqqer/dashboard', 'dashboard.stats.users'),
                size  : 16,
                styles: {
                    'text-align': 'center'
                }
            });

            this.getElm().classList.add('quiqqer-dashboard--clickable');

            require([
                'utils/Panels',
                'controls/users/Panel'
            ], function (PanelUtils, UsersPanel) {
                self.getElm().addEvent('click', function () {
                    PanelUtils.openPanelInTasks(
                        new UsersPanel()
                    );
                });
            });
        },

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getUserCount', function (result) {
                self.setContent((new Element('span', {
                    'class': 'quiqqer-dashboard-one-stat-value',
                    html   : result
                })).outerHTML);
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        }
    });
});