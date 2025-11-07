<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_saas_getUsersCount
 */

/**
 * @return int
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_saas_getUsersCount',
    function ($interval, $from, $to) {
        if (empty($from)) {
            $from = date('Y-m-01');
        }

        if (empty($to)) {
            $to = date('Y-m-01 23:59:59');
        }

        if (!is_numeric($from)) {
            $from = strtotime($from);
        }

        if (!is_numeric($to)) {
            $to = strtotime($to);
        }

        $qb = QUI::getQueryBuilder();
        $qb->select('COUNT(*) AS registrations')
            ->from(QUI\Users\Manager::table())
            ->where('regdate >= :from')
            ->andWhere('regdate <= :to')
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        $result = $qb->fetchOne();

        return $result;
    },
    ['interval', 'from', 'to'],
    'Permission::checkAdminUser'
);
