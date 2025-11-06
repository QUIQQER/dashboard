/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/saas/UsersRegistration
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/saas/UsersRegistration', [

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
        Type: 'package/quiqqer/dashboard/bin/backend/controls/cards/saas/UsersRegistration',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id: 'quiqqer-dashboard-stats-usersRegistration',
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

                QUIAjax.get('package_quiqqer_dashboard_ajax_backend_saas_getUsersRegistrations', (result) => {
                    if (!this.$canvas) {
                        this.$canvas = document.createElement('canvas');

                        this.getElm().querySelector('.card').style.padding = '2rem';
                        this.getElm().querySelector('.card').appendChild(this.$canvas);
                    }

                    const labels = result.map(item => item.period);
                    const data = result.map(item => item.registrations);

                    require([
                        URL_OPT_DIR + 'bin/quiqqer-asset/chart.js/chart.js/dist/chart.umd.js'
                    ], (Chart) => {
                        if (this.$chartInstance) {
                            this.$chartInstance.destroy();
                        }

                        this.$chartInstance = new Chart(this.$canvas, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: QUILocale.get(lg, 'dashboard.saas.usersRegistrations.registrations'),
                                    data: data,
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: {
                                        display: true,
                                        text: QUILocale.get(lg, 'dashboard.saas.usersRegistrations.title', {
                                            interval: filterInstance.getElm().querySelector('.text').textContent
                                        })
                                    }
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: QUILocale.get(lg, 'dashboard.saas.usersRegistrations.date')
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: QUILocale.get(lg, 'dashboard.saas.usersRegistrations.registrations')
                                        }
                                    }
                                }
                            }
                        });
                    });
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
