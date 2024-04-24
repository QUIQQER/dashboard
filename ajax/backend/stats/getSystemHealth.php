<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_stats_getSystemHealth
 */

/**
 * @return array
 */

use QUI\Requirements\TestResult;
use QUI\Requirements\Utils;

QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_getSystemHealth',
    function () {
        $results = Utils::getSystemCheckResults();

        // Counts how often each status is in the results (e.g. [STATUS_FAILED => 3, STATUS_OKAY => 10])
        $resultCategories = array_count_values($results);

        if (isset($resultCategories[TestResult::STATUS_FAILED])) {
            return TestResult::STATUS_FAILED;
        }

        if (isset($resultCategories[TestResult::STATUS_WARNING])) {
            return TestResult::STATUS_WARNING;
        }

        if (isset($resultCategories[TestResult::STATUS_OK])) {
            return TestResult::STATUS_OK;
        }

        return TestResult::STATUS_UNKNOWN;
    },
    false,
    'Permission::checkAdminUser'
);
