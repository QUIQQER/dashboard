<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_saas_getOrdersCount
 */

/**
 * @return int|string
 */
QUI::getAjax()->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_saas_getOrdersCount',
    function ($interval, $from, $to) {
        if (!class_exists('QUI\ERP\Order\Handler')) {
            return '-';
        }

        if (empty($from)) {
            $from = date('Y-m-01');
        }

        if (empty($to)) {
            $to = date('Y-m-01 23:59:59');
        }

        $fromTimestamp = is_numeric($from) ? (int)$from : strtotime((string)$from);
        $toTimestamp = is_numeric($to) ? (int)$to : strtotime((string)$to);

        if ($fromTimestamp === false) {
            $fromTimestamp = time();
        }

        if ($toTimestamp === false) {
            $toTimestamp = time();
        }

        $from = date('Y-m-d H:i:s', $fromTimestamp);
        $to = date('Y-m-d H:i:s', $toTimestamp);

        $qb = QUI::getQueryBuilder();
        $qb->select('COUNT(*) AS orders')
            ->from(QUI\ERP\Order\Handler::getInstance()->table())
            ->where('c_date >= :from')
            ->andWhere('c_date <= :to')
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        return $qb->fetchOne();
    },
    ['interval', 'from', 'to'],
    'Permission::checkAdminUser'
);
