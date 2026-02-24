<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_getBlogEntry
 */

use QUI\Cache\Manager;

const CACHE_KEY_PACKAGE_LIST_PREFIX = "dashboard.card.packages.data.";
const PACKAGE_LIST_URL = "https://update.quiqqer.com/packages.json";
const PACKAGE_LIST_LIMIT = 10;

/**
 * @return array
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_getBlogEntry',
    function ($language = 'en') {
        $toTimestamp = static function ($value): int {
            if (empty($value)) {
                return 0;
            }

            $time = strtotime((string)$value);

            if ($time === false) {
                return 0;
            }

            return $time;
        };

        $firstNonEmpty = static function (array $entry, array $keys, string $default = ''): string {
            foreach ($keys as $key) {
                if (!isset($entry[$key])) {
                    continue;
                }

                $raw = $entry[$key];

                if (is_array($raw) || is_object($raw)) {
                    continue;
                }

                $value = trim((string)$raw);

                if ($value !== '') {
                    return $value;
                }
            }

            return $default;
        };

        $extractUrl = static function (array $entry) use ($firstNonEmpty): string {
            $url = $firstNonEmpty($entry, ['homepage', 'url']);

            if ($url !== '') {
                return $url;
            }

            if (isset($entry['support']) && is_array($entry['support'])) {
                $url = $firstNonEmpty($entry['support'], ['source', 'docs', 'issues', 'forum', 'wiki']);

                if ($url !== '') {
                    return $url;
                }
            }

            if (isset($entry['source']) && is_array($entry['source'])) {
                $url = $firstNonEmpty($entry['source'], ['url']);

                if ($url !== '') {
                    return $url;
                }
            }

            $name = isset($entry['name']) ? trim((string)$entry['name']) : '';

            if ($name !== '' && strpos($name, '/') !== false) {
                [$vendor, $package] = explode('/', $name, 2);
                return 'https://dev.quiqqer.com/' . $vendor . '/' . $package;
            }

            return 'https://dev.quiqqer.com/quiqqer';
        };

        $normalize = static function (
            array $entry,
            string $fallbackName = '',
            string $fallbackVersion = ''
        ) use ($toTimestamp, $firstNonEmpty, $extractUrl): ?array {
            $name = $entry['name'] ?? $fallbackName;

            if (empty($name)) {
                return null;
            }

            $timeRaw = $firstNonEmpty($entry, ['time', 'releaseDate', 'date', 'released_at']);
            $version = $firstNonEmpty($entry, ['version', 'pretty_version', 'version_normalized'], $fallbackVersion);
            $description = $firstNonEmpty($entry, ['description', 'summary']);

            return [
                'name' => (string)$name,
                'version' => $version,
                'description' => strip_tags($description),
                'url' => $extractUrl($entry),
                'time' => $timeRaw,
                '_timestamp' => $toTimestamp($timeRaw)
            ];
        };

        $isDevVersion = static function (string $version): bool {
            if ($version === '') {
                return false;
            }

            return stripos($version, 'dev') !== false;
        };

        $normalizeVersionForCompare = static function (string $version): string {
            $version = trim($version);

            if ($version === '') {
                return '0.0.0';
            }

            if ($version[0] === 'v' || $version[0] === 'V') {
                $version = substr($version, 1);
            }

            return $version;
        };

        $isNewer = static function (array $candidate, array $current) use ($normalizeVersionForCompare): bool {
            if ($candidate['_timestamp'] > $current['_timestamp']) {
                return true;
            }

            if ($candidate['_timestamp'] < $current['_timestamp']) {
                return false;
            }

            $candidateVersion = $normalizeVersionForCompare((string)$candidate['version']);
            $currentVersion = $normalizeVersionForCompare((string)$current['version']);

            return version_compare($candidateVersion, $currentVersion, '>');
        };

        $data = null;

        try {
            $data = Manager::get(CACHE_KEY_PACKAGE_LIST_PREFIX . $language);
        } catch (\QUI\Cache\Exception) {
        }

        if (!empty($data)) {
            return $data;
        }

        try {
            $json = QUI\Utils\Request\Url::get(PACKAGE_LIST_URL);
            $payload = json_decode($json, true);
        } catch (Exception $Exception) {
            QUI\System\Log::writeException($Exception);

            return [];
        }

        if (!is_array($payload)) {
            return [];
        }

        $latestPackages = [];
        $packages = $payload['packages'] ?? $payload;

        if (!is_array($packages)) {
            return [];
        }

        foreach ($packages as $key => $value) {
            if (!is_array($value)) {
                continue;
            }

            // Direct package entry
            if (isset($value['name']) || isset($value['version']) || isset($value['pretty_version'])) {
                $normalized = $normalize($value, is_string($key) ? $key : '');

                if ($normalized !== null) {
                    if ($isDevVersion((string)$normalized['version'])) {
                        continue;
                    }

                    $packageName = $normalized['name'];

                    if (
                        !isset($latestPackages[$packageName]) ||
                        $isNewer($normalized, $latestPackages[$packageName])
                    ) {
                        $latestPackages[$packageName] = $normalized;
                    }
                }

                continue;
            }

            // Common package server format: "packages" => [ "vendor/name" => [release1, release2, ...] ] (indexed or assoc)
            $foundReleases = false;
            foreach ($value as $releaseKey => $release) {
                if (!is_array($release)) {
                    continue;
                }

                $foundReleases = true;
                $fallbackVersion = is_string($releaseKey) ? $releaseKey : '';
                $normalized = $normalize($release, is_string($key) ? $key : '', $fallbackVersion);

                if ($normalized === null) {
                    continue;
                }

                if ($isDevVersion((string)$normalized['version'])) {
                    continue;
                }

                $packageName = $normalized['name'];

                if (
                    !isset($latestPackages[$packageName]) ||
                    $isNewer($normalized, $latestPackages[$packageName])
                ) {
                    $latestPackages[$packageName] = $normalized;
                }
            }

            if ($foundReleases) {
                continue;
            }

            // Fallback: try whole value as package object
            $normalized = $normalize($value, is_string($key) ? $key : '');

            if ($normalized !== null) {
                if ($isDevVersion((string)$normalized['version'])) {
                    continue;
                }

                $packageName = $normalized['name'];

                if (
                    !isset($latestPackages[$packageName]) ||
                    $isNewer($normalized, $latestPackages[$packageName])
                ) {
                    $latestPackages[$packageName] = $normalized;
                }
            }
        }

        $data = array_values($latestPackages);

        usort($data, static function (array $a, array $b): int {
            if ($a['_timestamp'] !== $b['_timestamp']) {
                return $b['_timestamp'] <=> $a['_timestamp'];
            }

            return strcmp((string)$a['name'], (string)$b['name']);
        });

        $data = array_slice($data, 0, PACKAGE_LIST_LIMIT);

        foreach ($data as $index => $entry) {
            unset($entry['_timestamp']);
            $data[$index] = $entry;
        }

        // Cache the data for 30 minutes
        Manager::set(
            CACHE_KEY_PACKAGE_LIST_PREFIX . $language,
            $data,
            new DateInterval('PT30M')
        );

        return $data;
    },
    ['language'],
    'Permission::checkAdminUser'
);
