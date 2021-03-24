/**
 * @module package/quiqqer/dashboard/bin/backend/classes/Stats
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/classes/Stats', [

    'qui/QUI',
    'qui/classes/DOM',
    'Ajax'

], function (QUI, QUIDOM, QUIAjax) {
    "use strict";

    return new Class({

        Extends: QUIDOM,
        Type   : 'package/quiqqer/dashboard/bin/backend/classes/Stats',

        initialize: function (options) {
            this.parent(options);

            this.$stats     = null;
            this.$isRunning = false;
        },

        getStats: function () {
            if (this.$stats) {
                return Promise.resolve(this.$stats);
            }

            var self = this;

            if (this.$isRunning) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        self.getStats().then(resolve);
                    }, 100);
                });
            }

            this.$isRunning = true;

            return new Promise(function (resolve, reject) {
                QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getStats', function (res) {
                    self.$stats     = res;
                    self.$isRunning = false;

                    resolve(res);
                }, {
                    'package': 'quiqqer/dashboard',
                    onError  : function (err) {
                        console.error(err);
                        reject(err);
                    }
                });
            });
        },

        refresh: function () {
            this.$Stats = null;

            return this.getStats();
        }
    });
});
