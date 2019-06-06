/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUIAjax, QUILocale, Mustache, QUICard) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth',

        initialize: function (options) {
            var self = this;

            this.parent(options);

            this.setAttributes({
                id    : 'quiqqer-dashboard-stats-system-health',
                footer: QUILocale.get(lg, 'dashboard.stats.systemhealth'),
                size  : 16,
                styles: {
                    'text-align': 'center'
                }
            });

            this.getElm().classList.add('quiqqer-dashboard--clickable');

            require([
                'utils/Panels',
                'controls/packages/Panel'
            ], function (PanelUtils, SystemAdministrationControl) {
                self.getElm().addEvent('click', function () {
                    var SystemAdministration = new SystemAdministrationControl();
                    PanelUtils.openPanelInTasks(SystemAdministration).then(function (LoadedPanel) {
                        // This needs to be delayed since opening the SystemAdmin-panel overwrites the systemCheck-selection
                        setTimeout(function () {
                            LoadedPanel.loadSystemCheck();
                        }, 1000);
                    });
                });
            });
        },

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getSystemHealth', function (result) {

                var Content = new Element('div');

                var iconType = 'fa fa-question';
                var valueType = 'inactive-value';

                // See status-codes in \QUI\Requirements\TestResult.php
                switch (result) {
                    // failed
                    case 0:
                        iconType = ' fa fa-times bad-value';
                        valueType = 'bad-value';
                        break;

                    // okay
                    case 1:
                        iconType = ' fa fa-check good-value';
                        valueType = 'good-value';
                        break;

                    // warning
                    case 3:
                        iconType = ' fa fa-exclamation-triangle warning-value';
                        valueType = 'warning-value';
                        break;

                    // unknown
                    default:
                        iconType = ' fa fa-question inactive-value';
                        valueType = 'inactive-value';

                        // add a info to tell the user how to get correct values
                        self.getElm().title = QUILocale.get(lg, 'dashboard.stats.systemhealth.help');
                        new Element('i', {
                            class: 'fa fa-info-circle inactive-value border-value top-right'
                        }).inject(Content);
                        break;
                }

                var Icon = new Element('i', {
                    'class': iconType + ' ' + valueType + ' quiqqer-dashboard-one-stat-value quiqqer-dashboard-one-stat-icon-only'
                });

                self.getFooter().classList.add(valueType);

                Icon.inject(Content);

                self.setContent(Content.outerHTML);
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        }
    });
});