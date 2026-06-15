<?php

/**
 * @return array
 */

use QUI\System\Log;

QUI::getAjax()->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getRootSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            Log::writeException($Exception);

            return '';
        }

        $sitesRelationsTable = $Project->table() . '_relations';

        try {
            $QueryBuilder = QUI::getQueryBuilder();
            $rootSites = $QueryBuilder
                ->select('COUNT(child)')
                ->from(QUI\Utils\Doctrine::quoteIdentifier($sitesRelationsTable))
                ->where($QueryBuilder->expr()->eq('parent', ':parent'))
                ->setParameter('parent', 1)
                ->executeQuery()
                ->fetchOne();
        } catch (QUI\Exception | \Doctrine\DBAL\Exception $Exception) {
            Log::addError($Exception, [
                'ajax' => 'package_quiqqer_dashboard_ajax_backend_stats_sites_getRootSitesCount'
            ]);
        }

        if (isset($rootSites) && is_numeric($rootSites)) {
            $rootSites = (int)$rootSites;

            return QUI::getLocale()->formatNumber($rootSites);
        }

        return '';
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
