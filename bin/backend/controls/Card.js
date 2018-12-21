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
            icon: false,
            title : false,
            content: false,
            footer: false,
            styles: false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Title   = null;
            this.$Icon    = null;
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
                    '   <header class="quiqqer-dashboard-card-header">' +
                    '       <span class="quiqqer-dashboard-card-icon"></span>'  +
                    '       <span class="quiqqer-dashboard-card-title"></span>' +
                    '   </header>' +
                    '   <div class="quiqqer-dashboard-card-content"></div>' +
                    '   <div class="quiqqer-dashboard-card-footer"></div>'  +
                    '</div>'
            });

            this.$Icon    = this.$Elm.getElement('.quiqqer-dashboard-card-icon');
            this.$Title   = this.$Elm.getElement('.quiqqer-dashboard-card-title');
            this.$Content = this.$Elm.getElement('.quiqqer-dashboard-card-content');
            this.$Footer  = this.$Elm.getElement('.quiqqer-dashboard-card-footer');

            if (this.getAttribute('title') === false) {
                this.$Title.setStyle('display', 'none');
            } else if (typeof this.getAttribute('title') === 'string') {
                this.setTitle(this.getAttribute('title'));
            }

            if (this.getAttribute('icon') && (typeof this.getAttribute('content') === 'string')) {
                this.setIcon(this.getAttribute('icon'));
            }

            if (this.getAttribute('content') === false) {
                this.$Content.setStyle('display', 'none');
            } else if (typeof this.getAttribute('content') === 'string') {
                this.setContent(this.getAttribute('content'));
            }

            if (this.getAttribute('footer') === false) {
                this.$Footer.setStyle('display', 'none');
            } else if (typeof this.getAttribute('footer') === 'string') {
                this.setFooter(this.getAttribute('footer'));
            }

            if (this.getAttribute('styles')) {
                this.$Elm.setStyles(this.getAttribute('styles'));
            }

            this.fireEvent('create', [this]);

            this.refresh();

            return this.$Elm;
        },

        /**
         * Refreshes the cards content
         */
        refresh: function () {
            // Should be overwritten by inheriting class
        },

        /**
         * Return the title
         *
         * @return {HTMLSpanElement}
         */
        getTitle: function () {
            return this.$Title;
        },

        /**
         * Set's the card's title
         *
         * @param {string} title
         */
        setTitle: function (title) {
            this.$Title.set('html', title);
        },

        /**
         * Returns the icon
         *
         * @return {string}
         */
        getIcon: function () {
            return this.$Icon.classList.toString().replace('quiqqer-dashboard-card-icon', '');
        },

        /**
         * Set's the card's icon
         *
         * @param {string} icon
         */
        setIcon: function (icon) {
            this.$Icon.className = 'quiqqer-dashboard-card-icon ' + icon;
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
         * Sets the card's content
         *
         * @param {string} content
         */
        setContent: function (content) {
            this.$Content.set('html', content);
        },

        /**
         * Return the title
         *
         * @return {HTMLDivElement}
         */
        getFooter: function () {
            return this.$Footer;
        },

        /**
         * Sets the card's footer
         *
         * @param {string} footer
         */
        setFooter: function (footer) {
            this.$Footer.set('html', footer);
        }
    });
});