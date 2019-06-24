<?php

/**
 * @author PCSG (Jan Wennrich)
 */

namespace QUI\Dashboard;

/**
 * Class DashboardProvider
 *
 * @package dashboard\src\QUI\Dashboard
 */
class DashboardProvider implements DashboardProviderInterface
{
    /**
     * @inheritdoc
     *
     * @return array
     */
    public static function getCards()
    {
        $cards = [
            'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',
            'package/quiqqer/dashboard/bin/backend/controls/cards/Links',

            'package/quiqqer/dashboard/bin/backend/controls/cards/Messages',

            'package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo',

            'package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity',

            'package/quiqqer/dashboard/bin/backend/controls/cards/Bookmarks',

            'package/quiqqer/dashboard/bin/backend/controls/cards/SiteStats',

            // A whole row of cards. No other cards will be added to this row.
            [
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Projects',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Groups',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth'
            ]
        ];

        if (\QUI::getUserBySession()->isSU()) {
            $cards = array_merge($cards, [
                'package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins',
                'package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory',
            ]);
        }

        return $cards;
    }
}
