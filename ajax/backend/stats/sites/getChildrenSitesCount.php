<?php

/**
 * @return array
 */

use QUI\System\Log;

QUI::getAjax()->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getChildrenSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            Log::writeException($Exception);

            return null;
        }

        $sitesRelationsTable = $Project->table() . '_relations';

        try {
            $QueryBuilder = QUI::getQueryBuilder();
            $childrenSites = $QueryBuilder
                ->select('COUNT(child)')
                ->from(QUI\Utils\Doctrine::quoteIdentifier($sitesRelationsTable))
                ->where($QueryBuilder->expr()->neq('parent', ':parent'))
                ->setParameter('parent', 1)
                ->executeQuery()
                ->fetchOne();
        } catch (QUI\Exception | \Doctrine\DBAL\Exception $Exception) {
            Log::addError($Exception, [
                'ajax' => 'package_quiqqer_dashboard_ajax_backend_stats_sites_getChildrenSitesCount'
            ]);
        }

        if (isset($childrenSites) && is_numeric($childrenSites)) {
            $childrenSites = (int)$childrenSites;

            return QUI::getLocale()->formatNumber($childrenSites);
        }

        return null;
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
