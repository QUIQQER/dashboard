<?php

namespace QUI\Dashboard;

use QUI\Locale;

/**
 * Interface DashboardInterface
 */
interface DashboardInterface
{
    /**
     * @param null|Locale $Locale
     * @return string
     */
    public function getTitle(?Locale $Locale = null): string;

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
