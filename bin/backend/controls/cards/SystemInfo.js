/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo/content.html'

], function (QUIAjax, QUILocale, Mustache, QUICard, contentTemplate) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-card-system-info',
                icon    : 'fa fa-microchip',
                title   : QUILocale.get(lg, 'dashboard.system.info'),
                content : Mustache.render(contentTemplate, {
                    quiqqerVersion: QUILocale.get(lg, 'dashboard.system.info.quiqqer.version'),
                    modulesCount  : QUILocale.get(lg, 'dashboard.system.info.modules.count'),
                    devmodeActive : QUILocale.get(lg, 'dashboard.system.info.devmode.active'),
                    cacheType     : QUILocale.get(lg, 'dashboard.system.info.cache.type')
                }),
                footer  : false,
                styles  : false,
                priority: 45
            });

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        $onCreate: function () {
            this.$Content.addClass('card-table');
            this.$Content.removeClass('card-body');

            this.getElm().classList.add('col-sm-6');
            this.getElm().classList.add('col-lg-6');
        },

        refresh: function () {
            var self = this;
            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getSystemInfo', function (result) {
                self.getElm().getElement('#system-info-quiqqer-version .value').set('html', result.quiqqerVersion);
                self.getElm().getElement('#system-info-modules-count .value').set('html', result.modulesCount);

                var DevModeActiveElement = new Element('span', {
                    // Determine value status depending on Dev-Mode being active or not
                    'class': result.isDevModeActive ? 'good-value' : 'inactive-value',
                    // Get text from locale variable depending on Dev-Mode being active or not
                    'html': QUILocale.get(
                        lg,
                        'dashboard.system.info.devmode.active.' + (result.isDevModeActive ? 'true' : 'false')
                    )
                });

                self.getElm().getElement('#system-info-devmode-active .value').set(
                    'html',
                    DevModeActiveElement.outerHTML
                );

                self.getElm().getElement('#system-info-cache-type .value').set('html', result.cacheType);
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        }
    });
});
