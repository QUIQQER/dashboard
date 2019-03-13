/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins/content.html'

], function (QUIAjax, QUILocale, Mustache, QUICard, template) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-card-latest-logins',
                icon   : 'fa fa-user',
                title  : QUILocale.get(lg, 'dashboard.logins'),
                content: Mustache.render(template, {
                    username: QUILocale.get('quiqqer/system', 'username'),
                    name    : QUILocale.get('quiqqer/system', 'name'),
                    date    : QUILocale.get('quiqqer/system', 'date')
                }),
                footer : false,
                styles : false,
                size   : 33
            });
        },

        refresh: function () {
            var self = this;
            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getLatestLogins', function (result) {
                var Tbody = self.getElm().getElement('tbody');

                var i, len, entry;

                var click = function (event) {
                    var Target = event.target;

                    if (Target.nodeName !== 'TR') {
                        Target = Target.getParent('tr');
                    }

                    var uid = Target.get('data-uid');

                    require(['utils/Panels'], function (PanelUtils) {
                        PanelUtils.openUserPanel(uid);
                    });
                };

                for (i = 0, len = result.length; i < len; i++) {
                    entry = result[i];

                    new Element('tr', {
                        'class'   : 'can-be-hovered',
                        'data-uid': entry.uid,
                        html      : '' +
                                    '<td>' + entry.username + '</td>' +
                                    '<td>' + entry.name + '</td>' +
                                    '<td>' + entry.date + '</td>',
                        events    : {
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