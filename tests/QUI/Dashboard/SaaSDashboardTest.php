<?php

namespace QUITests\Dashboard;

use PHPUnit\Framework\TestCase;
use QUI\Dashboard\SaaSDashboard;

class SaaSDashboardTest extends TestCase
{
    public function testGetTitleWithDefaultLocaleReturnsString(): void
    {
        $Dashboard = new SaaSDashboard();

        $this->assertIsString($Dashboard->getTitle());
    }

    public function testGetTitleUsesProvidedLocale(): void
    {
        $Dashboard = new SaaSDashboard();

        $Locale = $this->getMockBuilder(\QUI\Locale::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['get'])
            ->getMock();

        $Locale->expects($this->once())
            ->method('get')
            ->with('quiqqer/dashboard', 'dashboard.saas.title')
            ->willReturn('SaaS Dashboard');

        $this->assertSame('SaaS Dashboard', $Dashboard->getTitle($Locale));
    }

    public function testGetCardsReturnsExpectedCards(): void
    {
        $Dashboard = new SaaSDashboard();

        $this->assertSame([
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersStats',
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/UsersRegistration',
            'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages',
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/OrdersCount',
            'package/quiqqer/dashboard/bin/backend/controls/cards/saas/UsersCount',
            'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users'
        ], $Dashboard->getCards());
    }

    public function testGetJavaScriptControlReturnsControlPath(): void
    {
        $Dashboard = new SaaSDashboard();

        $this->assertSame(
            'package/quiqqer/dashboard/bin/backend/controls/SaaSDashboard',
            $Dashboard->getJavaScriptControl()
        );
    }
}
