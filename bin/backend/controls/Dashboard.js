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

            this.getContent().set('html', Mustache.render(template));


            require([
                'package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory',
                'package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',
                'package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Links',
                'package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins',
                'package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Projects',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Groups'
            ], function (SystemInfoCard, CronHistoryCard, FilesystemInfoCard, BlogEntryCard, SiteActivityCard,
                         LinksCard, LatestLoginsCard, MediaInfoCard,
                         StatsProjectsCard, StatsPagesCard, StatsUsersCard, StatsGroupsCard) {
                // Create a new row
                var Row4 = new Element('div', {'class': 'quiqqer-dashboard-row'});
                self.$StatsProjectsCard = new StatsProjectsCard();
                self.$StatsPagesCard = new StatsPagesCard();
                self.$StatsUsersCard = new StatsUsersCard();
                self.$StatsGroupsCard = new StatsGroupsCard();

                // Space left 100 - (16 * 4) = 36 ; or programmatically (100 - self.$SystemInfoCard.getSize())
                self.$StatsProjectsCard.inject(Row4);
                self.$StatsPagesCard.inject(Row4);
                self.$StatsUsersCard.inject(Row4);
                self.$StatsGroupsCard.inject(Row4);

                Row4.inject(self.getContent(), 'bottom');


                // Create a new row
                var Row1 = new Element('div', {'class': 'quiqqer-dashboard-row'});

                self.$SystemInfoCard = new SystemInfoCard();
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


            Promise.all([]).then(function () {
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
        }
    });
});