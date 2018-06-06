const {FakeHTMLDocument} = require('fakehtmldocument');
const assert = require('assert');

const {m$} = require('../dist/module/mquery');

assert.doesNotThrow(() => {
    let mQuery = m$();
}, 'Create instance');