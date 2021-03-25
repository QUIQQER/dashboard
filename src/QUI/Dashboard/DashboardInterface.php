<?php

namespace QUI\Dashboard;

/**
 * Interface DashboardInterface
 */
interface DashboardInterface
{
    /**
     * @param null|\QUI\Locale $Locale
     * @return string
     */
    public function getTitle($Locale = null): string;

    /**
     * @return array
     */
    public function getCards(): array;
}
