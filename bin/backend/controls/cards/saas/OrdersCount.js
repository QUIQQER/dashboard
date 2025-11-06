/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersCount
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersCount', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',
    'package/quiqqer/dashboard/bin/backend/Stats'

], function (QUIAjax, QUILocale, Mustache, QUICard, Stats) {
    "use strict";

    const lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type: 'package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersCount',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id: 'quiqqer-dashboard-stats-ordersCount',
                title: false,
                priority: 100
            });

            this.addEvents({
                onCreate: this.$onCreate
            });

            this.$canvas = null;
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.getElm().classList.add('col-sg-2');
            this.getElm().classList.add('col-sm-3');
            this.$Content.classList.add('text-center');

            this.getBoard().then((board) => {
                board.getFilterInstance().addEvent('change', () => {
                    this.refresh();
                });
            });
        },

        /**
         * refresh the display
         */
        refresh: function () {
            this.getBoard().then((board) => {
                const filter = board.getFilter();
                const filterInstance = board.getFilterInstance();

                QUIAjax.get('package_quiqqer_dashboard_ajax_backend_saas_getOrdersCount', (result) => {
                    this.setContent(
                        '<div class="row align-items-center">' +
                        '   <div class="h1 m-0">' +
                        '        ' + result +
                        '   </div>' +
                        '   <div class="text-muted">' +
                        '       ' + QUILocale.get(lg, 'dashboard.stats.orders') +
                        '       <br />' + filterInstance.getElm().querySelector('.text').textContent +
                        '   </div>' +
                        '</div>'
                    );
                }, {
                    'package': 'quiqqer/dashboard',
                    interval: filter.interval,
                    from: filter.from,
                    to: filter.to
                });
            });
        },

        getBoard: function () {
            const uuid = document.body.getAttribute('data-quiid');

            if (uuid) {
                return Promise.resolve(QUI.Controls.getById(uuid));
            }

            return new Promise((resolve) => {
                document.body.addEventListener('load', () => {
                    resolve(QUI.Controls.getById(uuid));
                })
            });
        }
    });
});
