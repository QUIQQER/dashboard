<?php

/**
 * @return array
 */

use QUI\System\Log;

QUI::getAjax()->registerFunction(
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
            $QueryBuilder = QUI::getQueryBuilder();
            $sitesWithoutContent = $QueryBuilder
                ->select('COUNT(id)')
                ->from(QUI\Utils\Doctrine::quoteIdentifier($Project->table()))
                ->where($QueryBuilder->expr()->isNull('content'))
                ->orWhere($QueryBuilder->expr()->eq('content', ':content'))
                ->setParameter('content', '')
                ->executeQuery()
                ->fetchOne();
        } catch (QUI\Exception | \Doctrine\DBAL\Exception $Exception) {
            Log::addError($Exception, [
                'ajax' => 'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoContentSitesCount'
            ]);
        }

        if (isset($sitesWithoutContent) && is_numeric($sitesWithoutContent)) {
            $sitesWithoutContent = (int)$sitesWithoutContent;

            return QUI::getLocale()->formatNumber($sitesWithoutContent);
        }

        return '';
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
