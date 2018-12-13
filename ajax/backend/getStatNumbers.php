<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getStatNumbers
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getStatNumbers',
    function () {
        $result = [];

        // Projects
        $Config = QUI::getProjectManager()->getConfig();
        $config = $Config->toArray();

        $result['projects'] = count($config);

        // users
        $result['users'] = QUI::getUsers()->count();

        // groups
        $result['groups'] = QUI::getGroups()->count();

        // sites
        $sites    = 0;
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

        $result['sites']['total']    = $active + $inactive;
        $result['sites']['active']   = $active;
        $result['sites']['inactive'] = $inactive;

        return $result;
    },
    false,
    'Permission::checkAdminUser'
);
