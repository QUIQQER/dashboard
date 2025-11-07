<?php

/**
 * This file contains package_quiqqer_dashboard_ajax_backend_saas_getOrdersStats
 */

/**
 * @return int|string
 */
QUI::$Ajax->registerFunction(
    'package_quiqqer_dashboard_ajax_backend_saas_getOrdersStats',
    function ($interval, $from, $to) {
        if (!class_exists('QUI\ERP\Order\Handler')) {
            return '-';
        }

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

        if (!is_numeric($from)) {
            $from = strtotime($from);
        }

        if (!is_numeric($to)) {
            $to = strtotime($to);
        }

        $from = date('Y-m-d H:i:s', $from);
        $to = date('Y-m-d H:i:s', $to);

        switch ($interval) {
            case 'years':
                $format = '%Y-%m';
                $phpFormat = 'Y-m';
                $modify = '1 month';
                break;

            case 'months':
            case 'days':
            default:
                $format = '%Y-%m-%d';
                $phpFormat = 'Y-m-d';
                $modify = '1 day';
                break;
        }

        // Query anpassen
        $qb = QUI::getQueryBuilder();
        $qb->select("DATE_FORMAT(c_date, '$format') AS period, payment_id, c_date")
            ->from(QUI\ERP\Order\Handler::getInstance()->table())
            ->where('c_date >= :from')
            ->andWhere('c_date <= :to')
            ->setParameter('from', $from)
            ->setParameter('to', $to);

        $orders = $qb->fetchAllAssociative();
        $Payments = QUI\ERP\Accounting\Payments\Payments::getInstance();
        $paymentResult = [];

        $result = [
            'count' => count($orders),
            'counting' => [],
            'payments' => $paymentResult
        ];

        // Ergebnis aufbauen
        foreach ($orders as $order) {
            // order counting
            $result['counting'][$order['period']] = ($result['counting'][$order['period']] ?? 0) + 1;

            // payment stats
            $paymentId = $order['payment_id'];

            try {
                $payment = $Payments->getPayment((int)$paymentId);
                $paymentType = $payment->getPaymentType()->getClass();
                $paymentType = strtolower($paymentType);

                if (!isset($paymentResult[$paymentType])) {
                    $icon = 'fa fa-money';

                    if (str_contains($paymentType, 'paypal')) {
                        $icon = 'fa fa-brands fa-paypal';
                    }

                    if (str_contains($paymentType, 'invoice')) {
                        $icon = 'fa fa-file-lines';
                    }

                    if (str_contains($paymentType, 'stripe')) {
                        $icon = 'fa fa-brands fa-stripe';
                    }

                    if (str_contains($paymentType, 'applepay')) {
                        $icon = 'fa fa-brands fa-apple-pay';
                    }

                    if (str_contains($paymentType, 'googlepay')) {
                        $icon = 'fa fa-brands fa-google-pay';
                    }

                    if (str_contains($paymentType, 'microsoftpay')) {
                        $icon = 'fa fa-brands fa-microsof';
                    }

                    $paymentResult[$paymentType] = [
                        'count' => 0,
                        'icon' => $icon,
                        'title' => $payment->getPaymentType()->getTitle()
                    ];
                }

                $paymentResult[$paymentType]['count']++;
            } catch (\Exception) {
            }
        }

        $result['payments'] = $paymentResult;

        // Fehlende Perioden auffüllen
        $periodStart = new DateTime(date($phpFormat, is_numeric($from) ? $from : strtotime($from)));
        $periodEnd = new DateTime(date($phpFormat, is_numeric($to) ? $to : strtotime($to)));
        $periodEnd->modify("+1 $modify"); // Enddatum inklusiv

        for ($dt = clone $periodStart; $dt < $periodEnd; $dt->modify($modify)) {
            $periodStr = $dt->format($phpFormat);
            if (!isset($result['counting'][$periodStr])) {
                $result['counting'][$periodStr] = 0;
            }
        }

        ksort($result['counting']);

        return $result;
    },
    ['interval', 'from', 'to'],
    'Permission::checkAdminUser'
);
