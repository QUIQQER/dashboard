<?php
/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getRootSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            \QUI\System\Log::writeException($Exception);

            return;
        }

        $sitesRelationsTable = $Project->table() . '_relations';

        $query = "
            SELECT COUNT(`child`) AS rootSites
            FROM {$sitesRelationsTable}
            WHERE `parent` = 1;       
        ";

        $result = QUI::getDataBase()->fetchSQL($query);

        if (isset($result[0])
            && isset($result[0]['rootSites'])
            && is_numeric($result[0]['rootSites'])
        ) {
            return (int)$result[0]['rootSites'];
        }

        return;
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
