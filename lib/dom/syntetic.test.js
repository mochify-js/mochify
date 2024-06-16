'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { Syntetic } = require('./syntetic');

describe('lib/dom/syntetic', () => {
  it('has toStringTag "Syntetic"', () => {
    const str = Object.prototype.toString.call(new Syntetic());

    assert.equals(str, '[object Syntetic]');
  });

  it('invokes toString on JSON.stringify', () => {
    const obj = new (class extends Syntetic {
      toString() {
        return 'test';
      }
    })();

    assert.equals(JSON.stringify(obj), '"test"');
  });
});
