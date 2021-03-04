/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Groups
 * @author www.pcsg.de (Jan Wennrich)
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

        initialize: function (options) {
            var self = this;

            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-stats-groups',
                footer  : QUILocale.get('quiqqer/dashboard', 'dashboard.stats.groups'),
                size    : 20,
                priority: 100,
                styles  : {
                    'text-align': 'center'
                }
            });

            this.getElm().classList.add('quiqqer-dashboard--clickable');

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

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getGroupCount', function (result) {
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