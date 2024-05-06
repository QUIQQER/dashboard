<?php

/**
 * @return array
 */

use QUI\System\Log;

QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoContentSitesCount',
    function ($projectName) {
        if (empty($projectName)) {
            return '';
        }

        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            Log::writeException($Exception);

            return '';
        }

        $query = "
            SELECT COUNT(`id`) AS sitesWithoutContent
            FROM {$Project->table()}s
            WHERE `content` IS NULL OR `content` = '';
        ";

        $result = QUI::getDataBase()->fetchSQL($query);

        if (
            isset($result[0]['sitesWithoutContent']) && is_numeric($result[0]['sitesWithoutContent'])
        ) {
            $sitesWithoutContent = (int)$result[0]['sitesWithoutContent'];

            return QUI::getLocale()->formatNumber($sitesWithoutContent);
        }

        return '';
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
