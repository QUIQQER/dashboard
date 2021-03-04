<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_stats_getUserCount
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_getUserCount',
    function () {
        return QUI::getLocale()->formatNumber(QUI::getUsers()->count());
    },
    false,
    'Permission::checkAdminUser'
);
