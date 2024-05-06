<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getFilesystemInfo
 */

/**
 * @return array
 */

use QUI\Cache\Manager;
use QUI\Utils\Installation;

QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getFilesystemInfo',
    function () {
        $fileCount = Installation::getAllFileCount();

        if (!is_null($fileCount)) {
            $fileCount = QUI::getLocale()->formatNumber($fileCount);
        }

        return [
            'sizeInstallation' => Installation::getWholeFolderSize(),
            'sizeInstallationTimestamp' => Installation::getWholeFolderSizeTimestamp(),

            'sizePackages' => QUI::getPackageManager()->getPackageFolderSize(),
            'sizePackagesTimestamp' => QUI::getPackageManager()->getPackageFolderSizeTimestamp(),

            'sizeCache' => Manager::getCacheFolderSize(),
            'sizeCacheTimestamp' => Manager::getCacheFolderSizeTimestamp(),

            'sizeVar' => Installation::getVarFolderSize(),
            'sizeVarTimestamp' => Installation::getVarFolderSizeTimestamp(),

            'countFiles' => $fileCount,
            'countFilesTimestamp' => Installation::getAllFileCountTimestamp()
        ];
    },
    false,
    'Permission::checkAdminUser'
);
