/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersStats
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersStats', [

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
        Type: 'package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersStats',

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

            this.$cardPaymentChart = null;
            this.$cardPaymentPie = null;

            this.$barOrderChart = null;
            this.$paymentChart = null;
            this.$paymentPieChart = null;
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.getBoard().then((board) => {

                // payment stats pie
                this.$cardPaymentPie = document.createElement('div');
                this.$cardPaymentPie.classList.add('dashboard-card', 'col-sg-6', 'col-sm-6');
                this.$cardPaymentPie.innerHTML = `
                    <div class="card">
                        <header class="card-header"></header>
                        <div class="card-body"></div>
                        <div class="card-footer" style="display: none;"></div>
                    </div>
                `;

                this.getElm().parentNode.insertBefore(this.$cardPaymentPie, this.getElm().nextSibling);


                // payment stats
                this.$cardPaymentChart = document.createElement('div');
                this.$cardPaymentChart .classList.add('dashboard-card', 'col-sg-6', 'col-sm-6');
                this.$cardPaymentChart .innerHTML = `
                    <div class="card">
                        <header class="card-header"></header>
                        <div class="card-body"></div>
                        <div class="card-footer" style="display: none;"></div>
                    </div>
                `;

                this.getElm().parentNode.insertBefore(this.$cardPaymentChart , this.getElm().nextSibling);

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

                QUIAjax.get('package_quiqqer_dashboard_ajax_backend_saas_getOrdersStats', (result) => {
                    const card = this.getElm().querySelector('.card');
                    const cardBody = card.querySelector('.card-body');

                    card.style.width = '100%';
                    card.style.height = '450px';
                    cardBody.style.display = '';
                    cardBody.style.padding = '2rem';

                    require([
                        URL_OPT_DIR + 'bin/quiqqer-asset/chart.js/chart.js/dist/chart.umd.js'
                    ], (Chart) => {
                        if (this.$barOrderChart) {
                            this.$barOrderChart.destroy();
                        }

                        if (this.$paymentChart) {
                            this.$paymentChart.destroy();
                        }

                        if (this.$paymentPieChart) {
                            this.$paymentPieChart.destroy();
                        }

                        // order stats
                        const labels = Object.keys(result.counting);
                        const data = Object.values(result.counting);
                        const intervalLabel = filterInstance.getElm().querySelector('.text').textContent;
                        const header = this.getElm().querySelector('header');

                        let barOrderCanvas = cardBody.querySelector('canvas');

                        if (!barOrderCanvas) {
                            barOrderCanvas = document.createElement('canvas');
                            barOrderCanvas.style.width = '100%';
                            barOrderCanvas.style.height = '300px';
                            cardBody.appendChild(barOrderCanvas);
                        }

                        header.style.display = '';
                        header.querySelector('.card-title').innerHTML = QUILocale.get(lg, 'dashboard.saas.ordersStats.label') + ' - ' + intervalLabel;

                        this.$barOrderChart = new Chart(barOrderCanvas, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: false,
                                    data: data,
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }
                        });

                        // payment stats
                        const paymentLabels = [];
                        const paymentData = [];
                        const paymentIcons = [];
                        const paymentTitles = [];

                        for (const [type, info] of Object.entries(result.payments)) {
                            paymentLabels.push(info.title); // oder type für technischen Namen
                            paymentData.push(info.count);
                            paymentIcons.push(info.icon); // falls du Icons anzeigen willst
                            paymentTitles.push(info.title);
                        }

                        let paymentCanvas = this.$cardPaymentChart.querySelector('canvas');
                        this.$cardPaymentChart.querySelector('header').innerHTML =
                            QUILocale.get(lg, 'dashboard.saas.payments.label') + ' - ' + intervalLabel;

                        if (!paymentCanvas) {
                            paymentCanvas = document.createElement('canvas');
                            paymentCanvas.style.width = '100%';
                            paymentCanvas.style.height = '300px';
                            this.$cardPaymentChart.querySelector('.card-body').innerHTML = '';
                            this.$cardPaymentChart.querySelector('.card-body').appendChild(paymentCanvas);
                        }

                        this.$paymentChart = new Chart(paymentCanvas, {
                            type: 'bar',
                            data: {
                                labels: paymentLabels,
                                datasets: [{
                                    label: QUILocale.get(lg, 'dashboard.saas.payment.count'),
                                    data: paymentData,
                                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                                    borderColor: 'rgba(255, 159, 64, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                indexAxis: 'y', // <-- das macht das Diagramm horizontal!
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {display: false}
                                }
                            }
                        });

                        // Pie-Chart für Payment-Verteilung
                        let paymentPieCanvas = this.$cardPaymentPie.querySelector('canvas');
                        this.$cardPaymentPie.querySelector('header').innerHTML =
                            QUILocale.get(lg, 'dashboard.saas.payments.label') + ' - ' + intervalLabel;

                        if (!paymentPieCanvas) {
                            paymentPieCanvas = document.createElement('canvas');
                            paymentPieCanvas.style.width = '100%';
                            paymentPieCanvas.style.height = '300px';
                            this.$cardPaymentPie.querySelector('.card-body').appendChild(paymentPieCanvas);
                        }

                        this.$paymentPieChart = new Chart(paymentPieCanvas, {
                            type: 'doughnut',
                            data: {
                                labels: paymentLabels,
                                datasets: [{
                                    label: QUILocale.get(lg, 'dashboard.saas.payments.label'),
                                    data: paymentData,
                                    backgroundColor: [
                                        'rgba(255, 159, 64, 0.5)',
                                        'rgba(54, 162, 235, 0.5)',
                                        'rgba(255, 99, 132, 0.5)',
                                        'rgba(75, 192, 192, 0.5)',
                                        'rgba(153, 102, 255, 0.5)',
                                        'rgba(255, 205, 86, 0.5)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 159, 64, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 205, 86, 1)'
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {display: true}
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
