'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { parseClientValue } = require('./parse-client-value');

describe('lib/parse-client-value', () => {
  it('returns null for null', () => {
    assert.isNull(parseClientValue(null));
  });

  it('returns true for true', () => {
    assert.isTrue(parseClientValue(true));
  });

  it('returns false for false', () => {
    assert.isFalse(parseClientValue(false));
  });

  it('returns number for number', () => {
    assert.equals(parseClientValue(0), 0);
    assert.equals(parseClientValue(-7), -7);
    assert.equals(parseClientValue(42), 42);
  });

  it('returns string as is', () => {
    assert.equals(parseClientValue(''), '');
    assert.equals(parseClientValue('test'), 'test');
    assert.equals(parseClientValue('[test]'), '[test]');
  });

  it('returns undefined for [undefined]', () => {
    assert.isUndefined(parseClientValue('[undefined]'));
  });

  it('returns Infinity for [Infinity]', () => {
    assert.isInfinity(parseClientValue('[Infinity]'));
  });

  it('returns -Infinity for [-Infinity]', () => {
    assert.isNegativeInfinity(parseClientValue('[-Infinity]'));
  });

  it('returns NaN for [NaN]', () => {
    assert.isNaN(parseClientValue('[NaN]'));
  });

  it('returns symbol for Symbol()', () => {
    const value = parseClientValue('Symbol()');

    assert.isSymbol(value);
    assert.equals(value.toString(), 'Symbol()');
  });

  it('returns symbol for Symbol(test)', () => {
    const value = parseClientValue('Symbol(test)');

    assert.isSymbol(value);
    assert.equals(value.toString(), 'Symbol(test)');
  });

  it('returns anonymous function for [Function: ]', () => {
    const value = parseClientValue('[Function: ]');

    assert.isFunction(value);
    assert.equals(value.name, '');
  });

  it('returns named function for [Function: test]', () => {
    const value = parseClientValue('[Function: test]');

    assert.isFunction(value);
    assert.equals(value.name, 'test');
  });

  it('returns object for object', () => {
    assert.equals(parseClientValue({}), {});
    assert.equals(parseClientValue({ test: 42 }), { test: 42 });
    assert.equals(parseClientValue({ test: '[NaN]' }), { test: NaN });
  });

  it('returns array for array', () => {
    assert.equals(parseClientValue([]), []);
    assert.equals(parseClientValue([7, 42]), [7, 42]);
    assert.equals(parseClientValue(['[NaN]']), [NaN]);
  });
});
