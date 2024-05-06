<?php

/**
 * @return array
 */

use QUI\System\Log;

QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoShortDescriptionSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            Log::writeException($Exception);
            return '';
        }

        $query = "
            SELECT COUNT(`id`) AS sitesWithoutShortDesc
            FROM {$Project->table()}
            WHERE `short` IS NULL OR `short` = '';   
        ";

        $result = QUI::getDataBase()->fetchSQL($query);

        if (isset($result[0]['sitesWithoutShortDesc']) && is_numeric($result[0]['sitesWithoutShortDesc'])) {
            $sitesWithoutShortDesc = (int)$result[0]['sitesWithoutShortDesc'];

            return QUI::getLocale()->formatNumber($sitesWithoutShortDesc);
        }

        return '';
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
