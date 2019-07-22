<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getFilesystemInfo
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getFilesystemInfo',
    function () {
        return [
            'sizeInstallation'          => \QUI\Utils\Installation::getWholeFolderSize(),
            'sizeInstallationTimestamp' => \QUI\Utils\Installation::getWholeFolderSizeTimestamp(),

            'sizePackages'          => QUI::getPackageManager()->getPackageFolderSize(),
            'sizePackagesTimestamp' => QUI::getPackageManager()->getPackageFolderSizeTimestamp(),

            'sizeCache'          => \QUI\Cache\Manager::getCacheFolderSize(),
            'sizeCacheTimestamp' => \QUI\Cache\Manager::getCacheFolderSizeTimestamp(),

            'sizeVar'          => \QUI\Utils\Installation::getVarFolderSize(),
            'sizeVarTimestamp' => \QUI\Utils\Installation::getVarFolderSizeTimestamp(),

            'countFiles'          => \QUI::getLocale()->formatNumber(\QUI\Utils\Installation::getAllFileCount()),
            'countFilesTimestamp' => \QUI\Utils\Installation::getAllFileCountTimestamp()
        ];
    },
    false,
    'Permission::checkAdminUser'
);
