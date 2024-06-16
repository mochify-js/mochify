/*eslint-env mocha*/
'use strict';

describe('test', () => {
  it('fails', () => {
    const error = new TypeError('Oh noes!');
    Object.assign(error, {
      code: 'ERR_TEST_FAILED',
      expected: { test: 'foo' },
      actual: { test: 'bar' }
    });
    throw error;
  });
});
