'use strict';

const { assert, sinon } = require('@sinonjs/referee-sinon');
const { mochify } = require('..');

describe('spec', () => {
  it('passes resolved files to bundle command', async () => {
    sinon.replace(process.stdout, 'write', sinon.fake());

    await mochify({
      driver: '../test/fixture/driver.js',
      reporter: 'json',
      spec: 'test/fixture/pass*.js'
    });
    const output = process.stdout.write['firstCall'].args[0];
    sinon.restore(); // Restore sandbox here or test output breaks

    const json = JSON.parse(output);
    assert.equals(json.tests.length, 1);
    assert.equals(json.tests[0].fullTitle, 'test passes');
  });
});
