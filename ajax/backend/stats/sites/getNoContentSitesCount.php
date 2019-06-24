<?php
/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoContentSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            \QUI\System\Log::writeException($Exception);

            return;
        }

        $query = "
            SELECT COUNT(`id`) AS sitesWithoutContent
            FROM {$Project->table()}
            WHERE `content` IS NULL OR `content` = '';
        ";

        $result = QUI::getDataBase()->fetchSQL($query);

        if (isset($result[0])
            && isset($result[0]['sitesWithoutContent'])
            && is_numeric($result[0]['sitesWithoutContent'])
        ) {
            return (int)$result[0]['sitesWithoutContent'];
        }

        return;
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
