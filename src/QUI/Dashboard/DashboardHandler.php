<?php

/**
 * @author PCSG (Jan Wennrich)
 */

namespace QUI\Dashboard;

use QUI;
use QUI\Utils\Singleton;

/**
 * Class DashboardHandler
 * @package \QUI\Dashboard
 */
class DashboardHandler extends Singleton
{
    const CACHE_KEY_DASHBOARD_PROVIDERS = 'quiqqer/dashboard/dashboardHandler/cardProviders';

    const PROVIDER_KEY = 'dashboard';

    /**
     * @var array
     */
    protected $cardList = array();


    /**
     * Returns all cards in the system.
     * The array might contain further arrays. These arrays indicate rows.
     *
     * @return array
     */
    public function getCards()
    {
        if (!empty($this->cardList)) {
            return $this->cardList;
        }

        $packages = QUI::getPackageManager()->getInstalled();
        $cards    = [];

        try {
            $dashboardProviders = QUI\Cache\Manager::get(self::CACHE_KEY_DASHBOARD_PROVIDERS);
        } catch (QUI\Cache\Exception $Exception) {
            $dashboardProviders = [];

            /* @var QUI\Package\Package $Package */
            foreach ($packages as $package) {
                try {
                    $Package = QUI::getPackage($package['name']);
                } catch (QUI\Exception $Exception) {
                    QUI\System\Log::writeException($Exception);
                    continue;
                }

                // Get all providers of this package
                $packagesDashboardProviders = $Package->getProvider(self::PROVIDER_KEY);

                // Check if the specified classes really exist
                foreach ($packagesDashboardProviders as $dashboardProvider) {
                    if (!class_exists($dashboardProvider)) {
                        continue;
                    }
                }

                // Add the packages dashboard providers to all providers
                $dashboardProviders = array_merge($dashboardProviders, $packagesDashboardProviders);
            }

            try {
                // Cache the providers
                QUI\Cache\Manager::set(self::CACHE_KEY_DASHBOARD_PROVIDERS, $dashboardProviders);
            } catch (\Exception $Exception) {
                QUI\System\Log::writeDebugException($Exception);
            }
        }

        // initialize the instances
        foreach ($dashboardProviders as $dashboardProvider) {
            try {
                /** @var DashboardProviderInterface $Provider */
                $Provider = new $dashboardProvider();

                // Check if the given provider is really a DashboardProvider
                if (!($Provider instanceof DashboardProviderInterface)) {
                    unset($Provider);
                    continue;
                }

                // Add the providers' cards to the methods' result
                $cards = array_merge($Provider->getCards(), $cards);
            } catch (\Exception $Exception) {
                QUI\System\Log::writeException($Exception);
            }
        }

        return $cards;
    }
}
