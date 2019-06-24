<?php
/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getChildrenSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            \QUI\System\Log::writeException($Exception);

            return null;
        }

        $sitesRelationsTable = $Project->table() . '_relations';

        $query = "
            SELECT COUNT(`child`) AS childrenSites
            FROM {$sitesRelationsTable}
            WHERE `parent` <> 1;            
        ";

        $result = QUI::getDataBase()->fetchSQL($query);

        if (isset($result[0])
            && isset($result[0]['childrenSites'])
            && is_numeric($result[0]['childrenSites'])
        ) {
            return (int)$result[0]['childrenSites'];
        }

        return;
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
