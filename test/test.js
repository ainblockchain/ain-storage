
var assert = require('assert');
const Provider = require('../src/provider');
/*
import assert from 'assert';
import Provider from '../src/provider';
*/
describe("array-indexOf() method", function() {
    it("return -1 if no value", function() {
        assert.strictEqual(-1, [1,2,3].indexOf(5));
        assert.strictEqual(-1, [1,2,3].indexOf(0));
    })
})

describe("class Provider", function() {
    it("return endpoint", function() {
        var provider = new Provider('https://example.org/foo/bar?baz');
        assert.strictEqual('https://example.org', provider.getEndpoint());
    })
})