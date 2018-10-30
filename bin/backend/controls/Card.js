/**
 * @module package/quiqqer/dashboard/bin/backend/controls/Card
 * @author www.pcsg.de (Henning Leutz)
 *
 * @event onCreate [self]
 */
define('package/quiqqer/dashboard/bin/backend/controls/Card', [

    'qui/QUI',
    'qui/controls/Control',

    'css!package/quiqqer/dashboard/bin/backend/controls/Card.css'

], function (QUI, QUIControl) {
    "use strict";

    return new Class({

        Extends: QUIControl,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/Dashboard',

        options: {
            title : false,
            footer: false,
            styles: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Title   = null;
            this.$Content = null;
            this.$Footer  = null;
        },

        /**
         * Create the DOMNode element
         */
        create: function () {
            this.$Elm = new Element('section');

            this.$Elm.addClass('quiqqer-dashboard-card');
            this.$Elm.set({
                html: '<div class="quiqqer-dashboard-card-container">' +
                    '   <header class="quiqqer-dashboard-card-title"></header>' +
                    '   <div class="quiqqer-dashboard-card-content"></div>' +
                    '   <div class="quiqqer-dashboard-card-footer"></div>' +
                    '</div>'
            });

            this.$Title   = this.$Elm.getElement('.quiqqer-dashboard-card-title');
            this.$Content = this.$Elm.getElement('.quiqqer-dashboard-card-content');
            this.$Footer  = this.$Elm.getElement('.quiqqer-dashboard-card-footer');

            if (this.getAttribute('title') === false) {
                this.$Title.setStyle('display', 'none');
            } else if (typeof this.getAttribute('title') === 'string') {
                this.$Title.set('html', this.getAttribute('title'));
            }

            if (this.getAttribute('footer') === false) {
                this.$Footer.setStyle('display', 'none');
            } else if (typeof this.getAttribute('footer') === 'string') {
                this.$Footer.set('html', this.getAttribute('footer'));
            }

            if (this.getAttribute('styles')) {
                this.$Elm.setStyles(this.getAttribute('styles'));
            }

            this.fireEvent('create', [this]);

            return this.$Elm;
        },

        /**
         * Return the title
         *
         * @return {HTMLHeadElement}
         */
        getTitle: function () {
            return this.$Title;
        },

        /**
         * Return the content
         *
         * @return {HTMLDivElement}
         */
        getContent: function () {
            return this.$Content;
        },

        /**
         * Return the title
         *
         * @return {HTMLDivElement}
         */
        getFooter: function () {
            return this.$Footer;
        }
    });
});