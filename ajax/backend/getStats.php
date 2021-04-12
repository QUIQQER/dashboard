<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getStats
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getStats',
    function () {
        require_once 'stats/getGroupCount.php';
        require_once 'stats/getPageCount.php';
        require_once 'stats/getProjectCount.php';
        require_once 'stats/getSystemHealth.php';
        require_once 'stats/getUserCount.php';

        $result = [
            'getGroupCount'   => '',
            'getPageCount'    => '',
            'getProjectCount' => '',
            'getSystemHealth' => '',
            'getUserCount'    => '',
        ];

        // group count
        $groupCount = QUI::$Ajax->callRequestFunction('package_quiqqer_dashboard_ajax_backend_stats_getGroupCount', [
            'package' => 'quiqqer/dashboard'
        ]);

        if (isset($groupCount['result'])) {
            $result['getGroupCount'] = $groupCount['result'];
        }

        // page count
        $pageCount = QUI::$Ajax->callRequestFunction('package_quiqqer_dashboard_ajax_backend_stats_getPageCount', [
            'package' => 'quiqqer/dashboard'
        ]);

        if (isset($pageCount['result'])) {
            $result['getPageCount'] = $pageCount['result'];
        }

        // project count
        $projectCount = QUI::$Ajax->callRequestFunction(
            'package_quiqqer_dashboard_ajax_backend_stats_getProjectCount',
            ['package' => 'quiqqer/dashboard']
        );

        if (isset($projectCount['result'])) {
            $result['getProjectCount'] = $projectCount['result'];
        }

        // system health
        $systemHealth = QUI::$Ajax->callRequestFunction(
            'package_quiqqer_dashboard_ajax_backend_stats_getSystemHealth',
            ['package' => 'quiqqer/dashboard']
        );

        if (isset($systemHealth['result'])) {
            $result['getSystemHealth'] = $systemHealth['result'];
        }

        // user count
        $userCount = QUI::$Ajax->callRequestFunction(
            'package_quiqqer_dashboard_ajax_backend_stats_getUserCount',
            ['package' => 'quiqqer/dashboard']
        );

        if (isset($userCount['result'])) {
            $result['getUserCount'] = $userCount['result'];
        }

        return $result;
    },
    false,
    'Permission::checkAdminUser'
);
