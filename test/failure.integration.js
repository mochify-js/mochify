'use strict';

const { assert, sinon } = require('@sinonjs/referee-sinon');
const fs = require('fs/promises');
const { PassThrough } = require('stream');
const { withSourceMaps } = require('./fixture/with-source-maps');
const { mochify } = require('..');

describe('failure', () => {
  it('maps error with additional properties and maps stack', async () => {
    const source = await fs.readFile('./test/fixture/fails.js', 'utf8');
    const script = new PassThrough();
    script.push(withSourceMaps(source));
    script.end();
    sinon.replace(process.stdout, 'write', sinon.fake());

    await mochify({
      driver: '../test/fixture/driver.js',
      reporter: 'json',
      spec: script
    });
    const output = process.stdout.write['args'].map((args) => args[0]);
    sinon.restore(); // Restore sandbox here or test output breaks

    // console.log(output[0]);

    const json = JSON.parse(output.pop());
    assert.equals(json.tests.length, 1);
    assert.equals(json.tests[0].fullTitle, 'test fails');
    assert.equals(json.failures.length, 1);
    assert.equals(json.failures[0].fullTitle, 'test fails');
    const { err } = json.failures[0];
    assert.equals(err.message, 'Oh noes!');
    assert.equals(err.code, 'ERR_TEST_FAILED');
    assert.equals(err.expected, JSON.stringify({ test: 'foo' }, null, '  '));
    assert.equals(err.actual, JSON.stringify({ test: 'bar' }, null, '  '));
    assert.equals(err.stack.split('\n').slice(0, 2), [
      'TypeError: Oh noes!',
      '    at myTest (source.js:45)'
    ]);
  });
});
