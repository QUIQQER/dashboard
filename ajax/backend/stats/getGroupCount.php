<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_stats_getGroupCount
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_getGroupCount',
    function () {
        return QUI::getGroups()->count();
    },
    false,
    'Permission::checkAdminUser'
);
