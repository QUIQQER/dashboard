const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const {test} = require('node:test');
const vm = require('node:vm');

function fixture() {
    let definition;
    const listeners = new Map();
    const QUI = {
        addEvent: (name, callback) => listeners.set(name, callback),
        removeEvent: (name, callback) => {
            if (listeners.get(name) === callback) listeners.delete(name);
        }
    };
    vm.runInNewContext(readFileSync(resolve(__dirname, '../../bin/backend/controls/Dashboard.js'), 'utf8'), {
        URL_BIN_DIR: '/bin/', URL_OPT_DIR: '/packages/',
        Class: function (value) { definition = value; return value; },
        Element: function (tag, options) {
            return {src: options.src, isConnected: true, inject() { return this; }};
        },
        define(name, dependencies, factory) { factory(QUI, {}, {}, {}); }
    });
    const events = {};
    const control = {
        ...definition,
        parent() {}, setAttribute() {},
        addEvents: value => Object.assign(events, value),
        getId: () => 'dashboard-instance',
        getElm: () => ({addClass() {}, getElement: () => ({setStyle() {}})}),
        getContent: () => ({addClass() {}})
    };
    control.$onLoginSuccess = definition.$onLoginSuccess.bind(control);
    control.initialize({});
    control.$onCreate();
    return {control, events, listeners};
}

test('the outer panel reloads a blank iframe after successful authentication', () => {
    const {control, listeners} = fixture();
    let reloads = 0;
    control.$Frame.contentWindow = {location: {href: '/board.php?dashboardId=7', reload() { reloads++; }}};
    listeners.get('quiqqerUserAuthLoginSuccess')();
    assert.equal(reloads, 1);
    assert.equal(control.$Frame.contentWindow.location.href, '/board.php?dashboardId=7');
});

test('closed panels unsubscribe and cannot reload a detached dashboard', () => {
    const {control, events, listeners} = fixture();
    control.$Frame.isConnected = false;
    control.$Frame.contentWindow = {get location() { assert.fail('Detached frame must not be accessed'); }};
    control.$onLoginSuccess();
    events.onDestroy();
    assert.equal(listeners.size, 0);
});

test('an inaccessible frame reloads its configured source without throwing', () => {
    const {control, listeners} = fixture();
    control.$Frame.contentWindow = {get location() { throw new Error('SecurityError'); }};
    const source = control.$Frame.src;
    let reloads = 0;
    Object.defineProperty(control.$Frame, 'src', {get: () => source, set(value) {
        assert.equal(value, source);
        reloads++;
    }});
    listeners.get('quiqqerUserAuthLoginSuccess')();
    assert.equal(reloads, 1);
});
