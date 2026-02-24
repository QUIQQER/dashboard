<?php

namespace QUITests\Dashboard;

use PHPUnit\Framework\TestCase;
use QUI\Dashboard\DashboardProvider;
use QUI\Dashboard\SaaSDashboard;

class DashboardProviderTest extends TestCase
{
    public function testGetCardsContainsDefaultDashboardCards(): void
    {
        $cards = DashboardProvider::getCards();

        $this->assertContains(
            'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',
            $cards
        );
        $this->assertContains(
            'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/SystemHealth',
            $cards
        );
    }

    public function testGetBoardsReturnsSaaSDashboardBoard(): void
    {
        $boards = DashboardProvider::getBoards();

        $this->assertCount(1, $boards);
        $this->assertInstanceOf(SaaSDashboard::class, $boards[0]);
    }
}
