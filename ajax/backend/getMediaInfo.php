<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getMediaInfo
 */

use QUI\Projects\Manager;
use QUI\Projects\Media\Utils as MediaUtils;
use QUI\System\Log;

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getMediaInfo',
    function ($projectName) {
        try {
            $Project = Manager::getProject($projectName);
            $Locale = QUI::getLocale();

            $folderCount = MediaUtils::countFoldersForProject($Project);
            $filesCount = MediaUtils::countFilesForProject($Project);

            return [
                'folderCount' => $Locale->formatNumber($folderCount),
                'filesCount' => $Locale->formatNumber($filesCount),
                'filetypesCount' => MediaUtils::countFiletypesForProject($Project),
                'mediaFolderSize' => MediaUtils::getMediaFolderSizeForProject($Project),
                'mediaFolderSizeTimestamp' => MediaUtils::getMediaFolderSizeTimestampForProject($Project),
                'mediaCacheFolderSize' => MediaUtils::getMediaCacheFolderSizeForProject($Project),
                'mediaCacheFolderSizeTimestamp' => MediaUtils::getMediaCacheFolderSizeTimestampForProject($Project),
                'projectName' => $projectName
            ];
        } catch (\QUI\Exception $Exception) {
            Log::writeException($Exception);

            return [];
        }
    },
    ['projectName'],
    'Permission::checkAdminUser'
);
