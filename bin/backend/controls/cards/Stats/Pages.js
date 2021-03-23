/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages
 *
 * @author www.pcsg.de (Jan Wennrich)
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages', [

    'Ajax',
    'Locale',
    'package/quiqqer/dashboard/bin/backend/controls/Card'

], function (QUIAjax, QUILocale, QUICard) {
    "use strict";

    var lg = "quiqqer/dashboard";

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-stats-pages',
                content : '',
                priority: 97
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
        },

        /**
         * refresh the card
         */
        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_stats_getPageCount', function (result) {
                // Card.getElement('#quiqqer-dashboard-pages-total').set('html', result.total);
                // Card.getElement('#quiqqer-dashboard-pages-active').set('html', result.active);
                // Card.getElement('#quiqqer-dashboard-pages-inactive').set('html', result.inactive);

                self.setContent(
                    '<div class="row align-items-center">' +
                    '   <div class="col-auto">' +
                    '       <span class="bg-indigo text-white avatar">' +
                    '           <span class="fa fa-file-o"></span>' +
                    '       </span>' +
                    '   </div>' +
                    '   <div class="col">' +
                    '       <div class="font-weight-medium">' +
                    '           ' + QUILocale.get(lg, 'dashboard.stats.pages') +
                    '       </div>' +
                    '       <div class="text-muted">' +
                    '           ' + result.total +
                    '       </div>' +
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
