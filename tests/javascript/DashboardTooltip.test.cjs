const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const {test} = require('node:test');
const vm = require('node:vm');

let definition;
vm.runInNewContext(readFileSync(resolve(__dirname, '../../bin/backend/controls/Dashboard.js'), 'utf8'), {
    Class: function (value) { definition = value; return value; },
    define(name, dependencies, factory) { factory({}, {}, {}, {}); }
});

function tooltip(frame, title = 'QUIQQER Dashboard') {
    return definition.getToolTipText.call({$Frame: frame, getAttribute: () => title});
}

test('reads the dashboard heading from a native iframe document without MooTools', async () => {
    const document = {querySelector(selector) {
        assert.equal(selector, '[data-name="page-title"]');
        return {textContent: '  Project dashboard\n'};
    }};
    assert.equal(await tooltip({contentDocument: document, contentWindow: {document}}), 'Project dashboard');
});

test('returns the panel title before the iframe is created', async () => {
    assert.equal(await tooltip(undefined), 'QUIQQER Dashboard');
});

test('returns the panel title while the iframe is loading or inaccessible', async () => {
    assert.equal(await tooltip({contentDocument: null}), 'QUIQQER Dashboard');
    assert.equal(await tooltip({get contentDocument() { throw new Error('SecurityError'); }}), 'QUIQQER Dashboard');
});

test('missing and empty headings retain a usable fallback', async () => {
    assert.equal(await tooltip({contentDocument: {querySelector: () => null}}), 'QUIQQER Dashboard');
    assert.equal(await tooltip({contentDocument: {querySelector: () => ({textContent: '  '})}}), 'QUIQQER Dashboard');
    assert.equal(await tooltip(null, ''), 'Dashboard');
});
