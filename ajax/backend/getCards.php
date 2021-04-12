<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getCards
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getCards',
    function ($dashboardId) {
        $Handler = QUI\Dashboard\DashboardHandler::getInstance();

        if (!empty($dashboardId) || $dashboardId === 0) {
            $cards  = $Handler->getCardsFromBoard($dashboardId);
            $result = [];

            foreach ($cards as $card) {
                if (empty($card)) {
                    continue;
                }

                $result[$card] = [
                    'enabled'  => true,
                    'priority' => null
                ];
            }

            return $result;
        }

        // default
        return $Handler->getCardsForUsersDashboard();
    },
    ['dashboardId'],
    'Permission::checkAdminUser'
);
