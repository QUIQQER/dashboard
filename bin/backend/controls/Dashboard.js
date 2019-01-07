/**
 * @module package/quiqqer/dashboard/bin/backend/controls/Dashboard
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/Dashboard', [

    'qui/QUI',
    'qui/controls/desktop/Panel',

    'package/quiqqer/dashboard/bin/backend/Dashboard',
    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'Locale',
    'Mustache',

    'text!package/quiqqer/dashboard/bin/backend/controls/Dashboard.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/Dashboard.css',
    'css!package/quiqqer/dashboard/bin/backend/controls/Card.css'

], function (QUI, QUIPanel, Dashboard, Card, QUILocale, Mustache,
             template) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUIPanel,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/Dashboard',

        Binds: [
            '$onCreate'
        ],

        $MediaInfoChart: undefined,

        initialize: function (options) {
            this.parent(options);

            this.setAttribute('icon', URL_BIN_DIR + '16x16/quiqqer.png');
            this.setAttribute('dragable', false);
            this.setAttribute('displayNoTaskText', true);

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            var self = this;

            this.getElm().addClass('quiqqer-dashboard');
            this.getContent().addClass('quiqqer-dashboard-cards');
            this.getContent().addClass('quiqqer-dashboard--loading');

            this.getContent().set('html', Mustache.render(template, {
                projectTitle : QUILocale.get(lg, 'dashboard.projects.count'),
                sitesTitle   : QUILocale.get(lg, 'dashboard.sites.count'),
                sitesActive  : QUILocale.get(lg, 'dashboard.sites.active'),
                sitesInactive: QUILocale.get(lg, 'dashboard.sites.inactive'),
                usersTitle   : QUILocale.get(lg, 'dashboard.users.count'),
                groupsTitle  : QUILocale.get(lg, 'dashboard.groups.count')
            }));


            require([
                'package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory',
                'package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',
                'package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Links',
                'package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins',
                'package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo'
            ], function (SystemInfoCard, CronHistoryCard, FilesystemInfoCard, BlogEntryCard, SiteActivityCard, LinksCard, LatestLoginsCard, MediaInfoCard) {
                // Create a new row
                var Row1 = new Element('div', {'class': 'quiqqer-dashboard-row'});

                self.$SystemInfoCard  = new SystemInfoCard();
                self.$CronHistoryCard = new CronHistoryCard();
                self.$FilesystemInfoCard = new FilesystemInfoCard();

                // Space left 100 - 25 - 40 - 33 = 2 ; or programmatically (100 - self.$SystemInfoCard.getSize())
                self.$SystemInfoCard.inject(Row1);
                self.$CronHistoryCard.inject(Row1);
                self.$FilesystemInfoCard.inject(Row1);

                Row1.inject(self.getContent(), 'bottom');


                // Create a new row
                var Row2 = new Element('div', {'class': 'quiqqer-dashboard-row'});
                self.$BlogEntryCard = new BlogEntryCard();
                self.$SiteActivityCard = new SiteActivityCard();
                self.$LinksCard = new LinksCard();

                // Space left 100 - 25 - 50 - 25 = 0 ; or programmatically (100 - self.$SystemInfoCard.getSize())
                self.$BlogEntryCard.inject(Row2);
                self.$SiteActivityCard.inject(Row2);
                self.$LinksCard.inject(Row2);

                Row2.inject(self.getContent(), 'bottom');


                // Create a new row
                var Row3 = new Element('div', {'class': 'quiqqer-dashboard-row'});
                self.$LatestLoginsCard = new LatestLoginsCard();
                self.$MediaInfoCard = new MediaInfoCard();

                // Space left 100 - 50 = 50 ; or programmatically (100 - self.$SystemInfoCard.getSize())
                self.$LatestLoginsCard.inject(Row3);
                self.$MediaInfoCard.inject(Row3);

                Row3.inject(self.getContent(), 'bottom');
            });


            // stats
            Promise.all([
                this.loadStats()
            ]).then(function () {
                var Loader = this.getElm().getElement('.quiqqer-dashboard-loader');

                this.getContent().removeClass('quiqqer-dashboard--loading');

                moofx(Loader).animate({
                    opacity: 0
                }, {
                    callback: function () {
                        Loader.destroy();
                    }
                });
            }.bind(this));
        },

        /**
         * load general stats
         *
         * @return {Promise}
         */
        loadStats: function () {
            var self = this;

            return Dashboard.getStats().then(function (result) {
                var Projects = self.getElm().getElement('.quiqqer-dashboard-projects .quiqqer-dashboard-one-stat-value');
                var Sites = self.getElm().getElement('#quiqqer-dashboard-sites .quiqqer-dashboard-one-stat-value');
                var Users = self.getElm().getElement('.quiqqer-dashboard-users .quiqqer-dashboard-one-stat-value');
                var Groups = self.getElm().getElement('.quiqqer-dashboard-groups .quiqqer-dashboard-one-stat-value');

                Projects.removeClass('fa fa-circle-o-notch fa-spin');
                Projects.set('html', result.projects);

                Sites.removeClass('fa fa-circle-o-notch fa-spin');
                Sites.set('html', result.sites.total);
                self.getElm().getElement('#quiqqer-dashboard-sites-active').set('html', result.sites.active);
                self.getElm().getElement('#quiqqer-dashboard-sites-inactive').set('html', result.sites.inactive);

                Users.removeClass('fa fa-circle-o-notch fa-spin');
                Users.set('html', result.users);

                Groups.removeClass('fa fa-circle-o-notch fa-spin');
                Groups.set('html', result.groups);
            }).then(function () {
                // events
                return new Promise(function (resolve) {
                    require([
                        'utils/Panels',
                        'controls/users/Panel',
                        'controls/groups/Panel'
                    ], function (PanelUtils, UsersPanel, GroupsPanel) {
                        self.getElm().getElement('.quiqqer-dashboard-users')
                            .addEvent('click', function () {
                                PanelUtils.openPanelInTasks(
                                    new UsersPanel()
                                );
                            });

                        self.getElm().getElement('.quiqqer-dashboard-groups')
                            .addEvent('click', function () {
                                PanelUtils.openPanelInTasks(
                                    new GroupsPanel()
                                );
                            });

                        resolve();
                    });
                });
            });
        }
    });
});