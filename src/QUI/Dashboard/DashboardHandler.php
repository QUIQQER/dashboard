<?php

/**
 * @author PCSG (Jan Wennrich)
 */

namespace QUI\Dashboard;

use QUI;
use QUI\Utils\Text\XML;
use QUI\Utils\Singleton;

/**
 * Class DashboardHandler
 * @package \QUI\Dashboard
 */
class DashboardHandler extends Singleton
{
    const CACHE_KEY_CARD_LIST = 'quiqqer/dashboard/dashboardHandler/cardList';

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

        try {
            $this->cardList = QUI\Cache\Manager::get(self::CACHE_KEY_CARD_LIST);

            return $this->cardList;
        } catch (QUI\Exception $Exception) {
        }

        $result   = [];
        $packages = QUI::getPackageManager()->getInstalled();

        foreach ($packages as $package) {
            try {
                $Package = QUI::getPackage($package['name']);
            } catch (QUI\Exception $Exception) {
                continue;
            }

            $dashboardXML = $Package->getDir() . 'dashboard.xml';

            if (!file_exists($dashboardXML)) {
                continue;
            }

            $Dom  = XML::getDomFromXml($dashboardXML);
            $Path = new \DOMXPath($Dom);

            /** @var \DOMNodeList $Dashboard */
            $Dashboard = $Path->query("//quiqqer/dashboard");

            if (!isset($Dashboard[0])) {
                continue;
            }

            /** @var \DOMElement $Dashboard */
            $Dashboard = $Dashboard[0];

            // Get all direct cards
            $result = array_merge($result, self::getCardsFromNode($Dashboard));

            /** @var \DOMNodeList $childNodes */
            $childNodes = $Dashboard->childNodes;

            // Search for rows
            foreach ($childNodes as $Node) {
                // If the child is not a row , we skip this node
                if ($Node->nodeName != "row") {
                    continue;
                }

                // Add all child-nodes (cards) from this row-node as an array (arrays in the result indicate rows)
                $result[] = self::getCardsFromNode($Node);
            }
        }

        $this->cardList = $result;

        try {
            QUI\Cache\Manager::set(self::CACHE_KEY_CARD_LIST, $result);
        } catch (\Exception $Exception) {
            QUI\System\Log::addError("Something failed while trying to cache the dashboard's card list");
            QUI\System\Log::writeException($Exception);
        }

        return $result;
    }

    protected static function getCardsFromNode($Node)
    {
        $result = [];

        /** @var \DOMNodeList $childNodes */
        $childNodes = $Node->childNodes;

        foreach ($childNodes as $Node) {
            // If the child is not a card (e.g. a row), we skip this node
            if ($Node->nodeName != "card") {
                continue;
            }

            /** @var \DOMElement $Node */
            $require = $Node->getAttribute('require');

            if (empty($require)) {
                continue;
            }

            $result[] = $require;
        }

        return $result;
    }
}
