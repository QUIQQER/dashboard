/**
 * @module package/quiqqer/dashboard/bin/backend/controls/cards/SiteStats
 * @author www.pcsg.de (Jan Wennrich)
 */
define('package/quiqqer/dashboard/bin/backend/controls/cards/SiteStats', [

    'Ajax',
    'Locale',
    'Mustache',

    'controls/projects/Select',

    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'text!package/quiqqer/dashboard/bin/backend/controls/cards/SiteStats/content.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/cards/SiteStats/style.css'

], function (QUIAjax, QUILocale, Mustache, ProjectSelect, QUICard, contentTemplate) {
    "use strict";

    var lg = 'quiqqer/dashboard';

    return new Class({

        Extends: QUICard,
        Type   : 'package/quiqqer/dashboard/bin/backend/controls/cards/SiteStats',

        initialize: function (options) {
            this.parent(options);

            this.setAttributes({
                id     : 'quiqqer-dashboard-card-sitestats',
                icon   : 'fa fa-file-text-o',
                title  : QUILocale.get(lg, 'dashboard.sitestats.title'),
                content: Mustache.render(contentTemplate, {
                    rootSites            : QUILocale.get(lg, 'dashboard.sitestats.rootSites'),
                    childrenSites        : QUILocale.get(lg, 'dashboard.sitestats.children'),
                    missingContentSites  : QUILocale.get(lg, 'dashboard.sitestats.missing.content'),
                    missingShortDescSites: QUILocale.get(lg, 'dashboard.sitestats.missing.shortdesc')
                }),
                footer : false,
                styles : false,
                size   : 25
            });

            this.initializeProjectSelect();
        },

        /**
         * Initializes the project select control
         */
        initializeProjectSelect: function () {
            var ProjectSelectContainer = new Element('div', {
                id: 'sitestats-project-select'
            });

            this.$ProjectSelect = new ProjectSelect({
                langSelect   : false,
                emptyselect  : false,
                localeStorage: 'dashboard-media-info-card-project-select'
            }).inject(ProjectSelectContainer);

            // We need to add this event later, since injecting the project-select also fires a change event
            this.$ProjectSelect.addEvent('onChange', function () {
                this.refresh();
            }.bind(this));

            ProjectSelectContainer.inject(this.getElm().getElement('.quiqqer-dashboard-card-header'));
        },

        /**
         * @inheritDoc
         */
        refresh: function () {
            var projectName = this.$ProjectSelect.getValue();

            this.refreshNoShortDescriptionValue(projectName);
            this.refreshNoContentValue(projectName);
            this.refreshChildrenSiteCountValue(projectName);
            this.refreshRootSiteCountValue(projectName);
        },


        /**
         * Updates the root site count value
         */
        refreshRootSiteCountValue: function (projectName) {
            QUIAjax.get(
                'package_quiqqer_dashboard_ajax_backend_stats_sites_getRootSitesCount',
                function (result) {
                    this.updateValueWrapper(
                        this.getElm().getElement('#sitestats-sites-roots .value'),
                        result
                    );
                }.bind(this), {
                    'package'    : 'quiqqer/dashboard',
                    'projectName': projectName,
                    onError      : console.error
                }
            );
        },


        /**
         * Updates the children site count value
         */
        refreshChildrenSiteCountValue: function (projectName) {
            QUIAjax.get(
                'package_quiqqer_dashboard_ajax_backend_stats_sites_getChildrenSitesCount',
                function (result) {
                    this.updateValueWrapper(
                        this.getElm().getElement('#sitestats-sites-children .value'),
                        result
                    );
                }.bind(this), {
                    'package'    : 'quiqqer/dashboard',
                    'projectName': projectName,
                    onError      : console.error
                }
            );
        },


        /**
         * Updates the no content count value
         */
        refreshNoContentValue: function (projectName) {
            QUIAjax.get(
                'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoContentSitesCount',
                function (result) {
                    this.updateValueWrapper(
                        this.getElm().getElement('#sitestats-sites-missing-content .value'),
                        result,
                        result !== 0 ? 'bad-value' : 'good-value'
                    );
                }.bind(this), {
                    'package'    : 'quiqqer/dashboard',
                    'projectName': projectName,
                    onError      : console.error
                }
            );
        },


        /**
         * Updates the no short description count value
         */
        refreshNoShortDescriptionValue: function (projectName) {
            QUIAjax.get(
                'package_quiqqer_dashboard_ajax_backend_stats_sites_getNoShortDescriptionSitesCount',
                function (result) {
                    this.updateValueWrapper(
                        this.getElm().getElement('#sitestats-sites-missing-shortdesc .value'),
                        result,
                        result !== 0 ? 'bad-value' : 'good-value'
                    );
                }.bind(this), {
                    'package'    : 'quiqqer/dashboard',
                    'projectName': projectName,
                    onError      : console.error
                }
            );
        },


        /**
         * Updates a given ValueWrapper with the given value and applies the optionally given CSS-class to the value.
         *
         * @param {Element} ValueWrapper
         * @param {number} value
         * @param {string} cssClass
         */
        updateValueWrapper: function (ValueWrapper, value, cssClass) {
            cssClass = cssClass || '';

            ValueWrapper.empty();

            var ValueElement;

            if (typeof value == 'number') {
                ValueElement = new Element('span', {
                    html: value
                });
            } else {
                ValueElement = new Element('span', {
                    html : '?'
                }).addClass('warning-value');

                ValueWrapper.set('title', QUILocale.get(lg, 'dashboard.sitestats.missing'));
            }

            ValueElement.addClass(cssClass);

            ValueWrapper.adopt(ValueElement);
        }
    });
});