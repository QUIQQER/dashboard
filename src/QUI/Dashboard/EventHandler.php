<?php

/**
 * This file contains QUI\Dashboard\EventHandler
 */

namespace QUI\Dashboard;

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
        echo "<script>require(['package/quiqqer/dashboard/bin/backend/utils/load'])</script>";
    }
}
