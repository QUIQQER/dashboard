<?php

namespace QUITests\Dashboard;

use PHPUnit\Framework\TestCase;
use QUI\Dashboard\EventHandler;

class EventHandlerUnitTest extends TestCase
{
    public function testOnAdminLoadFooterEmitsDashboardScriptByDefault(): void
    {
        ob_start();
        EventHandler::onAdminLoadFooter();
        $output = ob_get_clean();

        $this->assertStringContainsString(
            "package/quiqqer/dashboard/bin/backend/utils/load",
            (string)$output
        );
    }
}
