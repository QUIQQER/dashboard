<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getSystemInfo
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getSystemInfo',
    function () {
        $availableCacheHandlers = QUI\Cache\Manager::getConfig()->getSection('handlers');
        $activeCacheHandler     = array_search('1', $availableCacheHandlers);

        $activeCacheHandlerTranslated = QUI::getLocale()->get(
            'quiqqer/system',
            'quiqqer.settings.cache.handler.' . $activeCacheHandler
        );

        return [
            'quiqqerVersion'  => QUI::getPackageManager()->getVersion(),
            'modulesCount'    => QUI::getPackageManager()->countInstalledPackages(),
            'isDevModeActive' => DEVELOPMENT == 1,
            'cacheType'       => $activeCacheHandlerTranslated
        ];
    },
    false,
    'Permission::checkAdminUser'
);
