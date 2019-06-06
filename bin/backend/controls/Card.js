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
            id     : false,
            icon   : false,
            title  : false,
            content: false,
            footer : false,
            styles : false,
            size   : false
        },

        initialize: function (options) {
            this.parent(options);

            this.$Title = null;
            this.$Icon = null;
            this.$Content = null;
            this.$Footer = null;
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
                      '       <span class="quiqqer-dashboard-card-icon"></span>' +
                      '       <span class="quiqqer-dashboard-card-title"></span>' +
                      '   </header>' +
                      '   <div class="quiqqer-dashboard-card-content"></div>' +
                      '   <div class="quiqqer-dashboard-card-footer"></div>' +
                      '</div>'
            });

            this.$Icon = this.$Elm.getElement('.quiqqer-dashboard-card-icon');
            this.$Title = this.$Elm.getElement('.quiqqer-dashboard-card-title');
            this.$Content = this.$Elm.getElement('.quiqqer-dashboard-card-content');
            this.$Footer = this.$Elm.getElement('.quiqqer-dashboard-card-footer');

            if (this.getAttribute('id') !== false) {
                this.setId(this.getAttribute('id'));
            }

            if (this.getAttribute('title') === false) {
                this.$Title.setStyle('display', 'none');
            } else {
                if (typeof this.getAttribute('title') === 'string') {
                    this.setTitle(this.getAttribute('title'));
                }
            }

            if (this.getAttribute('icon') && (typeof this.getAttribute('content') === 'string')) {
                this.setIcon(this.getAttribute('icon'));
            }

            if (this.getAttribute('content') === false) {
                this.$Content.setStyle('display', 'none');
            } else {
                if (typeof this.getAttribute('content') === 'string') {
                    this.setContent(this.getAttribute('content'));
                }
            }

            if (this.getAttribute('footer') === false) {
                this.$Footer.setStyle('display', 'none');
            } else {
                if (typeof this.getAttribute('footer') === 'string') {
                    this.setFooter(this.getAttribute('footer'));
                }
            }

            if (this.getAttribute('size') !== false) {
                this.setSize(this.getAttribute('size'));
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
         * Returns the element's id
         *
         * @return {string}
         */
        getId: function () {
            return this.getAttribute('id');
        },

        /**
         * Set's the element's id
         *
         * @param {string} id
         */
        setId: function (id) {
            this.$Elm.set('id', id);
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
            this.$Title.setStyle('display', title ? 'inline-block' : 'none');
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
            this.$Content.setStyle('display', content ? 'block' : 'none');
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
            this.$Footer.setStyle('display', footer ? 'block' : 'none');
            this.$Footer.set('html', footer);
        },

        /**
         * Returns the card's size
         *
         * @return {number}
         */
        getSize: function () {
            return this.getAttribute('size');
        },

        /**
         * Sets the card's width (in percent).
         * Should be one of the defined CSS width-classes (see Dashboard.css for all values)
         * Currently there are:
         * 10, 16, 20, 25, 30, 33, 40, 50, 60, 70, 80, 90 and 100
         *
         * @param {number} size
         */
        setSize: function (size) {
            this.setAttribute('size', size);
            this.$Elm.className = this.$Elm.className.replace(/qdc-w\d+/, '');
            this.$Elm.classList.add('qdc-w' + size);
        }
    });
});