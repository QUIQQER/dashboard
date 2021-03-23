/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry', [

    'Ajax',
    'Mustache',
    'Locale',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry/content.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry/style.css'

], function (QUIAjax, Mustache, QUILocale, QUICard, content) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id      : 'quiqqer-dashboard-card-newest-blog-entry',
                content : Mustache.render(content),
                priority: 85
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
        },

        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getBlogEntry', function (result) {
                if (!result) {
                    self.setTitle(QUILocale.get(lg, 'dashboard.blogentry.title'));
                    self.setContent(QUILocale.get(lg, 'dashboard.blogentry.error.content'));
                    self.setIcon('fa fa-newspaper-o');

                    self.$Content.setStyles({
                        padding      : '0.75rem 1.5rem',
                        'line-height': '2rem'
                    });

                    self.$Content.addClass('bad-value');
                    self.getElm().addEvent('click', function () {
                        window.open(QUILocale.get(lg, 'dashboard.blogentry.error.link'));
                    });

                    return;
                }

                var Card = self.getElm();

                Card.getElement('#blog-entry-image').set('src', result.image);
                Card.getElement('#blog-entry-text').set('html', result.description);

                Card.getElement('#blog-entry-title').set('html', result.title).setStyles({
                    marginTop: 10
                });

                Card.classList.add('card--clickable');
                Card.addEvent('click', function () {
                    window.open(result.link);
                });
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error,
                language : window.USER.lang
            });
        }
    });
});
