/**
 * @module package/quiqqer/dashboard/bin/backend/controls/Dashboard
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/Dashboard', [

    'qui/QUI',
    'qui/controls/buttons/Button',
    'qui/controls/desktop/Panel',

    'Ajax',

    'css!package/quiqqer/dashboard/bin/backend/controls/Dashboard.css'

], function (QUI, QUIButton, QUIPanel, QUIAjax) {
    "use strict";

    return new Class({

        Extends: QUIPanel,
        Type: 'package/quiqqer/dashboard/bin/backend/controls/Dashboard',

        Cards: [],

        Binds: [
            '$onCreate',
            '$onInject',
            'refresh'
        ],

        options: {
            dashboardId: false
        },

        initialize: function (options) {
            this.parent(options);

            this.setAttribute('icon', URL_BIN_DIR + '16x16/quiqqer.png');
            this.setAttribute('dragable', false);
            this.setAttribute('displayNoTaskText', true);
            this.setAttribute('taskNotClosable', true);

            this.addEvents({
                onCreate: this.$onCreate,
                onInject: this.$onInject
            });
        },

        /**
         * @return {*}
         */
        getToolTipText: function () {
            const self = this;

            return new Promise(function (resolve) {
                const Title = self.$Frame.contentWindow.document.getElement('.page-title');

                if (Title) {
                    resolve(Title.get('text').trim());
                    return;
                }

                resolve('Dashboard');
            });
        },

        /**
         * event: on create
         */
        $onCreate: function () {
            this.getElm().addClass('quiqqer-dashboard');
            this.getContent().addClass('quiqqer-dashboard-cards');

            this.$Frame = new Element('iframe', {
                src: URL_OPT_DIR + 'quiqqer/dashboard/bin/backend/board.php?instance=' + this.getId(),
                styles: {
                    border: 0,
                    height: '100%',
                    width: '100%',
                    overflow: 'auto'
                },
                scrolling: "auto"
            }).inject(this.getContent());

            this.getElm().getElement('.qui-panel-header').setStyle('background-color', '#f4f6fa');
        },

        $onInject: function () {
            const TaskNode = this.getElm().getParent('.qui-taskpanel');

            if (!TaskNode) {
                return;
            }

            const Tasks = QUI.Controls.getById(TaskNode.get('data-quiid'));
            const Taskbar = Tasks.getTaskbar();

            setTimeout(() => {
                Taskbar.getChildren().forEach((Task) => {
                    if (Task.getInstance().getId() === this.getId()) {
                        return;
                    }

                    if (Task.getInstance().getType() === 'package/quiqqer/dashboard/bin/backend/controls/Dashboard') {
                        Task.getInstance().destroy();
                    }
                });
            }, 100);
        },

        /**
         * Refreshes the dashboard's content
         */
        refresh: function () {
            const self = this;

            return new Promise(function (resolve) {
                QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getCards', function (cards) {
                    self.Cards = [];

                    // its empty
                    if (typeOf(cards) !== 'array') {
                        resolve(self.getCards());
                        return;
                    }

                    // card-names/-types to require the controls
                    const cardNames = cards.map(function (card) {
                        return card.card;
                    });

                    require(cardNames, function () {
                        self.Cards = [];

                        let i, Card;

                        for (i = 0; i < arguments.length; i++) {
                            Card = new arguments[i]();

                            // The card's settings are stored in the cards array (result from the Ajax-call).
                            // If a priority was set via the user's profile, we have to set it here.
                            Card.setPriority(cards[i].priority);

                            self.Cards.push(Card);
                        }

                        self.sortCards();

                        //self.displayCards();
                        resolve(self.getCards());
                    });
                }, {
                    'package': 'quiqqer/dashboard',
                    dashboardId: self.getAttribute('dashboardId'),
                    onError: console.error
                });
            });
        },

        /**
         * Resets and displays all cards
         */
        displayCards: function () {
            const self = this;

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
                let comparisonResult = CardB.getPriority() - CardA.getPriority();

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
