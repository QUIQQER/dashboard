<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getLatestLogins
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getLatestLogins',
    function () {
        $users = QUI::getUsers()->getUsers([
            'order' => 'lastvisit DESC',
            'limit' => 10
        ]);

        $Formatter = QUI::getLocale()->getDateFormatter(
            \IntlDateFormatter::SHORT,
            \IntlDateFormatter::SHORT
        );

        return array_map(function ($User) use ($Formatter) {
            /* @var $User \QUI\Users\User */
            $lastvisit = $User->getAttribute('lastvisit');

            if (!$lastvisit) {
                $date = '---';
            } else {
                $date = $Formatter->format($lastvisit);
            }

            return [
                'uid'      => $User->getId(),
                'name'     => $User->getName(),
                'username' => $User->getUsername(),
                'date'     => $date
            ];
        }, $users);
    },
    false,
    'Permission::checkAdminUser'
);
