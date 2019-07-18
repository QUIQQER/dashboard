<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getCards
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getCardSettings',
    function () {
        return QUI\Dashboard\DashboardHandler::getInstance()->getCardsWithSettings();
    },
    false,
    'Permission::checkAdminUser'
);
