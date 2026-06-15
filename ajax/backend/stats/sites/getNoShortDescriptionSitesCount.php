<?php

/**
 * @return array
 */

use QUI\System\Log;

QUI::getAjax()->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoShortDescriptionSitesCount',
    function ($projectName) {
        try {
            $Project = QUI::getProject($projectName);
        } catch (\QUI\Exception $Exception) {
            Log::writeException($Exception);
            return '';
        }

        try {
            $QueryBuilder = QUI::getQueryBuilder();
            $sitesWithoutShortDesc = $QueryBuilder
                ->select('COUNT(id)')
                ->from(QUI\Utils\Doctrine::quoteIdentifier($Project->table()))
                ->where($QueryBuilder->expr()->isNull('short'))
                ->orWhere($QueryBuilder->expr()->eq('short', ':short'))
                ->setParameter('short', '')
                ->executeQuery()
                ->fetchOne();
        } catch (QUI\Exception | \Doctrine\DBAL\Exception $Exception) {
            Log::addError($Exception, [
                'ajax' => 'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoShortDescriptionSitesCount'
            ]);
        }

        if (isset($sitesWithoutShortDesc) && is_numeric($sitesWithoutShortDesc)) {
            $sitesWithoutShortDesc = (int)$sitesWithoutShortDesc;

            return QUI::getLocale()->formatNumber($sitesWithoutShortDesc);
        }

        return '';
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
