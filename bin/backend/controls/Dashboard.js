/**
 * @module package/quiqqer/dashboard/bin/backend/controls/Dashboard
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/Dashboard', [

    'qui/controls/desktop/Panel',

    'Mustache',

    'text!package/quiqqer/dashboard/bin/backend/controls/Dashboard.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/Dashboard.css'

], function (QUIPanel, Mustache, template) {
    "use strict";

    return new Class({

        Extends: QUIPanel,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/Dashboard',

        Binds: [
            '$onCreate'
        ],

        initialize: function (options) {
            this.parent(options);

            this.setAttribute('icon', URL_BIN_DIR + '16x16/quiqqer.png');
            this.setAttribute('dragable', false);
            this.setAttribute('displayNoTaskText', true);

            this.addEvents({
                onCreate: this.$onCreate
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            var self = this;

            this.getElm().addClass('quiqqer-dashboard');
            this.getContent().addClass('quiqqer-dashboard-cards');
            this.getContent().addClass('quiqqer-dashboard--loading');

            this.getContent().set('html', Mustache.render(template));

            [
                'package/quiqqer/dashboard/bin/backend/controls/cards/LatestLogins',
                'package/quiqqer/dashboard/bin/backend/controls/cards/BlogEntry',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Links',

                'package/quiqqer/dashboard/bin/backend/controls/cards/MediaInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/SystemInfo',

                'package/quiqqer/dashboard/bin/backend/controls/cards/FilesystemInfo',
                'package/quiqqer/dashboard/bin/backend/controls/cards/SiteActivity',
                'package/quiqqer/dashboard/bin/backend/controls/cards/CronHistory'
            ].forEach(function (card) {
                self.addCardByString(card);
            });

            var smallCards = [
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Projects',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Pages',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Users',
                'package/quiqqer/dashboard/bin/backend/controls/cards/Stats/Groups'
            ];


            // Add all small cards to their own row
            // This is not very nice, but it does it's job
            var RowForSmallCards = this.createRow();
            this.addRow(RowForSmallCards);
            smallCards.forEach(function (card) {
                self.addCardByString(card, RowForSmallCards);
            });
            // Set the space left to zero, so no other cards get placed in this row
            RowForSmallCards.setProperty('data-space-left', 0);

            Promise.all([]).then(function () {
                var Loader = this.getElm().getElement('.quiqqer-dashboard-loader');

                this.getContent().removeClass('quiqqer-dashboard--loading');

                moofx(Loader).animate({
                    opacity: 0
                }, {
                    callback: function () {
                        Loader.destroy();
                    }
                });
            }.bind(this));
        },

        /**
         * Adds a card to the Dashboard.
         * Expects a instantiated Card-element.
         *
         * Optionally a Row-element can be passed as a second argument.
         * If a Row is passed the card is injected into it.
         *
         * @param {Element} Card - Card-element
         * @param {Element} [Row] - Row to inject the card into
         */
        addCard: function (Card, Row) {
            if (Row === undefined) {
                Row = this.getRowWithFreeSpace(Card.getSize());
            }

            Card.inject(Row);
        },

        /**
         * Adds a card from a given Card-control name to the Dashboard.
         *
         * Optionally a Row-element can be passed as a second argument.
         * If a Row is passed the card is injected into it.
         *
         * @param {string} cardString
         * @param {Element} [Row] - Row to inject the card into
         */
        addCardByString: function (cardString, Row) {
            var self = this;
            require([cardString], function (Card) {
                self.addCard((new Card()), Row);
            });
        },

        /**
         * Adds a whole Row-element to the end of the dashboard.
         * You can use createRow() to get such an element.
         *
         * @param {Element} Row
         */
        addRow: function (Row) {
            Row.inject(this.getContent(), 'bottom');
        },

        /**
         * Returns a standardized Row-element.
         * @example Can be used by addRow()
         *
         * @return {Element}
         */
        createRow: function () {
            return (new Element('div', {
                'class'          : 'quiqqer-dashboard-row',
                'data-space-left': 100
            }));
        },

        /**
         * Returns a Dashboard-row that has the given amount of space left.
         * @param {number} requiredSpace
         *
         * @return {Element}
         */
        getRowWithFreeSpace: function (requiredSpace) {

            var Rows = this.getContent().getElements('.quiqqer-dashboard-row');

            var RowWithFreeSpace = null;

            Rows.some(function (Row) {
                var spaceLeftInRow = Row.getProperty('data-space-left') - requiredSpace;

                if (spaceLeftInRow >= 0) {
                    RowWithFreeSpace = Row;
                }
            });

            if (RowWithFreeSpace === null) {
                RowWithFreeSpace = this.createRow();
                this.addRow(RowWithFreeSpace);
            }

            RowWithFreeSpace.setProperty('data-space-left', RowWithFreeSpace.getProperty('data-space-left') - requiredSpace);

            return RowWithFreeSpace;
        }
    });
});