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
        foreach ($projects as $Project) {
            $count = $Project->getSitesIds([
                'count' => true
            ]);

            $sites = $sites + $count[0]['count'];
        }

        $result['sites'] = $sites;

        return $result;
    },
    false,
    'Permission::checkAdminUser'
);
