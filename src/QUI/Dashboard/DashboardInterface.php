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

    /**
     * Return the JavaScript Control for the Dashboard
     *
     * optional
     * @return string
     */
    public function getJavaScriptControl(): string;
}
