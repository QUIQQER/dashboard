/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages/content.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages/style.css'

], function (QUIAjax, QUILocale, Mustache, QUICard, template) {
    "use strict";

    var lg = "quiqqer/dashboard";

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-stats-pages',
                content: Mustache.render(template, {
                    sitesActive  : QUILocale.get(lg, 'dashboard.stats.pages.active'),
                    sitesInactive: QUILocale.get(lg, 'dashboard.stats.pages.inactive')
                }),
                footer : QUILocale.get('quiqqer/dashboard', 'dashboard.stats.pages'),
                size   : 16,
                styles : {
                    'text-align': 'center'
                }
            });
        },

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getPageCount', function (result) {
                var Card = self.getElm();

                Card.getElement('#quiqqer-dashboard-pages-total').set('html', result.total);
                Card.getElement('#quiqqer-dashboard-pages-active').set('html', result.active);
                Card.getElement('#quiqqer-dashboard-pages-inactive').set('html', result.inactive);
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        }
    });
});