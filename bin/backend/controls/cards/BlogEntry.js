define('package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry', [

    'Ajax',
    'Mustache',
    'Locale',
    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry.css'

], function (QUIAjax, Mustache, QUILocale, QUICard) {
    "use strict";

    const lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type: 'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id: 'quiqqer-dashboard-card-newest-blog-entry',
                content: '',
                priority: 90
            });

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.getElm().classList.add('col-sm-6');
            this.getElm().classList.add('col-lg-6');

            this.setContent(
                '<div class="dashboard-packages" id="dashboard-packages-list"></div>'
            );
        },

        refresh: function () {
            const self = this;
            const Card = self.getElm();
            const formatDate = function (raw) {
                if (!raw) {
                    return '';
                }

                const date = new Date(raw);
                if (isNaN(date.getTime())) {
                    return raw;
                }

                return date.toLocaleString(window.USER.lang || 'en', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                });
            };

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getBlogEntry', function (result) {
                self.setTitle(QUILocale.get(lg, 'dashboard.blogentry.title'));
                self.setIcon('fa fa-cubes');

                Card.removeEvents('click');
                Card.classList.remove('card--clickable');

                self.$Content.removeClass('bad-value');
                self.$Content.setStyles({
                    padding: '',
                    'line-height': ''
                });

                if (!result || !result.length) {
                    self.setTitle(QUILocale.get(lg, 'dashboard.blogentry.title'));
                    self.setContent(QUILocale.get(lg, 'dashboard.blogentry.error.content'));
                    self.setIcon('fa fa-newspaper-o');
                    Card.querySelector('.card-body').style.display = '';

                    self.$Content.setStyles({
                        padding: '0.75rem 1.5rem',
                        'line-height': '2rem'
                    });

                    self.$Content.addClass('bad-value');
                    self.getElm().addEvent('click', function () {
                        window.open(QUILocale.get(lg, 'dashboard.blogentry.error.link'));
                    });

                    return;
                }

                const Content = new Element('div', {
                    'class': 'dashboard-packages'
                });

                self.setTitle(QUILocale.get(lg, 'dashboard.blogentry.releases.title'));

                const List = new Element('ul', {
                    'class': 'dashboard-packages__list'
                }).inject(Content);

                result.forEach(function (entry) {
                    const Item = new Element('li', {
                        'class': 'dashboard-packages__item'
                    }).inject(List);

                    const Link = new Element('a', {
                        'class': 'dashboard-packages__link',
                        href: entry.url || 'https://dev.quiqqer.com/quiqqer',
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    }).inject(Item);

                    const Header = new Element('div', {
                        'class': 'dashboard-packages__header'
                    }).inject(Link);

                    new Element('div', {
                        'class': 'dashboard-packages__name',
                        text: entry.name || ''
                    }).inject(Header);

                    if (entry.version) {
                        new Element('span', {
                            'class': 'dashboard-packages__version',
                            text: entry.version
                        }).inject(Header);
                    }

                    if (entry.description) {
                        new Element('div', {
                            'class': 'dashboard-packages__description',
                            text: entry.description
                        }).inject(Link);
                    }

                    new Element('div', {
                        'class': 'dashboard-packages__meta',
                        text: formatDate(entry.time)
                    }).inject(Link);
                });

                self.setContent('');
                Content.inject(self.$Content);
                
                Card.querySelector('.card-body').style.display = '';
                Card.querySelector('.card-body').style.overflow = 'auto';
            }, {
                'package': 'quiqqer/dashboard',
                onError: console.error,
                language: window.USER.lang
            });
        }
    });
});
