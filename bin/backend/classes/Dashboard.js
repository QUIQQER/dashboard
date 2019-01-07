/**
 * @module package/quiqqer/dashboard/bin/backend/classes/Dashboard
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/classes/Dashboard', [

    'qui/QUI',
    'qui/classes/DOM',
    'Ajax'

], function (QUI, QUIDOM, Ajax) {
    "use strict";

    return new Class({

        Extends: QUIDOM,
        Type   : 'package/quiqqer/dashboard/bin/backend/classes/Dashboard',

        /**
         * Return the basic stats
         *
         * @return {Promise}
         */
        getStats: function () {
            return new Promise(function (resolve, reject) {
                Ajax.get('package_quiqqer_dashboard_ajax_backend_getStatNumbers', resolve, {
                    'package': 'quiqqer/dashboard',
                    onError  : reject
                });
            });
        },


        /**
         * Returns information about project's media
         *
         * @param {string} projectName - The project to get the media info for
         *
         * @return {Promise}
         */
        getMediaInfo: function (projectName) {
            return new Promise(function (resolve, reject) {
                Ajax.get('package_quiqqer_dashboard_ajax_backend_getMediaInfo', resolve, {
                    'package'  : 'quiqqer/dashboard',
                    projectName: projectName,
                    onError    : reject
                });
            });
        }
    });
});
