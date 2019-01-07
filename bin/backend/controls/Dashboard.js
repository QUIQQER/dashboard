/**
 * @module package/quiqqer/dashboard/bin/backend/controls/Dashboard
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/Dashboard', [

    'qui/QUI',
    'qui/controls/desktop/Panel',

    'package/quiqqer/dashboard/bin/backend/Dashboard',
    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'controls/projects/Select',

    'utils/Color',
    'utils/Date',

    'Locale',
    'Mustache',

    'text!package/quiqqer/dashboard/bin/backend/controls/Dashboard.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/Dashboard.css',
    'css!package/quiqqer/dashboard/bin/backend/controls/Card.css'

], function (QUI, QUIPanel, Dashboard, Card, ProjectSelect, ColorUtil, DateUtil, QUILocale, Mustache,
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
                groupsTitle  : QUILocale.get(lg, 'dashboard.groups.count'),

                mediaInfo               : QUILocale.get(lg, 'dashboard.media.info'),
                mediaInfoTableTitle     : QUILocale.get(lg, 'dashboard.media.info.table.title'),
                mediaInfoFilesCount     : QUILocale.get(lg, 'dashboard.media.info.files.count'),
                mediaInfoFolderCount    : QUILocale.get(lg, 'dashboard.media.info.folder.count'),
                mediaInfoFolderSize     : QUILocale.get(lg, 'dashboard.media.info.folder.size'),
                mediaInfoCacheFolderSize: QUILocale.get(lg, 'dashboard.media.info.cache.folder.size'),
                mediaInfoChartTitle     : QUILocale.get(lg, 'dashboard.media.info.chart.title')
            }));


            require([
                'package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory',
                'package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',
                'package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Links',
                'package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins'
            ], function (SystemInfoCard, CronHistoryCard, FilesystemInfoCard, BlogEntryCard, SiteActivityCard, LinksCard, LatestLoginsCard) {
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

                // Space left 100 - 50 = 50 ; or programmatically (100 - self.$SystemInfoCard.getSize())
                self.$LatestLoginsCard.inject(Row3);

                Row3.inject(self.getContent(), 'bottom');
            });


            new ProjectSelect({
                langSelect : false,
                emptyselect: false,
                events     : {
                    onChange: function (selectedProject) {
                        self.loadMediaInfo(selectedProject);
                    }
                }
            }).inject(self.getContent().getElement('#media-info-project-select'));

            // stats
            Promise.all([
                this.loadStats()
                // Don't load the MediaInfo here.
                // Because it's ProjectSelect (see above) automatically triggers a change event on page load.
                // Therefore the MediaInfo is loaded automatically.
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
        },


        /**
         *
         * @return {Promise}
         */
        loadMediaInfo: function (project) {
            var self = this;

            if (project === undefined) {
                project = QUIQQER_PROJECT.name;
            }

            // latest user logins
            return Dashboard.getMediaInfo(project).then(function (result) {
                var Container = self.getElm().getElement('#quiqqer-dashboard-media-info');

                var FACTOR_BYTE_TO_MEGABYTE = 1e+6;

                // We can't use a plain string here because the text contains ' and "
                var mediaFolderSize = new Element('span', {
                    title: QUILocale.get(lg, 'dashboard.media.info.folder.unavailable'),
                    html : '–'
                });

                var mediaCacheFolderSize = mediaFolderSize.clone();

                // If the folder size is present, convert it to Megabytes and round to two fractional digits
                if (result.mediaFolderSize !== null) {
                    mediaFolderSize = new Element('span', {
                        html: (result.mediaFolderSize / FACTOR_BYTE_TO_MEGABYTE).toFixed(2) + " MB"
                    });
                }

                // If there is a timestamp calculate how much time passed since then
                if (result.mediaFolderSizeTimestamp) {
                    var MediaFolderSizeDate                   = new Date(result.mediaFolderSizeTimestamp * 1000),
                        timeSinceMediaFolderSizeTimestampText = DateUtil.getTimeSinceAsString(MediaFolderSizeDate);

                    mediaFolderSize.innerHTML += "<br><small>(" + timeSinceMediaFolderSizeTimestampText + ")</small>";
                }

                // If the folder size is present, convert it to Megabytes and round to two fractional digits
                if (result.mediaCacheFolderSize !== null) {
                    mediaCacheFolderSize = new Element('span', {
                        html: (result.mediaCacheFolderSize / FACTOR_BYTE_TO_MEGABYTE).toFixed(2) + " MB"
                    });
                }

                // If there is a timestamp calculate how much time passed since then
                if (result.mediaCacheFolderSizeTimestamp) {
                    var MediaCacheFolderSizeDate          = new Date(result.mediaCacheFolderSizeTimestamp * 1000),
                        timeSinceMediaCacheFolderSizeText = DateUtil.getTimeSinceAsString(MediaCacheFolderSizeDate);

                    mediaCacheFolderSize.innerHTML += "<br><small>(" + timeSinceMediaCacheFolderSizeText + ")</small>";
                }

                Container.getElement('#media-info-files-count .value').set('html', result.filesCount);
                Container.getElement('#media-info-folder-count .value').set('html', result.folderCount);

                // Clear the element's content and add the folder size
                Container.getElement('#media-info-folder-size .value').empty();
                Container.getElement('#media-info-folder-size .value').adopt(mediaFolderSize);

                // Clear the element's content and add the folder size
                Container.getElement('#media-info-cache-folder-size .value').empty();
                Container.getElement('#media-info-cache-folder-size .value').adopt(mediaCacheFolderSize);

                var ChartContainer = Container.getElement('#chart-container');

                // If there are no files, hide the pie chart
                if (result.filesCount === 0) {
                    ChartContainer.hide();
                    Container.removeClass('qdc-w50');
                    Container.addClass('qdc-w25');
                    return;
                }

                // Show the pie chart, in case it was hidden before
                ChartContainer.show();
                Container.addClass('qdc-w50');
                Container.removeClass('qdc-w25');

                require([URL_OPT_DIR + 'bin/chart.js/dist/Chart.js'], function (Chart) {
                    if (self.$MediaInfoChart !== undefined) {
                        self.$MediaInfoChart.destroy();
                        self.$MediaInfoChart = undefined;
                    }

                    var colors = ColorUtil.getRandomHexColorsFromPallet(
                        Object.keys(result.filetypesCount).length,
                        [
                            ColorUtil.ColorPalette.black,
                            ColorUtil.ColorPalette.gray,
                            ColorUtil.ColorPalette.silver,
                            ColorUtil.ColorPalette.white
                        ]
                    );

                    self.$MediaInfoChart = new Chart(Container.getElement('#chart'), {
                        type   : 'pie',
                        data   : {
                            datasets: [{
                                // values contain the amounts of different file-types
                                data: Object.values(result.filetypesCount),

                                // Generate a random color for each file-type
                                backgroundColor: colors,

                                borderWidth: 1.5
                            }],
                            // Keys contain the file-types
                            labels  : Object.keys(result.filetypesCount)
                        },
                        options: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    });
                });
            });
        }
    });
});