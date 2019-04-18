/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo', [

    'Ajax',
    'Locale',
    'Mustache',

    'utils/Color',
    'utils/Date',

    'controls/projects/Select',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo/content.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo/style.css'

], function (QUIAjax, QUILocale, Mustache, ColorUtil, DateUtil, ProjectSelect, QUICard, content) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo',

        initialize: function (options) {
            var self = this;

            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-card-media-info',
                icon   : 'fa fa-picture-o',
                title  : QUILocale.get(lg, 'dashboard.media.info'),
                content: Mustache.render(content, {
                    tableTitle     : QUILocale.get(lg, 'dashboard.media.info.table.title'),
                    filesCount     : QUILocale.get(lg, 'dashboard.media.info.files.count'),
                    folderCount    : QUILocale.get(lg, 'dashboard.media.info.folder.count'),
                    folderSize     : QUILocale.get(lg, 'dashboard.media.info.folder.size'),
                    cacheFolderSize: QUILocale.get(lg, 'dashboard.media.info.cache.folder.size'),
                    chartTitle     : QUILocale.get(lg, 'dashboard.media.info.chart.title')
                }),
                footer : false,
                styles : false,
                size   : 50
            });

            var ProjectSelectContainer = new Element('div', {
                id: 'media-info-project-select'
            });

            var ProjectSelectControl = new ProjectSelect({
                langSelect : false,
                emptyselect: false
            }).inject(ProjectSelectContainer);

            // We need to add this event later, since injecting the project-select also fires a change event
            ProjectSelectControl.addEvent('onChange', function (selectedProject) {
                self.displayProject(selectedProject);
            });

            // TODO: Set to the default or last project
            ProjectSelectControl.$Select.setValue(QUIQQER_PROJECT.name);

            ProjectSelectContainer.inject(this.getElm().getElement('.quiqqer-dashboard-card-header'));
        },


        refresh: function () {
            // Nothing to do here, since injecting the project-select already triggers a change event.
            // This then calls displayProject()
            // We're not leaving this function out, for a better understanding of what's happening here.
        },

        displayProject: function (projectName) {
            var self = this;

            if (projectName === undefined) {
                projectName = QUIQQER_PROJECT.name;
            }

            // latest user logins
            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getMediaInfo', function (result) {

                var Card = self.getElm();

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

                Card.getElement('#media-info-files-count .value').set('html', result.filesCount);
                Card.getElement('#media-info-folder-count .value').set('html', result.folderCount);

                // Clear the element's content and add the folder size
                Card.getElement('#media-info-folder-size .value').empty();
                Card.getElement('#media-info-folder-size .value').adopt(mediaFolderSize);

                // Clear the element's content and add the folder size
                Card.getElement('#media-info-cache-folder-size .value').empty();
                Card.getElement('#media-info-cache-folder-size .value').adopt(mediaCacheFolderSize);

                var ChartContainer = Card.getElement('#chart-container');

                if (!result.filesCount) {
                    ChartContainer.hide();
                    return;
                }

                require([URL_OPT_DIR + 'bin/chart.js/dist/Chart.js'], function (Chart) {
                    if (self.$MediaInfoChart !== undefined) {
                        self.$MediaInfoChart.destroy();
                        self.$MediaInfoChart = undefined;
                    }

                    var colors = [];
                    var filetypes = Object.keys(result.filetypesCount);

                    for (var i = 0; i < filetypes.length; i++) {
                        colors.push(ColorUtil.getHexColorByHashingString(filetypes[i]));
                    }

                    self.$MediaInfoChart = new Chart(Card.getElement('#chart'), {
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
                            labels  : filetypes
                        },
                        options: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    });

                    ChartContainer.show();
                });
            }, {
                'package'  : 'quiqqer/dashboard',
                projectName: projectName,
                onError    : console.error
            });
        }
    });
});