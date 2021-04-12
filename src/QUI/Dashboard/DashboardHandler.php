<?php

/**
 * @author PCSG (Jan Wennrich)
 */

namespace QUI\Dashboard;

use QUI;
use QUI\Utils\Singleton;

/**
 * Class DashboardHandler
 *
 * @package \QUI\Dashboard
 */
class DashboardHandler extends Singleton
{
    const CACHE_KEY_DASHBOARD_PROVIDERS = 'quiqqer/dashboard/dashboardHandler/cardProviders';

    const PROVIDER_KEY = 'dashboard';

    /**
     * @var array
     */
    protected $cardList = [];

    /**
     * Returns the cards for the current user's dashboard.
     * Only returns his enabled cards.
     *
     * The result is an array:
     * The card's name is the key.
     * The value is an array containing the card's priority and it's enabled-state (always true).
     *
     * @return array
     */
    public function getCardsForUsersDashboard(): array
    {
        $cards = $this->getCardsWithSettings();
        $cards = \array_filter($cards, function ($card) {
            return $card['enabled'];
        });

        return $cards;
    }

    /**
     * @param $dashboardId
     * @return array
     */
    public function getCardsFromBoard($dashboardId): array
    {
        $boards = QUI\Dashboard\DashboardHandler::getInstance()->getBoards();

        if (!isset($boards[$dashboardId])) {
            return [];
        }

        $Board = $boards[$dashboardId];

        return $Board->getCards();
    }

    /**
     * Return all dashboard provider
     *
     * @return DashboardProviderInterface[]
     */
    protected function getProvider(): array
    {
        try {
            $dashboardProviders = QUI\Cache\Manager::get(self::CACHE_KEY_DASHBOARD_PROVIDERS);
        } catch (QUI\Cache\Exception $Exception) {
            $packages           = QUI::getPackageManager()->getInstalled();
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
                    if (!\class_exists($dashboardProvider)) {
                        continue;
                    }
                }

                // Add the packages dashboard providers to all providers
                $dashboardProviders = \array_merge($dashboardProviders, $packagesDashboardProviders);
            }

            try {
                QUI\Cache\Manager::set(self::CACHE_KEY_DASHBOARD_PROVIDERS, $dashboardProviders);
            } catch (\Exception $Exception) {
                QUI\System\Log::writeDebugException($Exception);
            }
        }

        // initialize the instances
        $provider = [];

        foreach ($dashboardProviders as $dashboardProvider) {
            try {
                /** @var DashboardProviderInterface $Provider */
                $Provider = new $dashboardProvider();

                if ($Provider instanceof DashboardProviderInterface) {
                    $provider[] = $Provider;
                }
            } catch (\Exception $Exception) {
                QUI\System\Log::writeException($Exception);
            }
        }

        return $provider;
    }

    /**
     * Returns all cards in the system.
     * The array might contain further arrays. These arrays indicate rows.
     *
     * @return array
     */
    public function getAllRegisteredCards(): array
    {
        if (!empty($this->cardList)) {
            return $this->cardList;
        }

        $cards    = [];
        $provider = $this->getProvider();

        // initialize the instances
        foreach ($provider as $Provider) {
            $cards = \array_merge($Provider->getCards(), $cards);
        }

        $this->cardList = $cards;

        return $cards;
    }

    /**
     * Return all available boards
     *
     * @return array
     */
    public function getBoards(): array
    {
        $boards   = [];
        $provider = $this->getProvider();

        foreach ($provider as $Provider) {
            $boards = \array_merge($Provider->getBoards(), $boards);
        }

        return $boards;
    }

    /**
     * @return array
     */
    public function getCardsWithSettings(): array
    {
        $cards    = $this->getAllRegisteredCards();
        $settings = [];

        $cardSettingsAttribute = QUI::getUserBySession()->getAttribute('quiqqer.dashboard.cardSettings');

        if ($cardSettingsAttribute) {
            $settings = \json_decode($cardSettingsAttribute, true);
        }

        $result = [];

        // Combine all available cards and their settings
        foreach ($cards as $card) {
            // Default values
            $values = [
                'enabled'  => true,
                'priority' => null
            ];

            // There may be no settings for a card yet, but if so, use them
            if (isset($settings[$card])) {
                $cardSettings = $settings[$card];

                if (isset($cardSettings['enabled'])) {
                    $values['enabled'] = $cardSettings['enabled'];
                }

                if (isset($cardSettings['priority']) && \is_numeric($cardSettings['priority'])) {
                    $values['priority'] = (int)$cardSettings['priority'];
                }
            }

            $result[$card] = $values;
        }

        return $result;
    }
}
