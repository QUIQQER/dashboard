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
        $result   = [];
        $projects = QUI::getProjectManager()->getProjectList();

        foreach ($projects as $Project) {
            /* @var $Project \QUI\Projects\Project */
            $sites = $Project->getSites([
                'limit' => 10,
                'order' => 'e_date DESC'
            ]);

            /* @var $Site \QUI\Projects\Site */
            foreach ($sites as $Site) {
                $result[] = [
                    'id'      => $Site->getId(),
                    'name'    => $Site->getAttribute('name'),
                    'title'   => $Site->getAttribute('title'),
                    'e_date'  => $Site->getAttribute('e_date'),
                    'project' => $Project->getName(),
                    'lang'    => $Project->getLang(),
                ];
            }
        }

        usort($result, function ($a, $b) {
            return strtotime($a['e_date']) < strtotime($b['e_date']);
        });

        return array_slice($result, 0, 10);
    },
    false,
    'Permission::checkAdminUser'
);
