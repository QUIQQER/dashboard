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
        try {
            $Project = \QUI\Projects\Manager::getProject($projectName);

            return [
                'folderCount'                   => MediaUtils::countFoldersForProject($Project),
                'filesCount'                    => MediaUtils::countFilesForProject($Project),
                'filetypesCount'                => MediaUtils::countFiletypesForProject($Project),
                'mediaFolderSize'               => MediaUtils::getMediaFolderSizeForProject($Project),
                'mediaFolderSizeTimestamp'      => MediaUtils::getMediaFolderSizeTimestampForProject($Project),
                'mediaCacheFolderSize'          => MediaUtils::getMediaCacheFolderSizeForProject($Project),
                'mediaCacheFolderSizeTimestamp' => MediaUtils::getMediaCacheFolderSizeTimestampForProject($Project),
                'projectName'                   => $projectName
            ];
        } catch (\QUI\Exception $Exception) {
            \QUI\System\Log::writeException($Exception);
            return [];
        }
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
