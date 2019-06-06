<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getBlogEntry
 */

const CACHE_KEY_BLOG_ENTRY_PREFIX = "dashboard.card.blogentry.data.";

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getBlogEntry',
    function ($language) {
        switch ($language) {
            case 'de':
                $url = 'https://www.quiqqer.com/feed=4.xml';
                break;

            default:
                $language = 'en';
                $url      = 'https://www.quiqqer.com/feed=3.xml';
        }

        $data = [];
        try {
            $data = \QUI\Cache\Manager::get(CACHE_KEY_BLOG_ENTRY_PREFIX . $language);
        } catch (\QUI\Cache\Exception $Exception) {
        }

        if (!empty($data)) {
            return $data;
        }

        try {
            $rss = QUI\Utils\Request\Url::get($url);

            $Dom = new \DOMDocument();
            $Dom->loadXML($rss);
        } catch (\Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            return [];
        }

        $Path  = new \DOMXPath($Dom);
        $Items = $Path->query('//rss/channel/item');
        $Item  = $Items->item(0);

        if (is_null($Item)) {
            return [];
        }

        $data = [
            'link'        => $Item->getElementsByTagName('link')->item(0)->nodeValue,
            'date'        => $Item->getElementsByTagName('pubDate')->item(0)->nodeValue,
            'title'       => $Item->getElementsByTagName('title')->item(0)->nodeValue,
            'description' => $Item->getElementsByTagName('description')->item(0)->nodeValue,
            'image'       => $Item->getElementsByTagName('enclosure')->item(0)->getAttribute('url')
        ];

        // Cache the data for 30 minutes
        \QUI\Cache\Manager::set(
            CACHE_KEY_BLOG_ENTRY_PREFIX . $language,
            $data,
            new DateInterval('PT30M')
        );

        return $data;
    },
    ['language'],
    'Permission::checkAdminUser'
);
