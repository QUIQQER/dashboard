<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_saas_getUsersRegistrations
 */

/**
 * @return array
 */
QUI::getAjax()->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_saas_getUsersRegistrations',
    function ($interval, $from, $to) {
        if (empty($interval)) {
            $interval = 'days';
        }

        switch ($interval) {
            case 'years':
            case 'months':
            case 'days':
                break;

            default:
                $interval = 'days';
        }

        if (empty($from)) {
            $from = date('Y-m-01');
        }

        if (empty($to)) {
            $to = date('Y-m-01 23:59:59');
        }

        $periodSelect = $interval === 'yearly' ?
            "YEAR(FROM_UNIXTIME(regdate)) AS period" :
            ($interval === 'monthly' ?
                "DATE_FORMAT(FROM_UNIXTIME(regdate), '%Y-%m') AS period" :
                "DATE(FROM_UNIXTIME(regdate)) AS period"
            );

        $fromTimestamp = is_numeric($from) ? (int)$from : strtotime((string)$from);
        $toTimestamp = is_numeric($to) ? (int)$to : strtotime((string)$to);

        if ($fromTimestamp === false) {
            $fromTimestamp = time();
        }

        if ($toTimestamp === false) {
            $toTimestamp = time();
        }

        $qb = QUI::getQueryBuilder();
        $qb->select("$periodSelect, COUNT(*) AS registrations")
            ->from(QUI\Users\Manager::table())
            ->where('regdate >= :from')
            ->andWhere('regdate <= :to')
            ->setParameter('from', $fromTimestamp)
            ->setParameter('to', $toTimestamp)
            ->groupBy('period')
            ->orderBy('period', 'ASC');

        $result = $qb->fetchAllAssociative();

        // Fehlende Zeiträume mit 0 auffüllen
        $allPeriods = [];

        if ($interval === 'days') {
            $current = date('Y-m-d', $fromTimestamp);
            $end = date('Y-m-d', $toTimestamp);
            while ($current <= $end) {
                $allPeriods[$current] = 0;
                $nextTimestamp = strtotime($current . ' +1 day');

                if ($nextTimestamp === false) {
                    break;
                }

                $current = date('Y-m-d', $nextTimestamp);
            }
        } elseif ($interval === 'months') {
            $current = date('Y-m', $fromTimestamp);
            $end = date('Y-m', $toTimestamp);
            while ($current <= $end) {
                $allPeriods[$current] = 0;
                $nextTimestamp = strtotime($current . ' +1 month');

                if ($nextTimestamp === false) {
                    break;
                }

                $current = date('Y-m', $nextTimestamp);
            }
        } elseif ($interval === 'years') {
            $current = date('Y', $fromTimestamp);
            $end = date('Y', $toTimestamp);
            while ($current <= $end) {
                $allPeriods[$current] = 0;
                $current = (string)((int)$current + 1);
            }
        }

        if (!empty($allPeriods)) {
            foreach ($result as $row) {
                $allPeriods[$row['period']] = (int)$row['registrations'];
            }
            $filledResult = [];
            foreach ($allPeriods as $period => $registrations) {
                $filledResult[] = [
                    'period' => $period,
                    'registrations' => $registrations
                ];
            }
            $result = $filledResult;
        }

        return $result;
    },
    ['interval', 'from', 'to'],
    'Permission::checkAdminUser'
);
