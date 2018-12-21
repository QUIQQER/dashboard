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
        // TODO: https://dev.quiqqer.com/quiqqer/dashboard/issues/7
        $packageFolderSize = QUI::getPackageManager()->getPackageFolderSize();

        return [
            'totalSize' => 0,
            'totalFileCount' => 0,
            'packageFolderSize' => $packageFolderSize,
            'cacheFolderSize' => 0,
            'varFolderSize' => 0
        ];
    },
    false,
    'Permission::checkAdminUser'
);
