/**
 * @module package/quiqqer/dashboard/bin/backend/controls/ManageCardsButton
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/ManageCardsButton', [

    'qui/controls/buttons/Button',

    'package/quiqqer/dashboard/bin/backend/controls/ManageCardsDialog',

    'Locale'

], function (QUIButton, ManageCardsDialog, QUILocale) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUIButton,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/ManageCardsButton',

        $Input: null,

        Binds: [
            '$onClick'
        ],

        // Stores data temporarily, after closing the dialog.
        // If the dialog is opened again, we can display the user's previous settings again.
        // Using settings from $Input directly would never fetch new cards' settings from the server.
        tempData: undefined,

        options: {
            text: QUILocale.get(lg, 'control.managecards.button.text')
        },

        initialize: function (options) {
            this.parent(options);

            this.addEvents({
                onClick : this.$onClick,
                onImport: this.$onImport
            });
        },


        $onImport: function () {
            this.$Input = this.getElm();
            this.create().inject(this.$Input.parentNode);
        },

        /**
         * event: on create
         */
        $onClick: function () {
            var self = this;

            var CardDialog = new ManageCardsDialog({
                // tempData is empty when the dialog is opened for the first time -> queries settings from the server
                // More information about why tempData is used can be found where tempData is defined
                cardSettings: self.tempData
            });

            CardDialog.addEvent('onSubmit', function () {
                var valuesFromForm = CardDialog.getValuesFromForm();

                self.$Input.value = JSON.encode(valuesFromForm);

                // Store data temporarily so the settings don't get lost when opening the dialog again
                self.tempData = valuesFromForm;
            });

            CardDialog.open();
        }
    });
});