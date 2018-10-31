/**
 * @module package/quiqqer/dashboard/bin/backend/controls/Dashboard
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/controls/Dashboard', [

    'qui/QUI',
    'qui/controls/desktop/Panel',

    'package/quiqqer/dashboard/bin/backend/Dashboard',
    'package/quiqqer/dashboard/bin/backend/controls/Card',

    'Locale',
    'Mustache',

    'text!package/quiqqer/dashboard/bin/backend/controls/Dashboard.html',
    'text!package/quiqqer/dashboard/bin/backend/controls/cards/help.de.html',
    'text!package/quiqqer/dashboard/bin/backend/controls/cards/help.en.html',

    'css!package/quiqqer/dashboard/bin/backend/controls/Dashboard.css',
    'css!package/quiqqer/dashboard/bin/backend/controls/Card.css'

], function (QUI, QUIPanel, Dashboard, Card, QUILocale, Mustache,
             template, templateHelpDe, templateHelpEn) {
    "use strict";

    var lg = 'quiqqer/dashboard';

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

            var help = templateHelpEn;

            if (window.USER.lang === 'de') {
                help = templateHelpDe;
            }

            this.getContent().set('html', Mustache.render(template, {
                projectTitle    : QUILocale.get(lg, 'dashboard.projects.count'),
                sitesTitle      : QUILocale.get(lg, 'dashboard.sites.count'),
                usersTitle      : QUILocale.get(lg, 'dashboard.users.count'),
                groupsTitle     : QUILocale.get(lg, 'dashboard.groups.count'),
                pageChangesTitle: QUILocale.get(lg, 'dashboard.page.changes'),
                pageChangesId   : QUILocale.get('quiqqer/system', 'id'),
                pageChangesName : QUILocale.get('quiqqer/system', 'name'),
                pageChangesTit  : QUILocale.get('quiqqer/system', 'title'),
                pageChangesDate : QUILocale.get('quiqqer/system', 'e_date'),
                help            : help
            }));

            // stats
            Dashboard.getStats().then(function (result) {
                var Projects = self.getElm().getElement('.quiqqer-dashboard-projects .quiqqer-dashboard-one-stat-value');
                var Sites    = self.getElm().getElement('.quiqqer-dashboard-sites .quiqqer-dashboard-one-stat-value');
                var Users    = self.getElm().getElement('.quiqqer-dashboard-users .quiqqer-dashboard-one-stat-value');
                var Groups   = self.getElm().getElement('.quiqqer-dashboard-groups .quiqqer-dashboard-one-stat-value');

                Projects.removeClass('fa fa-circle-o-notch fa-spin');
                Projects.set('html', result.projects);

                Sites.removeClass('fa fa-circle-o-notch fa-spin');
                Sites.set('html', result.sites);

                Users.removeClass('fa fa-circle-o-notch fa-spin');
                Users.set('html', result.users);

                Groups.removeClass('fa fa-circle-o-notch fa-spin');
                Groups.set('html', result.groups);
            });

            // site activity
            Dashboard.getNewestEditedSites().then(function (result) {
                var Container = self.getElm().getElement('.quiqqer-dashboard-siteActivity');
                var Tbody     = Container.getElement('tbody');

                var i, len, entry, Row;

                var click = function (event) {
                    var Target = event.target;

                    if (Target.nodeName !== 'TR') {
                        Target = Target.getParent('tr');
                    }

                    var project = Target.get('data-project');
                    var lang    = Target.get('data-lang');
                    var id      = Target.get('data-id');

                    require(['utils/Panels'], function (PanelUtils) {
                        PanelUtils.openSitePanel(project, lang, id);
                    });
                };

                for (i = 0, len = result.length; i < len; i++) {
                    entry = result[i];

                    Row = new Element('tr', {
                        'class'       : 'can-be-hovered',
                        'data-project': entry.project,
                        'data-lang'   : entry.lang,
                        'data-id'     : entry.id,
                        html          : '<td>' + entry.id + '</td>' +
                            '<td>' + entry.name + '</td>' +
                            '<td>' + entry.title + '</td>' +
                            '<td>' + entry.e_date + '</td>',
                        events        : {
                            click: click
                        }
                    }).inject(Tbody);
                }
            });

            // latest blog
            Dashboard.getLatestBlog(window.USER.lang).then(function (result) {
                var BlogEntry   = self.getElm().getElement('.newest-blog-entry');
                var BlogContent = BlogEntry.getElement('.quiqqer-dashboard-card-body');

                BlogEntry.getElement('header')
                         .set('html', '<img src="' + result.image + '" />');

                BlogContent.set({
                    html: '<h2>' + result.title + '</h2>' +
                        '<div style="padding: 0 1.5rem 1.5rem">' + result.description + '</div>'
                });

                BlogEntry.addEvent('click', function () {
                    window.open(result.link);
                });
            });
        }
    });
});