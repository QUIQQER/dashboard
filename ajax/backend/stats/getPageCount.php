<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_stats_getPageCount
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_stats_getPageCount',
    function () {
        $result = [];

        // sites
        $projects = QUI::getProjectManager()->getProjectList();

        /* @var $Project \QUI\Projects\Project */
        $active   = 0;
        $inactive = 0;

        foreach ($projects as $Project) {
            // active
            $count = $Project->getSitesIds([
                'count' => true,
                'where' => [
                    'active' => 1
                ]
            ]);

            $active = $active + $count[0]['count'];

            // inactive
            $count = $Project->getSitesIds([
                'count' => true,
                'where' => [
                    'active' => 0
                ]
            ]);

            $inactive = $inactive + $count[0]['count'];
        }

        $result['total']    = $active + $inactive;
        $result['active']   = $active;
        $result['inactive'] = $inactive;

        return $result;
    },
    false,
    'Permission::checkAdminUser'
);
