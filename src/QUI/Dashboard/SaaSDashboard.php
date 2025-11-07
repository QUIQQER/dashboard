<?php

namespace QUI\Dashboard;

use QUI;
use QUI\Locale;

class SaaSDashboard implements QUI\Dashboard\DashboardInterface
{
    /**
     * @param Locale|null $Locale
     * @return string
     */
    public function getTitle(null | QUI\Locale $Locale = null): string
    {
        if ($Locale === null) {
            $Locale = QUI::getLocale();
        }

        return $Locale->get('quiqqer/dashboard', 'dashboard.saas.title');
    }

    /**
     * @return array
     */
    public function getCards(): array
    {
        return [
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersStats',
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/UsersRegistration',
            'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages',
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersCount',
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/UsersCount',
            'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users'
        ];
    }

    public function getJavaScriptControl(): string
    {
        return 'package/quiqqer/dashboard/bin/backend/controls/SaaSDashboard';
    }
}
