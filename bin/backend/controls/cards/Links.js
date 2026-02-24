define('package/quiqqer/dashboard/bin/backend/controls/cards/Links', [

    'Ajax',
    'Locale',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/Links.html',
    'css!package/quiqqer/dashboard/bin/backend/controls/cards/Links.css'

], function (QUIAjax, QUILocale, Mustache, QUICard, content) {
    "use strict";

    const lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type: 'package/quiqqer/dashboard/bin/backend/controls/cards/Links',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id: 'quiqqer-dashboard-card-help',
                icon: 'fa fa-link',
                title: QUILocale.get(lg, 'dashboard.links'),
                content: Mustache.render(content, {
                    quiqqer: QUILocale.get(lg, 'dashboard.links.quiqqer'),

                    help: QUILocale.get(lg, 'dashboard.links.quiqqer.help'),
                    helpUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.help.url'),
                    helpMeta: QUILocale.get(lg, 'dashboard.links.quiqqer.help.meta'),

                    blog: QUILocale.get(lg, 'dashboard.links.quiqqer.blog'),
                    blogUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.blog.url'),
                    blogMeta: QUILocale.get(lg, 'dashboard.links.quiqqer.blog.meta'),

                    packages: QUILocale.get(lg, 'dashboard.links.quiqqer.packages'),
                    packagesUrl: QUILocale.get(lg, 'dashboard.links.quiqqer.packages.url'),
                    packagesMeta: QUILocale.get(lg, 'dashboard.links.quiqqer.packages.meta'),


                    social: QUILocale.get(lg, 'dashboard.links.social'),

                    gitlab: QUILocale.get(lg, 'dashboard.links.social.gitlab'),
                    gitlabMeta: QUILocale.get(lg, 'dashboard.links.social.gitlab.meta'),
                    github: QUILocale.get(lg, 'dashboard.links.social.github'),
                    githubMeta: QUILocale.get(lg, 'dashboard.links.social.github.meta'),
                    facebook: QUILocale.get(lg, 'dashboard.links.social.facebook'),
                    facebookMeta: QUILocale.get(lg, 'dashboard.links.social.facebook.meta'),
                    twitter: QUILocale.get(lg, 'dashboard.links.social.twitter'),
                    twitterMeta: QUILocale.get(lg, 'dashboard.links.social.twitter.meta'),
                    discord: QUILocale.get(lg, 'dashboard.links.social.discord'),
                    discordMeta: QUILocale.get(lg, 'dashboard.links.social.discord.meta')
                }),
                footer: false,
                styles: false,
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
            this.getElm().classList.add('col-lg-6');
        }
    });
});
