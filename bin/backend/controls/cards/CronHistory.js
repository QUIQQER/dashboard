/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory
 *
 * @author www.pcsg.de (Jan Wennrich)
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory/content.html'

], function (QUIAjax, QUILocale, Mustache, QUICard, contentTemplate) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-card-cron-history',
                icon    : 'fa fa-clock-o',
                title   : QUILocale.get(lg, 'dashboard.cron.history'),
                content : Mustache.render(contentTemplate, {
                    date: QUILocale.get(lg, 'dashboard.cron.history.date'),
                    cron: QUILocale.get(lg, 'dashboard.cron.history.cron'),
                    user: QUILocale.get(lg, 'dashboard.cron.history.user')
                }),
                footer  : false,
                styles  : false,
                priority: 75
            });

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.$Content.addClass('card-table');
            this.$Content.removeClass('card-body');

            this.getElm().classList.add('col-sm-6');
            this.getElm().classList.add('col-lg-6');
        },

        /**
         * refresh
         */
        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getCronHistory', function (result) {
                var rows = "";

                result.forEach(function (cronData) {
                    rows += "<tr>" +
                        "    <td>" + cronData.lastexec + "</td>" +
                        "    <td>" + cronData.cronTitle + "</td>" +
                        "    <td>" + cronData.username + "</td>" +
                        "</tr>";
                });

                self.getElm().getElement('tbody').set('html', rows);
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        }
    });
});
