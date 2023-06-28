/**
 * Helper function to open the dashboard panel
 *
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/dashboard/bin/backend/utils/load', [

    'qui/QUI',
    'package/quiqqer/dashboard/bin/backend/controls/Dashboard'

], function (QUI, Dashboard) {
    "use strict";

    const run = function () {
        const panels = QUI.Controls.getByType(
            'package/quiqqer/dashboard/bin/backend/controls/Dashboard'
        );

        // if injected, we don't need more
        if (panels.length) {
            return;
        }

        const tasks = QUI.Controls.getByType('qui/controls/desktop/Tasks');

        if (!tasks.length) {
            return;
        }

        let i, len;
        let Tasks = null;

        for (i = 0, len = tasks.length; i < len; i++) {
            if (tasks[i].getElm().getParent('body')) {
                Tasks = tasks[i];
                break;
            }
        }

        if (!Tasks) {
            return;
        }

        const Board = new Dashboard();

        Tasks.appendChild(Board, 'top');

        (function () {
            Board.focus();
        }).delay(100);
    };

    QUI.addEvent('onQuiqqerLoaded', function () {
        run.delay(1650);
    });
});
