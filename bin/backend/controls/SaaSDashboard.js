define('package/quiqqer/dashboard/bin/backend/controls/SaaSDashboard', [

    'qui/QUI',
    'qui/controls/Control',

    'css!package/quiqqer/dashboard/bin/backend/controls/SaaSDashboard.css'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type: 'SaaSDashboard',

        Binds: [
            '$onImport'
        ],

        initialize: function (option) {
            this.parent(option);

            this.$timeFilter = null;

            this.addEvents({
                onImport: this.$onImport
            });
        },

        $onImport: function () {
            const header = this.getElm().querySelector('.page-header');

            require([
                'package/quiqqer/erp/bin/backend/controls/elements/TimeFilter'
            ], (TimeFilter) => {
                header.style.position = 'relative';

                const filterContainer = document.createElement('div');
                filterContainer.classList.add('quiqqer-saas-dashboard-time-filter');
                header.appendChild(filterContainer);

                this.$timeFilter = new TimeFilter().inject(filterContainer);
            });
        },

        getFilterInstance: function () {
            return this.$timeFilter;
        },

        getFilter: function () {
            if (!this.$timeFilter) {
                const now = new Date();
                const from = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-01';
                const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const to = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + lastDay;

                return {
                    interval: 'days',
                    from: from,
                    to: to
                };
            }

            return this.$timeFilter.getValue();
        }
    });
});
