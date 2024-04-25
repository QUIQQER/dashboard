<?php

use QUI\Dashboard\DashboardInterface;

define('QUIQQER_SYSTEM', true);

$packagesDir = dirname(__FILE__, 5);

if (!file_exists($packagesDir . '/header.php')) {
    exit;
}

require $packagesDir . '/header.php';

$User = QUI::getUserBySession();

if (!QUI::getUsers()->isAuth($User)) {
    exit;
}

if (!QUI\Permissions\Permission::isAdmin($User)) {
    exit;
}

// get boards
$boards = QUI\Dashboard\DashboardHandler::getInstance()->getBoards();
$Board = null;
$dashboardId = '';

if (isset($_GET['dashboardId']) && $_GET['dashboardId'] !== '') {
    $dashboardId = (int)$_GET['dashboardId'];

    /* @var $Board DashboardInterface */
    if (isset($boards[$dashboardId])) {
        $Board = $boards[$dashboardId];
    }
}


?>
<html lang="en">
<head>
    <title>QUIQQER Dashboard</title>

    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,maximum-scale=1">

    <style>
        * {
            margin: 0;
            padding: 0;
        }

        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, .26);
        }

        ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #BBBBBB;
        }

        ::-moz-placeholder { /* Firefox 19+ */
            color: #BBBBBB;
        }

        :-ms-input-placeholder { /* IE 10+ */
            color: #BBBBBB;
        }

        :-moz-placeholder { /* Firefox 18- */
            color: #BBBBBB;
        }

        .wrapper {
            display: inline-block;
            padding-top: 20px;
            width: 100%;
        }

        body {
            background: #f4f6fa;
        }

        .card {
            position: relative;
        }

        .card--clickable:hover .card {
            background: #dbe7f6;
            border-color: #548ed2;
            cursor: pointer;
            text-decoration: none;
            box-shadow: rgb(35 46 60 / 16%) 0 2px 16px 0;
        }

        .card-table td {
            font-size: 12px;
        }

        .table-hover tr {
            cursor: pointer;
        }

        .wrapper {
            margin-bottom: 20px;
        }

        .quiqqer-dashboard-card-icon {
            float: left;
            margin: .125rem 0;
            line-height: 1.5rem !important;
            padding-right: 0.5rem;
        }

        .loader-container {
            align-items: center;
            background: rgba(255, 255, 255, 0.5);
            display: flex;
            height: 100%;
            justify-content: center;
            position: fixed;
            width: 100%;
            z-index: 1;
        }
    </style>


    <?php
    echo QUI\FontAwesome\EventHandler::fontawesome(false, false); ?>
    <script src="<?php
    echo URL_OPT_DIR; ?>bin/quiqqer-asset/requirejs/requirejs/require.js"></script>
    <script src="<?php
    echo URL_OPT_DIR; ?>bin/qui/qui/lib/mootools-core.js"></script>
    <script src="<?php
    echo URL_OPT_DIR; ?>bin/qui/qui/lib/mootools-more.js"></script>
    <script src="<?php
    echo URL_OPT_DIR; ?>bin/qui/qui/lib/moofx.js"></script>

    <script type="text/javascript">
        /* <![CDATA[ */
        var USER = JSON.parse(JSON.stringify(window.parent.USER));

        var URL_DIR = '<?php echo URL_DIR; ?>',
            URL_BIN_DIR = '<?php echo URL_BIN_DIR; ?>',
            URL_OPT_DIR = '<?php echo URL_OPT_DIR; ?>',
            URL_SYS_DIR = '<?php echo URL_SYS_DIR; ?>',
            LANGUAGE = null;

        // require config
        require.config({
            baseUrl: '<?php echo URL_BIN_DIR; ?>QUI/',
            paths: {
                'package': "<?php echo URL_OPT_DIR; ?>",
                'qui': '<?php echo URL_OPT_DIR; ?>bin/qui/qui',
                'locale': '<?php echo URL_VAR_DIR; ?>locale/bin',
                'Ajax': '<?php echo URL_BIN_DIR; ?>QUI/Ajax',
                'URL_OPT_DIR': "<?php echo URL_OPT_DIR; ?>",
                'URL_BIN_DIR': "<?php echo URL_BIN_DIR; ?>",

                'Mustache': URL_OPT_DIR + 'bin/quiqqer-asset/mustache/mustache/mustache.min',
                'URI': URL_OPT_DIR + 'bin/quiqqer-asset/urijs/urijs/src/URI',
                'IPv6': URL_OPT_DIR + 'bin/quiqqer-asset/urijs/urijs/src/IPv6',
                'punycode': URL_OPT_DIR + 'bin/quiqqer-asset/urijs/urijs/src/punycode',
                'SecondLevelDomains': URL_OPT_DIR + 'bin/quiqqer-asset/urijs/urijs/src/SecondLevelDomains'
            },
            waitSeconds: 0,
            catchError: true,
            map: {
                '*': {
                    'css': '<?php echo URL_OPT_DIR; ?>bin/qui/qui/lib/css.js',
                    'image': '<?php echo URL_OPT_DIR; ?>bin/qui/qui/lib/image.min.js',
                    'text': '<?php echo URL_OPT_DIR; ?>bin/qui/qui/lib/text.min.js'
                }
            }
        });

        <?php

        if (isset($_GET['dashboardId']) && $_GET['dashboardId'] !== '') {
            echo 'window.DASHBOARD_ID = ' . (int)$_GET['dashboardId'] . ';';
        } else {
            echo 'window.DASHBOARD_ID = "";';
        }

        ?>
    </script>

    <!-- require js -->
    <!-- mootools -->

</head>
<body class="antialiased"
    <?php

    if ($Board && $Board->getJavaScriptControl() && $Board->getJavaScriptControl() !== '') {
        echo ' data-qui="' . $Board->getJavaScriptControl() . '"';
    }

    ?>
>

<div class="loader-container">
    <div class="loader"></div>
</div>

<div class="wrapper" style="opacity: 0">
    <div class="page-wrapper">
        <div class="container-xl">
            <!-- Page title -->
            <div class="page-header d-print-none">
                <div class="row align-items-center">
                    <div class="col">
                        <?php
                        if (!empty($boards)) { ?>
                            <div class="dashboard-select dropdown position-relative"
                                 style="float: left; height: 40px; margin-right: 10px; display: flex;"
                            >
                                <div class="btn btn-ghost-dark btn-sm dropdown-toggle"></div>
                                <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-card position-absolute"
                                     style="margin-top: 10px !important;"
                                >
                                    <label class="dropdown-item">
                                        <input type="radio"
                                               class="form-check-input m-0 me-2"
                                               name="dashboard"
                                               value=""
                                            <?php
                                            echo $Board === null ? 'checked' : ''; ?>
                                        />
                                        QUIQQER Dashboard
                                    </label>
                                    <?php
                                    foreach ($boards as $key => $B) { ?>
                                        <label class="dropdown-item">
                                            <input type="radio"
                                                   class="form-check-input m-0 me-2"
                                                   name="dashboard"
                                                   value="<?php echo $key; ?>"
                                                <?php
                                                echo $Board === $B ? 'checked' : ''; ?>
                                            />
                                            <?php
                                            echo $B->getTitle(); ?>
                                        </label>
                                    <?php } ?>
                                </div>
                            </div>
                        <?php } ?>

                        <!-- Page pre-title -->
                        <div class="page-pretitle">
                            Overview
                        </div>
                        <h2 class="page-title">
                            <?php
                            if ($Board) {
                                echo $Board->getTitle();
                            } else {
                                echo 'QUIQQER Dashboard';
                            }
                            ?>
                        </h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-body">
            <div class="container-xl">
                <div class="row row-deck row-cards"></div>
            </div>
        </div>
    </div>
</div>

<script>
    (function() {
        var get = [];

        location.search.substr(1).split('&').forEach(function(item) {
            var p = item.split('=');
            get[p[0]] = decodeURIComponent(p[1]);
        });

        if (typeof get.instance === 'undefined') {
            return;
        }

        if (typeof window.parent.URL_OPT_DIR === 'undefined') {
            return;
        }

        var URL_OPT_DIR = window.parent.URL_OPT_DIR;
        var path = URL_OPT_DIR + 'quiqqer/dashboard/';

        var Link = document.createElement('link');
        Link.href = path + 'bin/backend/tabler/tabler.min.css';
        Link.rel = 'stylesheet';
        document.head.appendChild(Link);


        var requireList = [
            'qui/QUI',
            'Locale',
            'Ajax',
            'Projects',
            'controls/workspace/Manager',
            'qui/controls/buttons/Button',
            'qui/controls/contextmenu/Item',
            'qui/controls/contextmenu/Separator'
        ].append(window.parent.QUIQQER_LOCALE || []);

        if (typeof window.Intl === 'undefined') {
            console.error('Intl is not supported');
        }

        require(requireList, function() {
            arguments[1].setCurrent(USER.lang);

            // workaround, because the QUI framework has sometimes its own Locale :-/
            require(['qui/Locale'], function(QUIsOwnLocale) {
                QUIsOwnLocale.setCurrent(USER.lang);
            });

            require([
                'qui/QUI',
                'package/quiqqer/dashboard/bin/backend/controls/Dashboard'
            ], function(QUI, Dashboard) {
                var Deck = document.body.querySelector('.row-deck');
                var Instance = new Dashboard();

                if (window.DASHBOARD_ID === '') {
                    window.DASHBOARD_ID = QUI.Storage.get('quiqqer-dashboard-id');

                    if (window.DASHBOARD_ID === false || window.DASHBOARD_ID === '' || window.DASHBOARD_ID === null) {
                        window.DASHBOARD_ID = '';
                    } else {
                        // load dashboard
                        require(['qui/QUI', 'URI'], function(QUI, URI) {
                            var Url = URI(window.location),
                                search = Url.search(true);

                            search.dashboardId = window.DASHBOARD_ID;

                            var current = window.location.pathname + window.location.search;
                            var wanted = window.location.pathname + '?' + Object.toQueryString(search);

                            if (current !== wanted) {
                                window.location = wanted;
                            }
                        });

                        return;
                    }
                }

                var loadCustomBoard = Promise.resolve();
                var CustomDashboardInstance = null;

                if (document.body.get('data-qui')) {
                    loadCustomBoard = new Promise(function(resolve) {
                        require([document.body.get('data-qui')], function(cls) {
                            new cls().imports(document.body);

                            resolve();
                        }, function(err) {
                            console.error(err);
                            resolve();
                        });
                    });
                }

                loadCustomBoard.then(function() {
                    Instance.setAttribute('dashboardId', window.DASHBOARD_ID);

                    return Instance.refresh();
                }).then(function(cards) {
                    Deck.innerHTML = '';

                    for (var i = 0, len = cards.length; i < len; i++) {
                        cards[i].inject(Deck);
                    }

                    var Loader = document.querySelector('.loader-container'),
                        Wrapper = document.querySelector('.wrapper');

                    moofx(Wrapper).animate({
                        opacity: 1
                    });

                    moofx(Loader).animate({
                        opacity: 0
                    }, {
                        callback: function() {
                            Loader.parentNode.removeChild(Loader);
                        }
                    });
                });
            });
        });

        // dashboard select
        var Select = document.querySelector('.dashboard-select');
        var DropDown = document.querySelector('.dropdown-menu');
        var Values = document.querySelectorAll('[name="dashboard"]');

        var onChange = function() {
            require(['qui/QUI', 'URI'], function(QUI, URI) {
                var Url = URI(window.location),
                    search = Url.search(true);

                search.dashboardId = Select.querySelector('input:checked').value;
                QUI.Storage.set('quiqqer-dashboard-id', search.dashboardId);

                window.location = window.location.pathname + '?' + Object.toQueryString(search);
            });
        };

        if (Select) {
            Select.tabIndex = '-1';

            Select.addEventListener('focus', function() {
                DropDown.classList.add('show');
            });

            Select.addEventListener('blur', function() {
                DropDown.classList.remove('show');
            });
        }

        Values.forEach(function(Value) {
            Value.addEventListener('change', onChange);
        });
    })();
</script>

</body>
</html>
