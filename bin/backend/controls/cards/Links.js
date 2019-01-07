/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/Links
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/Links', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/Links/content.html'

], function (QUIAjax, QUILocale, Mustache, QUICard, content) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/Links',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-card-help',
                icon   : 'fa fa-link',
                title  : QUILocale.get(lg, 'dashboard.links'),
                content: Mustache.render(content, {
                    quiqqer: QUILocale.get(lg, 'dashboard.links.quiqqer'),
                    quiqqerUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.url'),
                    help: QUILocale.get(lg, 'dashboard.links.quiqqer.help'),
                    helpUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.help.url'),
                    blog: QUILocale.get(lg, 'dashboard.links.quiqqer.blog'),
                    blogUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.blog.url'),
                    packages: QUILocale.get(lg, 'dashboard.links.quiqqer.packages'),
                    packagesUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.packages.url'),

                    social: QUILocale.get(lg, 'dashboard.links.social'),
                    socialUrl: QUILocale.get(lg, 'dashboard.links.social.url'),
                    community: QUILocale.get(lg, 'dashboard.links.social.community'),
                    communityUrl: QUILocale.get(lg, 'dashboard.links.social.community.url'),
                    github: QUILocale.get(lg, 'dashboard.links.social.github'),
                    githubUrl: QUILocale.get(lg, 'dashboard.links.social.github.url')
                }),
                footer : false,
                styles : false,
                size   : 25
            });
        }
    });
});