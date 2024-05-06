<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getCronHistory
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getCronHistory',
    function () {
        $history = (new QUI\Cron\Manager())->getHistoryList(['perPage' => 10, 'page' => 1]);

        return array_map(function ($cronData) {
            // Format date (TODO: check if this is the correct data conversion method)
            $cronData['lastexec'] = QUI::getLocale()->formatDate($cronData['lastexec']);

            // Unset these to save bandwidth
            unset($cronData['cronid']);
            unset($cronData['uid']);

            return $cronData;
        }, $history);
    },
    false,
    'Permission::checkAdminUser'
);
