<?php

/**
 * This file contains QUI\Dashboard\EventHandler
 */

namespace QUI\Dashboard;

use QUI;

/**
 * Class EventHandler
 *
 * @package QUI\Dashboard
 */
class EventHandler
{
    /**
     * Insert the dashboard
     */
    public static function onAdminLoadFooter()
    {
        if (QUI::getUserBySession()->getAttribute('quiqqer.dashboard.isDisabled')) {
            return;
        }

        echo "<script>require(['package/quiqqer/dashboard/bin/backend/utils/load'])</script>";
    }
}
