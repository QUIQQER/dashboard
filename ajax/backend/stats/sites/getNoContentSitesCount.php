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

        try {
            $query = "
                SELECT COUNT(`id`) AS sitesWithoutContent
                FROM {$Project->table()}
                WHERE `content` IS NULL OR `content` = '';
            ";

            $result = QUI::getDataBase()->fetchSQL($query);
        } catch (QUI\Database\Exception $Exception) {
            Log::addError($Exception, [
                'ajax' => 'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoContentSitesCount'
            ]);
        }

        if (
            isset($result[0]['sitesWithoutContent'])
            && is_numeric($result[0]['sitesWithoutContent'])
        ) {
            $sitesWithoutContent = (int)$result[0]['sitesWithoutContent'];

            return QUI::getLocale()->formatNumber($sitesWithoutContent);
        }

        return '';
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
