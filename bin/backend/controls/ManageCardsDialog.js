/**
 * @module package/quiqqer/dashboard/bin/backend/controls/ManageCardsDialog
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/ManageCardsDialog', [

    'controls/grid/Grid',

    'qui/controls/windows/Confirm',

    'Ajax',
    'Locale',
    'Mustache',

    'text!package/quiqqer/dashboard/bin/backend/controls/ManageCardsDialog/template-setting.html',
    'css!package/quiqqer/dashboard/bin/backend/controls/ManageCardsDialog/style.css'
], function (Grid, QUIConfirmWindow, QUIAjax, QUILocale, Mustache, templateSetting) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({
        Extends: QUIConfirmWindow,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/ManageCardsDialog',

        $Form: null,

        $Loader: null,

        Binds: [
            '$onOpen'
        ],

        cardSettings: undefined,

        options: {
            maxWidth : 700,
            maxHeight: 600,
            title    : QUILocale.get(lg, 'control.managecards.dialog.title'),
            icon     : 'fa fa-pencil',
            style    : {
                padding: 0
            }
        },

        initialize: function (options) {
            this.cardSettings = options.cardSettings;

            this.parent(options);

            this.addEvents({
                onOpen: this.$onOpen
            });
        },

        $onOpen: function () {
            this.Loader.show();

            var Content = this.getContent();
            Content.empty();

            this.$Form = new Element('form');
            this.$Form.inject(Content);

            this.buildContent();
        },

        buildContent: function () {
            var cardSettings = this.cardSettings;

            if (typeof cardSettings === 'object') {
                this._buildContentFromLocalSettings(cardSettings);
                return;
            }

            this._buildContentFromServerSettings();
        },

        _buildContentFromServerSettings: function () {
            var self = this;

            QUIAjax.get('package_quiqqer_dashboard_ajax_backend_getCardSettings', function (settings) {
                self._buildContentFromLocalSettings(settings);
            }, {
                'package': 'quiqqer/dashboard',
                onError  : console.error
            });
        },

        _buildContentFromLocalSettings: function (settings) {
            var self = this;

            var isEnabledLabel      = QUILocale.get(lg, 'control.managecards.dialog.enabled.label'),
                priorityLabel       = QUILocale.get(lg, 'control.managecards.dialog.priority.label'),
                priorityPlaceholder = QUILocale.get(lg, 'control.managecards.dialog.priority.placeholder');

            settings.forEach(function (cardSettings) {
                var settingHtml = Mustache.render(templateSetting, {
                    type     : cardSettings.card,
                    isEnabled: {
                        label: isEnabledLabel,
                        value: cardSettings.enabled
                    },
                    priority : {
                        label      : priorityLabel,
                        value      : cardSettings.priority,
                        placeholder: priorityPlaceholder
                    }
                });

                var Setting = new Element('div', {
                    html: settingHtml
                });

                Setting.inject(self.$Form);
            });

            this.Loader.hide();
        },

        getValuesFromForm: function () {
            var types = this.$Form.getElements('fieldset');

            var result = {};
            types.forEach(function (fieldset) {
                var type = fieldset.get('data-type');
                result[type] = {};
                result[type].enabled = fieldset.getElement('input[name="enabled"]').checked;
                result[type].priority = fieldset.getElement('input[name="priority"]').value;
            });

            return result;
        }
    });
});