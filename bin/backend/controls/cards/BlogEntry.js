/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry', [

    'Ajax',
    'Mustache',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry/content.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry/style.css'

], function (QUIAjax, Mustache, QUICard, content) {
    "use strict";

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-card-newest-blog-entry',
                content: Mustache.render(content),
                size   : 25
            });
        },

        refresh: function () {
            var self = this;
            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getBlogEntry', function (result) {

                var Card = self.getElm();

                Card.getElement('#blog-entry-image').set('src', result.image);
                Card.getElement('#blog-entry-title').set('html', result.title);
                Card.getElement('#blog-entry-text').set('html', result.description);

                self.getElm().addEvent('click', function () {
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