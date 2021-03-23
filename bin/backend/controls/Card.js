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
            id      : false,
            icon    : false,
            title   : false,
            content : false,
            footer  : false,
            styles  : false,
            size    : false,
            priority: 10
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
            this.$Elm = new Element('div');

            //this.$Elm.addClass('quiqqer-dashboard-card');
            //this.$Elm.addClass('card');
            //this.$Elm.addClass('col-sm-6');
            //this.$Elm.addClass('col-lg-3');

            this.$Elm.set({
                html: '' +
                    '<div class="card">' +
                    '   <header class="card-header">' +
                    '       <span class="card-icon"></span>' +
                    '       <span class="card-title"></span>' +
                    '   </header>' +
                    '   <div class="card-body"></div>' +
                    '   <div class="card-footer"></div>' +
                    '</div>'
            });

            this.$Icon    = this.$Elm.getElement('.card-icon');
            this.$Title   = this.$Elm.getElement('.card-title');
            this.$Content = this.$Elm.getElement('.card-body');
            this.$Header  = this.$Elm.getElement('.card-header');
            this.$Footer  = this.$Elm.getElement('.card-footer');


            if (this.getAttribute('id') !== false) {
                this.setId(this.getAttribute('id'));
            }

            if (this.getAttribute('title') === false) {
                this.$Header.setStyle('display', 'none');
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
            this.$Header.setStyle('display', title ? 'inline-block' : 'none');
            this.$Title.set('html', title);
        },

        /**
         * Returns the icon
         *
         * @return {string}
         */
        getIcon: function () {
            return this.getAttribute('icon');
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
         * Should be a multiple of five (e.g. 5, 25, 30, ...).
         *
         * @param {number} size
         */
        setSize: function (size) {
            //this.setAttribute('size', size);
            //this.$Elm.style['flex-basis'] = size + '%';
        },

        /**
         * Returns the card's priority
         *
         * @return {number}
         */
        getPriority: function () {
            return this.getAttribute('priority');
        },

        /**
         * Sets the card's priority
         *
         * @param {number} priority
         */
        setPriority: function (priority) {
            if (typeof priority === 'number') {
                this.setAttribute('priority', priority);
            }
        }
    });
});
