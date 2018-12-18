<?php

use \QUI\Projects\Media\Utils as MediaUtils;

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getMediaInfo
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getMediaInfo',
    function ($projectName) {
        $Project = \QUI\Projects\Manager::getProject($projectName);

        return [
            'folderCount'          => MediaUtils::countFoldersForProject($Project),
            'filesCount'           => MediaUtils::countFilesForProject($Project),
            'filetypesCount'       => MediaUtils::countFiletypesForProject($Project),
            'mediaFolderSize'      => MediaUtils::getMediaFolderSizeForProject($Project),
            'mediaCacheFolderSize' => MediaUtils::getMediaCacheFolderSizeForProject($Project),
            'projectName'          => $projectName
        ];
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
