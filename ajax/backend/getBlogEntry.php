<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getBlogEntry
 */

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getBlogEntry',
    function () {
        $rss = QUI\Utils\Request\Url::get('https://www.quiqqer.com/feed=3.xml');

        try {
            $Dom = new \DOMDocument();
            $Dom->loadXML($rss);
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            return [];
        }

        $Path  = new \DOMXPath($Dom);
        $Items = $Path->query('//rss/channel/item');
        $Item  = $Items->item(0);

        return [
            'link'        => $Item->getElementsByTagName('link')->item(0)->nodeValue,
            'date'        => $Item->getElementsByTagName('pubDate')->item(0)->nodeValue,
            'title'       => $Item->getElementsByTagName('title')->item(0)->nodeValue,
            'description' => $Item->getElementsByTagName('description')->item(0)->nodeValue,
            'image'       => $Item->getElementsByTagName('enclosure')->item(0)->getAttribute('url')
        ];
    },
    false,
    'Permission::checkAdminUser'
);
