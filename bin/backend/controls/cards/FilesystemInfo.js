/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo', [

    'Ajax',
    'Locale',
    'Mustache',

    'utils/Date',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo.css'

], function (QUIAjax, QUILocale, Mustache, DateUtil, QUICard, contentTemplate) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/FileSystemInfo',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-card-filesystem-info',
                icon   : 'fa fa-hdd-o',
                title  : QUILocale.get(lg, 'dashboard.filesystem.info'),
                content: Mustache.render(contentTemplate, {
                    sizeInstallation: QUILocale.get(lg, 'dashboard.filesystem.info.size.installation'),
                    sizePackages    : QUILocale.get(lg, 'dashboard.filesystem.info.size.packages'),
                    sizeCache       : QUILocale.get(lg, 'dashboard.filesystem.info.size.cache'),
                    sizeVar         : QUILocale.get(lg, 'dashboard.filesystem.info.size.var'),
                    countFiles      : QUILocale.get(lg, 'dashboard.filesystem.info.count.files')
                }),
                footer : false,
                styles : false,
                size   : 33
            });
        },

        refresh: function () {
            var self = this;
            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getFilesystemInfo', function (result) {
                var Card = self.getElm();

                // Total size
                var SizeInstallationValue = Card.getElement('#filesystem-info-size-installation .value');
                SizeInstallationValue.empty();
                SizeInstallationValue.adopt(
                    self.buildValue(result.sizeInstallation, result.sizeInstallationTimestamp)
                );

                // Packages size
                var SizePackagesValue = Card.getElement('#filesystem-info-size-packages .value');
                SizePackagesValue.empty();
                SizePackagesValue.adopt(
                    self.buildValue(result.sizePackages, result.sizePackagesTimestamp)
                );

                // Cache size
                var SizeCacheValue = Card.getElement('#filesystem-info-size-cache .value');
                SizeCacheValue.empty();
                SizeCacheValue.adopt(
                    self.buildValue(result.sizeCache, result.sizeCacheTimestamp)
                );

                // Var size
                var SizeVarValue = Card.getElement('#filesystem-info-size-var .value');
                SizeVarValue.empty();
                SizeVarValue.adopt(
                    self.buildValue(result.sizeVar, result.sizeVarTimestamp)
                );

                // File count
                var CountFilesValue = Card.getElement('#filesystem-info-count-files .value');
                CountFilesValue.empty();
                CountFilesValue.adopt(
                    self.buildValue(result.countFiles, result.countFilesTimestamp, false)
                );
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        },


        /**
         * Builds a value element (span) that can be inserted into the table.
         * Takes a value and a timestamp.
         *
         * @param {number} value
         * @param {number} [timestamp]
         * @param {boolean} [convertToMegabytes]
         *
         * @return {Element}
         */
        buildValue: function (value, timestamp, convertToMegabytes) {
            if (convertToMegabytes === undefined) {
                convertToMegabytes = true;
            }

            var FACTOR_BYTE_TO_MEGABYTE = 1e+6;

            var ValueElement = new Element('span', {
                title: QUILocale.get(lg, 'dashboard.filesystem.info.unavailable'),
                html : '–'
            });

            if (value !== null) {
                var html = value;

                // Convert to Megabytes and round to two fractional digits
                if (convertToMegabytes) {
                    html = (value / FACTOR_BYTE_TO_MEGABYTE).toFixed(2) + " MB";
                }

                ValueElement = new Element('span', {
                    html: html
                });

                // If there is a timestamp, calculate how much time passed since then
                if (timestamp) {
                    var DateFromTimestamp = new Date(timestamp * 1000),
                        timeSinceDateText = DateUtil.getTimeSinceAsString(DateFromTimestamp);

                    ValueElement.innerHTML += "<br><small>(" + timeSinceDateText + ")</small>";
                }
            }

            return ValueElement;
        }
    });
});