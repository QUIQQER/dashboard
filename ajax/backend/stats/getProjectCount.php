<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_stats_getProjectCount
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_getProjectCount',
    function () {
        $Config = QUI::getProjectManager()->getConfig();
        $config = $Config->toArray();

        return count($config);
    },
    false,
    'Permission::checkAdminUser'
);
