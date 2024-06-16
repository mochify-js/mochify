'use strict';

const { assert } = require('@sinonjs/referee-sinon');
const { Attr } = require('./dom/attr');
const { mapClientValue } = require('./map-client-value');

describe('lib/parse-client-value', () => {
  it('handles raw string values', () => {
    assert.equals(mapClientValue(''), '');
    assert.equals(mapClientValue('test'), 'test');
    assert.equals(mapClientValue('[test]'), '[test]');
  });

  it('handles array with unknown marker', () => {
    assert.equals(mapClientValue(['']), ['']);
    assert.equals(mapClientValue(['test']), ['test']);
  });

  it('handles null', () => {
    assert.isNull(mapClientValue(['null']));
  });

  it('handles undefined', () => {
    assert.isUndefined(mapClientValue(['undefined']));
  });

  it('handles Boolean', () => {
    assert.isTrue(mapClientValue(['Boolean', true]));
    assert.isFalse(mapClientValue(['Boolean', false]));
  });

  it('handles Number', () => {
    assert.equals(mapClientValue(['Number', 0]), 0);
    assert.equals(mapClientValue(['Number', -7]), -7);
    assert.equals(mapClientValue(['Number', 42]), 42);
  });

  it('handles NaN', () => {
    assert.isNaN(mapClientValue(['NaN']));
  });

  it('handles Infinity', () => {
    assert.isInfinity(mapClientValue(['Infinity']));
  });

  it('handles -Infinity', () => {
    assert.isNegativeInfinity(mapClientValue(['-Infinity']));
  });

  it('handles BigInt', () => {
    assert.equals(mapClientValue(['BigInt', 1n]), 1n);
  });

  it('handles String', () => {
    assert.equals(mapClientValue(['String', '']), '');
    assert.equals(mapClientValue(['String', 'test']), 'test');
    assert.equals(mapClientValue(['String', '"test"']), '"test"');
  });

  it('handles Symbol', () => {
    const value = mapClientValue(['Symbol']);

    assert.isSymbol(value);
    assert.equals(value.toString(), 'Symbol()');
  });

  it('handles Symbol with description', () => {
    const value = mapClientValue(['Symbol', 'test']);

    assert.isSymbol(value);
    assert.equals(value.toString(), 'Symbol(test)');
  });

  it('handles anonymous function', () => {
    const value = mapClientValue(['Function', '', [], []]);

    assert.isFunction(value);
    assert.equals(value.name, '');
    assert.equals(String(value), 'function () {}');
  });

  it('handles named function', () => {
    const value = mapClientValue(['Function', 'test', [], []]);

    assert.isFunction(value);
    assert.equals(value.name, 'test');
    assert.equals(String(value), 'function () {}');
  });

  it('handles async function', () => {
    const value = mapClientValue(['AsyncFunction', 'test', [], []]);

    assert.isFunction(value);
    assert.equals(value.name, 'test');
    assert.equals(String(value), 'async function () {}');
  });

  it('handles generator function', () => {
    const value = mapClientValue(['GeneratorFunction', 'test', [], []]);

    assert.isFunction(value);
    assert.equals(value.name, 'test');
    assert.equals(String(value), 'function* () {}');
  });

  it('handles async generator function', () => {
    const value = mapClientValue(['AsyncGeneratorFunction', 'test', [], []]);

    assert.isFunction(value);
    assert.equals(value.name, 'test');
    assert.equals(String(value), 'async function* () {}');
  });

  it('handles function with additional properties', () => {
    const value = mapClientValue([
      'Function',
      '',
      [['test', ['Number', 42]]],
      []
    ]);

    assert.isFunction(value);
    assert.equals(value.test, 42);
  });

  it('handles function with additional symbol properties', () => {
    const value = mapClientValue([
      'Function',
      '',
      [],
      [['test', ['Number', 42]]]
    ]);

    assert.isFunction(value);
    const symbols = Object.getOwnPropertySymbols(value);
    assert.equals(symbols.length, 1);
    assert.equals(String(symbols[0]), 'Symbol(test)');
    assert.equals(value[symbols[0]], 42);
  });

  it('handles anonymous class', () => {
    const value = mapClientValue(['Class', '']);

    assert.isFunction(value);
    assert.equals(value.toString(), 'class {}');
  });

  it('handles named class', () => {
    const value = mapClientValue(['Class', 'Test']);

    assert.isFunction(value);
    assert.equals(value.name, 'Test');
    assert.equals(String(value), 'class {}');
  });

  it('handles anonymous class with extends', () => {
    const value = mapClientValue(['Class', '', 'Base']);

    assert.isFunction(value);
    assert.equals(value.name, '');
    assert.equals(String(value), 'class extends base {}');
    const proto = Object.getPrototypeOf(value);
    assert.isFunction(proto);
    assert.equals(proto.name, 'Base');
    assert.equals(String(proto), 'class {}');
  });

  it('handles named class with extends', () => {
    const value = mapClientValue(['Class', 'Test', 'Base']);

    assert.isFunction(value);
    assert.equals(value.name, 'Test');
    assert.equals(String(value), 'class extends base {}');
    const proto = Object.getPrototypeOf(value);
    assert.isFunction(proto);
    assert.equals(proto.name, 'Base');
    assert.equals(String(proto), 'class {}');
  });

  it('handles Int8Array', () => {
    const value = mapClientValue(['Int8Array', [1, 2, 3]]);

    assert.equals(value, new Int8Array([1, 2, 3]));
  });

  it('handles Date', () => {
    const value = mapClientValue(['Date', 1718450169360]);

    assert.isDate(value);
    assert.equals(value.getTime(), 1718450169360);
  });

  it('handles invalid Date', () => {
    const value = mapClientValue(['Date', 'NaN']);

    assert.isDate(value);
    assert.isNaN(value.getTime());
    assert.equals(String(value), 'Invalid Date');
  });

  it('handles Object', () => {
    assert.equals(mapClientValue(['Object', [], []]), {});
    assert.equals(mapClientValue(['Object', [['test', ['Number', 42]]], []]), {
      test: 42
    });
    assert.equals(mapClientValue(['Object', [['test', ['NaN']]], []]), {
      test: NaN
    });
  });

  it('handles Object with symbol keys', () => {
    const object = mapClientValue(['Object', [], [['test', ['Number', 42]]]]);

    assert.isObject(object);
    const symbols = Object.getOwnPropertySymbols(object);
    assert.equals(symbols.length, 1);
    assert.equals(String(symbols[0]), 'Symbol(test)');
    assert.equals(object[symbols[0]], 42);
  });

  it('handles emtpy Array', () => {
    const value = mapClientValue(['Array', [], []]);

    assert.isArray(value);
    assert.equals(value, []);
  });

  it('handles non-empty Array', () => {
    const value = mapClientValue([
      'Array',
      [
        ['0', ['String', '7']],
        ['1', ['Number', 42]]
      ],
      []
    ]);

    assert.isArray(value);
    assert.equals(value, ['7', 42]);
  });

  it('handles sparse Array', () => {
    const value = mapClientValue(['Array', [['1', ['Number', 42]]], []]);

    assert.isArray(value);
    /* eslint-disable-next-line no-sparse-arrays */
    assert.equals(value, [, 42]);
  });

  it('handles Array with additional properties', () => {
    const array = mapClientValue([
      'Array',
      [
        ['0', ['String', '7']],
        ['test', ['Number', 42]]
      ],
      []
    ]);

    assert.isArray(array);
    assert.equals(array.length, 1);
    assert.equals(array[0], '7');
    assert.equals(array.test, 42);
    assert.equals(array, Object.assign(['7'], { test: 42 }));
  });

  it('handles Array with additional symbol properties', () => {
    const array = mapClientValue([
      'Array',
      [['0', ['String', '7']]],
      [['test', ['Number', 42]]]
    ]);

    assert.isArray(array);
    assert.equals(array.length, 1);
    assert.equals(array[0], '7');
    const symbols = Object.getOwnPropertySymbols(array);
    assert.equals(symbols.length, 1);
    assert.equals(String(symbols[0]), 'Symbol(test)');
    assert.equals(array[symbols[0]], 42);
  });

  [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
  ].forEach((Type) => {
    it(`handles empty ${Type.name}`, () => {
      const value = mapClientValue([Type.name, []]);

      assert.equals(value, new Type());
    });

    it(`handles populated ${Type.name}`, () => {
      const value = mapClientValue([Type.name, [1, 2, 3]]);

      assert.equals(value, new Type([1, 2, 3]));
    });
  });

  it('handles empty Set', () => {
    const value = mapClientValue(['Set', []]);

    assert.isTrue(value instanceof Set);
    assert.equals(Array.from(value), []);
  });

  it('handles populated Set', () => {
    const value = mapClientValue([
      'Set',
      [
        ['Number', 42],
        ['Object', [['test', ['String', 'yes']]], []]
      ]
    ]);

    assert.isTrue(value instanceof Set);
    assert.equals(value.size, 2);
    assert.equals(Array.from(value), [42, { test: 'yes' }]);
  });

  it('handles WeakSet', () => {
    const value = mapClientValue(['WeakSet']);

    assert.isTrue(value instanceof WeakSet);
  });

  it('handles empty Map', () => {
    const value = mapClientValue(['Map', []]);

    assert.isTrue(value instanceof Map);
    assert.equals(Array.from(value), []);
  });

  it('handles populated Map', () => {
    const value = mapClientValue([
      'Map',
      [
        [
          ['Object', [['test', ['String', 'yes']]], []],
          ['Number', 42]
        ]
      ]
    ]);

    assert.isTrue(value instanceof Map);
    assert.equals(value.size, 1);
    assert.equals(Array.from(value.entries()), [[{ test: 'yes' }, 42]]);
  });

  it('handles WeakMap', () => {
    const value = mapClientValue(['WeakMap']);

    assert.isTrue(value instanceof WeakMap);
  });

  function getPromiseStateAndValue(promise) {
    const t = {};
    return Promise.race([promise, t]).then(
      (r) => (r === t ? ['pending'] : ['fulfilled', r]),
      (r) => ['rejected', r]
    );
  }

  it('handles pending Promise', async () => {
    const promise = mapClientValue(['Promise', 'pending']);

    assert.isTrue(promise instanceof Promise);
    await assert.resolves(getPromiseStateAndValue(promise), ['pending']);
  });

  it('handles fulfilled Promise', async () => {
    const promise = mapClientValue(['Promise', 'fulfilled', ['String', 'yes']]);

    assert.isTrue(promise instanceof Promise);
    await assert.resolves(getPromiseStateAndValue(promise), [
      'fulfilled',
      'yes'
    ]);
  });

  it('handles rejected Promise', async () => {
    const promise = mapClientValue(['Promise', 'rejected', ['String', 'yes']]);

    assert.isTrue(promise instanceof Promise);
    await assert.resolves(getPromiseStateAndValue(promise), [
      'rejected',
      'yes'
    ]);
  });

  it('handles Circular', () => {
    const value = mapClientValue(['Circular', ['foo', 0, 'bar']]);

    assert.equals(value, '[Circular *foo.0.bar]');
  });

  it('handles Unknown', () => {
    const value = mapClientValue(['Unknown', { test: 123 }]);

    assert.equals(value, { test: 123 });
  });

  context('with DOM nodes', () => {
    it('handles Attr', () => {
      const value = mapClientValue(['Attr', 'key', 'value']);

      assert.isTrue(value instanceof Attr);
      assert.equals(value.name, 'key');
      assert.equals(value.value, 'value');
    });
  });
});
