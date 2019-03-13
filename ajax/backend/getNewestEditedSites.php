<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getStatNumbers
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getNewestEditedSites',
    function () {
        $projects = QUI::getProjectManager()->getProjectList();
        $query    = "";

        // Generate the query
        foreach ($projects as $Project) {
            /* @var $Project \QUI\Projects\Project */

            $projectName = $Project->getName();
            $projectLang = $Project->getLang();

            $query .= "SELECT id, name, title, e_date, '{$projectName}' AS project, '{$projectLang}' AS lang ";
            $query .= "FROM `{$projectName}_{$projectLang}_sites` ";


            if (next($projects)) {
                $query .= "UNION ALL ";
            }
        }
        $query .= "ORDER BY e_date DESC ";
        $query .= "LIMIT 10;";

        $result = QUI::getDataBase()->fetchSQL($query);

        $Formatter = QUI::getLocale()->getDateFormatter(
            \IntlDateFormatter::SHORT,
            \IntlDateFormatter::SHORT
        );

        foreach ($result as $key => $siteData) {
            $result[$key]['e_date'] = $Formatter->format(strtotime($siteData['e_date']));
        }

        return $result;
    },
    false,
    'Permission::checkAdminUser'
);
