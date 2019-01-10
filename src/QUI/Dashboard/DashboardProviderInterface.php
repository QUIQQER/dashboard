<?php

/**
 * @author PCSG (Jan Wennrich)
 */

namespace QUI\Dashboard;

/**
 * Interface AbstractDashboardProvider
 *
 * @package dashboard\src\QUI\Dashboard
 */
interface DashboardProviderInterface
{
    /**
     * Returns the cards that should be added to the dashboard.
     *
     * The returned values has to be an array of strings.
     * Those strings contain the names of JavaScript-Card-Controls.
     * For example: 'package/quiqqer/dashboard/bin/backend/controls/cards/Links'
     *
     * It is also possible to add add a whole row instead of a single card:
     * To do this the returned array has to contain another array.
     * This sub-array then contains all the JavaScript-Card-Control names.
     *
     * @example see QUI\Dashboard\DashboardProvider
     *
     * @return array
     */
    public static function getCards();
}
