/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Links
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Links', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/Links.html'

], function (QUIAjax, QUILocale, Mustache, QUICard, content) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Links',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-card-help',
                icon    : 'fa fa-link',
                title   : QUILocale.get(lg, 'dashboard.links'),
                content : Mustache.render(content, {
                    quiqqer: QUILocale.get(lg, 'dashboard.links.quiqqer'),

                    help   : QUILocale.get(lg, 'dashboard.links.quiqqer.help'),
                    helpUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.help.url'),

                    blog   : QUILocale.get(lg, 'dashboard.links.quiqqer.blog'),
                    blogUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.blog.url'),

                    packages   : QUILocale.get(lg, 'dashboard.links.quiqqer.packages'),
                    packagesUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.packages.url'),


                    social: QUILocale.get(lg, 'dashboard.links.social')
                }),
                footer  : false,
                styles  : false,
                priority: 85
            });

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.getElm().classList.add('col-sm-6');
            this.getElm().classList.add('col-lg-4');
        }
    });
});
