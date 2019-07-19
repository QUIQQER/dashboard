<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getCards
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getCards',
    function () {
        return QUI\Dashboard\DashboardHandler::getInstance()->getCardsForUsersDashboard();
    },
    false,
    'Permission::checkAdminUser'
);
