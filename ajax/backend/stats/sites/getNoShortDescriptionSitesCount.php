<?php
/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoShortDescriptionSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            \QUI\System\Log::writeException($Exception);

            return;
        }

        $query = "
            SELECT COUNT(`id`) AS sitesWithoutShortDesc
            FROM {$Project->table()}
            WHERE `short` IS NULL OR `short` = '';   
        ";

        $result = QUI::getDataBase()->fetchSQL($query);

        if (isset($result[0])
            && isset($result[0]['sitesWithoutShortDesc'])
            && is_numeric($result[0]['sitesWithoutShortDesc'])
        ) {
            return (int)$result[0]['sitesWithoutShortDesc'];
        }

        return;
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
