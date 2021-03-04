<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_stats_getSystemHealth
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_getSystemHealth',
    function () {
        $results = \QUI\Requirements\Utils::getSystemCheckResults();

        // Counts how often each status is in the results (e.g. [STATUS_FAILED => 3, STATUS_OKAY => 10])
        $resultCategories = array_count_values($results);

        if (isset($resultCategories[\QUI\Requirements\TestResult::STATUS_FAILED])) {
            return \QUI\Requirements\TestResult::STATUS_FAILED;
        }

        if (isset($resultCategories[\QUI\Requirements\TestResult::STATUS_WARNING])) {
            return \QUI\Requirements\TestResult::STATUS_WARNING;
        }

        if (isset($resultCategories[\QUI\Requirements\TestResult::STATUS_OK])) {
            return \QUI\Requirements\TestResult::STATUS_OK;
        }

        return \QUI\Requirements\TestResult::STATUS_UNKNOWN;
    },
    false,
    'Permission::checkAdminUser'
);
