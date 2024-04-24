<?php

/**
 * @return array
 */

use QUI\System\Log;

QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getRootSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            Log::writeException($Exception);

            return '';
        }

        $sitesRelationsTable = $Project->table() . '_relations';

        $query = "
            SELECT COUNT(`child`) AS rootSites
            FROM {$sitesRelationsTable}
            WHERE `parent` = 1;       
        ";

        $result = QUI::getDataBase()->fetchSQL($query);

        if (isset($result[0]['rootSites']) && is_numeric($result[0]['rootSites'])) {
            $rootSites = (int)$result[0]['rootSites'];

            return QUI::getLocale()->formatNumber($rootSites);
        }

        return '';
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
