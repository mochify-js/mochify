'use strict';

const { Attr } = require('./dom/attr');
const { Comment } = require('./dom/comment');
const { Element } = require('./dom/element');
const { NamedNodeMap } = require('./dom/named-node-map');
const { NodeList } = require('./dom/node-list');
const { Text } = require('./dom/text');

exports.mapClientValue = mapValue;

/**
 * @type {Record<string, function(...any): any>} value
 */
const map = {
  undefined: () => undefined,
  null: () => null,
  window: () => '[object Window]',
  Boolean: (value) => value,
  NaN: () => NaN,
  Infinity: () => Infinity,
  '-Infinity': () => -Infinity,
  Number: (value) => value,
  BigInt: (value) => BigInt(value),
  String: (value) => value,
  Symbol: (desc) => Symbol(desc),
  Date: (ts) => new Date(ts === 'NaN' ? NaN : ts),
  RegExp: (source, flags) => new RegExp(source, flags),
  Function: (name, keys, symbols, mapStack) => {
    const fn = function () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  AsyncFunction: (name, keys, symbols, mapStack) => {
    const fn = async function () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  GeneratorFunction: (name, keys, symbols, mapStack) => {
    const fn = function* () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  AsyncGeneratorFunction: (name, keys, symbols, mapStack) => {
    const fn = async function* () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  Class: (name, ext) => {
    if (!ext) {
      return withName(class {}, name);
    }
    const base = /** @type {new () => Object} */ (withName(class {}, ext));
    return withName(class extends base {}, name);
  },
  Object: mapObject,
  Array: (keys, symbols, mapStack) =>
    Object.assign([], mapObject(keys, symbols, mapStack)),
  Set: (values, mapStack) => new Set(values.map((v) => mapValue(v, mapStack))),
  Map: (values, mapStack) =>
    new Map(
      values.map(([k, v]) => [mapValue(k, mapStack), mapValue(v, mapStack)])
    ),
  /* eslint-disable-next-line no-undef */
  WeakRef: () => new WeakRef({}),
  WeakSet: () => new WeakSet(),
  WeakMap: () => new WeakMap(),
  Promise: (state, value, mapStack) => {
    switch (state) {
      case 'fulfilled':
        return Promise.resolve(mapValue(value, mapStack));
      case 'rejected':
        return Promise.reject(mapValue(value, mapStack));
      default:
        return new Promise(() => {});
    }
  },
  Circular: (path) => `[Circular *${path.join('.')}]`,
  Unknown: (value) => value,
  // DOM
  Attr: (name, value) => new Attr(name, value),
  Comment: (text) => new Comment(text),
  DocumentFragment: (nodes) => mapNodeList('DocumentFragment', nodes),
  Element: (name, attrs, nodes) =>
    new Element(
      name,
      mapAttributes(attrs),
      nodes.map((n) => mapValue(n))
    ),
  HTMLCollection: (elements) => mapNodeList('HTMLCollection', elements),
  NamedNodeMap: (atts) => new NamedNodeMap(mapAttributes(atts)),
  NodeList: (nodes) => mapNodeList('NodeList', nodes),
  Text: (text) => new Text(text),
  ShadowRoot: (nodes) => mapNodeList('ShadowRoot', nodes)
};

/**
 * @param {Array<[string, any]>} keys
 * @param {Array<[string, any]>} symbols
 * @param {(function(string): string) | null} mapStack
 * @returns {Record<string | symbol, any>}
 */
function mapObject(keys, symbols, mapStack) {
  return Object.fromEntries(
    /** @type {Record<string | symbol, any>} */ (
      mapKeys(keys, mapStack)
    ).concat(mapSymbols(symbols, mapStack))
  );
}

/**
 * @param {Array<[string, any]>} entries
 * @param {(function(string): string) | null} mapStack
 * @returns {Array<[string, any]>}
 */
function mapKeys(entries, mapStack) {
  return entries.map(([k, v]) => [k, mapValue(v, mapStack)]);
}

/**
 * @param {Array<[string, any]>} entries
 * @param {(function(string): string) | null} mapStack
 * @returns {Array<[symbol, any]>}
 */
function mapSymbols(entries, mapStack) {
  return entries.map(([key, value]) => [
    Symbol(key),
    mapValue(value, mapStack)
  ]);
}

/**
 * @param {Function} fn
 * @param {string} name
 * @param {Array<[string, any]>} keys
 * @param {Array<[string, any]>} symbols
 * @param {(function(string): string) | null} mapStack
 * @returns {Function}
 */
function mapFunction(fn, name, keys, symbols, mapStack) {
  return Object.assign(withName(fn, name), mapObject(keys, symbols, mapStack));
}

/**
 * @param {Function} fn
 * @param {string} name
 * @returns {Function}
 */
function withName(fn, name) {
  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}

/**
 * @param {Record<string, string>} attrs
 * @returns {Array<Attr>}
 */
function mapAttributes(attrs) {
  return Object.entries(attrs).map(([n, v]) => new Attr(n, v));
}

/**
 * @param {string} type
 * @param {Array<any>} nodes
 * @returns {NodeList}
 */
function mapNodeList(type, nodes) {
  return new NodeList(
    type,
    nodes.map((n) => mapValue(n))
  );
}

for (const Type of [
  Error,
  TypeError,
  RangeError,
  ReferenceError,
  SyntaxError,
  URIError
]) {
  map[Type.name] = (message, stack, keys, symbols, mapStack) => {
    // @ts-ignore
    const error = new Type(message);
    error.stack =
      stack && mapStack
        ? `${Type.name}: ${message}\n${mapStack(stack)}`
        : stack;
    return Object.assign(error, mapObject(keys, symbols, mapStack));
  };
}

for (const Type of [
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array
]) {
  map[Type.name] = (value) => new Type(value);
}

/**
 * @param {any} raw
 * @param {(function(string): string) | null} [mapStack]
 * @returns {any}
 */
function mapValue(raw, mapStack) {
  if (Array.isArray(raw)) {
    const fn = map[raw[0]];
    if (fn) {
      return fn(...raw.slice(1), mapStack);
    }
  }
  return raw;
}
