/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Projects
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Projects', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUIAjax, QUILocale, Mustache, QUICard) {
    "use strict";

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Projects',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id    : 'quiqqer-dashboard-stats-projects',
                footer: QUILocale.get('quiqqer/dashboard', 'dashboard.stats.projects'),
                size  : 16,
                styles: {
                    'text-align': 'center'
                }
            });
        },

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getProjectCount', function (result) {
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