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

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-stats-projects',
                content : '',
                priority: 98
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
            this.getElm().classList.add('col-sm-2');
        },

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getProjectCount', function (result) {
                self.$Content.classList.add('text-center');

                self.setContent(
                    '<div class="row align-items-center">' +
                    '   <div class="h1 m-0">' +
                    '        ' + result +
                    '   </div>' +
                    '   <div class="text-muted">' +
                    '       ' + QUILocale.get('quiqqer/dashboard', 'dashboard.stats.projects') +
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
