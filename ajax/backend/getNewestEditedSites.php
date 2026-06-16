<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getStatNumbers
 */

/**
 * @return array
 */

QUI::getAjax()->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getNewestEditedSites',
    function () {
        $projects = QUI::getProjectManager()->getProjectList();
        $result = [];

        foreach ($projects as $Project) {
            $projectName = $Project->getName();
            $projectLang = $Project->getLang();

            try {
                $QueryBuilder = QUI::getQueryBuilder();
                $sites = $QueryBuilder
                    ->select('id', 'name', 'title', 'e_date')
                    ->from(QUI\Utils\Doctrine::quoteIdentifier($Project->table()))
                    ->orderBy('e_date', 'DESC')
                    ->setMaxResults(10)
                    ->executeQuery()
                    ->fetchAllAssociative();
            } catch (QUI\Exception | \Doctrine\DBAL\Exception $Exception) {
                QUI\System\Log::writeDebugException($Exception);
                continue;
            }

            foreach ($sites as $site) {
                $site['project'] = $projectName;
                $site['lang'] = $projectLang;

                $result[] = $site;
            }
        }

        usort($result, function (array $siteA, array $siteB): int {
            return strtotime($siteB['e_date']) <=> strtotime($siteA['e_date']);
        });

        $result = array_slice($result, 0, 10);

        $Formatter = QUI::getLocale()->getDateFormatter(
            IntlDateFormatter::SHORT,
            IntlDateFormatter::SHORT
        );

        foreach ($result as $key => $siteData) {
            $result[$key]['e_date'] = $Formatter->format(strtotime($siteData['e_date']));
        }

        return $result;
    },
    false,
    'Permission::checkAdminUser'
);
