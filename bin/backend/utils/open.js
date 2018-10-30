/**
 * Helper function to open the dashboard panel
 *
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/utils/open', [

    'package/quiqqer/dashboard/bin/backend/controls/Dashboard',
    'utils/Panels'

], function (Dashboard, PanelUtils) {
    "use strict";

    return function () {
        PanelUtils.openPanelInTasks(new Dashboard());
    };
});