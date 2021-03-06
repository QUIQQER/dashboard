/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity
 *
 * @author www.pcsg.de (Jan Wennrich)
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity.html'

], function (QUIAjax, QUILocale, Mustache, QUICard, contentTemplate) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-card-site-activity',
                icon    : 'fa fa-file-text-o',
                title   : QUILocale.get(lg, 'dashboard.page.changes'),
                content : Mustache.render(contentTemplate, {
                    id   : QUILocale.get('quiqqer/system', 'id'),
                    title: QUILocale.get('quiqqer/system', 'title'),
                    date : QUILocale.get('quiqqer/system', 'e_date')
                }),
                footer  : false,
                styles  : false,
                priority: 65
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

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getNewestEditedSites', function (result) {
                var Tbody = self.getElm().getElement('tbody');

                var i, len, entry;

                var click = function (event) {
                    var Target = event.target;

                    if (Target.nodeName !== 'TR') {
                        Target = Target.getParent('tr');
                    }

                    var project = Target.get('data-project');
                    var lang    = Target.get('data-lang');
                    var id      = Target.get('data-id');

                    window.parent.require(['utils/Panels'], function (PanelUtils) {
                        PanelUtils.openSitePanel(project, lang, id);
                    });
                };

                for (i = 0, len = result.length; i < len; i++) {
                    entry = result[i];

                    new Element('tr', {
                        'class'       : 'can-be-hovered',
                        'data-project': entry.project,
                        'data-lang'   : entry.lang,
                        'data-id'     : entry.id,
                        html          : '' +
                            '<td>' + entry.id + '</td>' +
                            '<td>' + entry.title + '</td>' +
                            '<td>' + entry.e_date + '</td>',
                        events        : {
                            click: click
                        }
                    }).inject(Tbody);
                }
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        }
    });
});
