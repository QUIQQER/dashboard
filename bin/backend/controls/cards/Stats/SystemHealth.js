/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth', [

    'Ajax',
    'Locale',
    'Mustache',

    'qui/controls/windows/Popup',
    'controls/packages/SystemCheck',

    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUIAjax, QUILocale, Mustache, QUIPopup, QUISystemCheck, QUICard) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-stats-system-health',
                priority: 96
            });

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.getElm().classList.add('col-sg-2');
            this.getElm().classList.add('col-sm-3');

            this.getElm().classList.add('card--clickable');
            this.getElm().addEvent('click', this.openSystemCheckPopup);
        },

        /**
         * opens the system info popup
         */
        openSystemCheckPopup: function () {
            var Popup       = new QUIPopup(),
                SystemCheck = new QUISystemCheck();

            Popup.open();
            SystemCheck.inject(Popup.getContent());
        },

        /**
         * refresh the card
         */
        refresh: function () {
            var self = this;

            QUILocale.get(lg, 'dashboard.stats.systemhealth');

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getSystemHealth', function (result) {
                // See status-codes in \QUI\Requirements\TestResult.php
                switch (result) {
                    // failed
                    case 0:
                        iconType  = 'fa fa-times bad-value';
                        valueType = 'bad-value';
                        break;

                    // okay
                    case 1:
                        iconType  = 'fa fa-check good-value';
                        valueType = 'good-value';
                        break;

                    // warning
                    case 3:
                        iconType  = 'fa fa-exclamation-triangle warning-value';
                        valueType = 'warning-value';
                        break;

                    // unknown
                    default:
                        iconType  = 'fa fa-question inactive-value';
                        valueType = 'inactive-value';

                        // add a info to tell the user how to get correct values
                        self.getElm().title = QUILocale.get(lg, 'dashboard.stats.systemhealth.help');

                        new Element('i', {
                            class : 'fa fa-info-circle',
                            styles: {
                                position: 'absolute',
                                top     : 0,
                                right   : 0
                            }
                        }).inject(self.$Content);
                        break;
                }

                self.setContent(
                    '<div class="row align-items-center">' +
                    '   <div class="col-auto">' +
                    '       <span class="bg-blue text-white avatar">' +
                    '           <span class="' + iconType + '"></span>' +
                    '       </span>' +
                    '   </div>' +
                    '   <div class="col">' +
                    '       <div class="font-weight-medium">' +
                    '           ' + QUILocale.get(lg, 'dashboard.stats.systemhealth') +
                    '       </div>' +
                    '       <div class="text-muted">' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );

                return;
                var Content = new Element('div');

                var iconType  = 'fa fa-question';
                var valueType = 'inactive-value';

                // See status-codes in \QUI\Requirements\TestResult.php
                switch (result) {
                    // failed
                    case 0:
                        iconType  = ' fa fa-times bad-value';
                        valueType = 'bad-value';
                        break;

                    // okay
                    case 1:
                        iconType  = ' fa fa-check good-value';
                        valueType = 'good-value';
                        break;

                    // warning
                    case 3:
                        iconType  = ' fa fa-exclamation-triangle warning-value';
                        valueType = 'warning-value';
                        break;

                    // unknown
                    default:
                        iconType  = ' fa fa-question inactive-value';
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
