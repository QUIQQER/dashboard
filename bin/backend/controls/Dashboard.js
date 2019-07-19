/**
 * @module package/quiqqer/dashboard/bin/backend/controls/Dashboard
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/Dashboard', [

    'qui/controls/desktop/Panel',

    'Ajax',
    'Mustache',

    'text!package/quiqqer/dashboard/bin/backend/controls/Dashboard.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/Dashboard.css'

], function (QUIPanel, QUIAjax, Mustache, template) {
    "use strict";

    return new Class({

        Extends: QUIPanel,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/Dashboard',

        Cards: [],

        Binds: [
            '$onCreate',
            'refresh'
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
            this.getElm().addClass('quiqqer-dashboard');
            this.getContent().addClass('quiqqer-dashboard-cards');
            this.getContent().addClass('quiqqer-dashboard--loading');

            this.getContent().set('html', Mustache.render(template));

            this.refresh();

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
         * Refreshes the dashboard's content
         */
        refresh: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getCards', function (cards) {
                // card-names/-types to require the controls
                var cardNames = Object.getOwnPropertyNames(cards);

                require(cardNames, function () {
                    self.Cards = [];

                    for (var i = 0; i < arguments.length; i++) {
                        var Card = new arguments[i]();

                        // The card's settings are stored in the cards array (result from the Ajax-call).
                        // If a priority was set via the user's profile, we have to set it here.
                        Card.setPriority(cards[cardNames[i]].priority);

                        self.Cards.push(Card);
                    }

                    self.sortCards();

                    self.displayCards();
                });
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        },

        /**
         * Resets and displays all cards
         */
        displayCards: function () {
            var self = this;

            self.getContent().empty();

            this.getCards().forEach(function (Card) {
                Card.inject(self.getContent());
            });
        },

        /**
         * Sorts the dashboard's cards by priority and title.
         * This does not redraw them. It only sorts the internal array.
         */
        sortCards: function () {
            this.getCards().sort(function (CardA, CardB) {
                // Sort by priority
                var comparisonResult = CardB.getPriority() - CardA.getPriority();

                // If priority is equal sort by type/name
                if (comparisonResult === 0) {
                    comparisonResult = CardA.getType().localeCompare(CardB.getType());
                }

                // result > 0 -> [CardB, CardA]
                // result < 0 -> [CardA, CardB]
                // result = 0 -> Order unchanged
                return comparisonResult;
            });
        },


        /**
         * Returns all cards displayed on the dashboard
         *
         * @return {Array}
         */
        getCards: function () {
            return this.Cards;
        },


        /**
         * Adds a card to the Dashboard.
         * Expects a instantiated Card-element.
         *
         * @param {Element} Card - Card-element
         */
        addCard: function (Card) {
            this.getCards().push(Card);

            this.sortCards();

            this.displayCards();
        }
    });
});