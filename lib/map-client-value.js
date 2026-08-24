'use strict';

const { Attr } = require('./dom/attr');
const { Comment } = require('./dom/comment');
const { Element } = require('./dom/element');
const { NamedNodeMap } = require('./dom/named-node-map');
const { NodeList } = require('./dom/node-list');
const { Text } = require('./dom/text');

exports.mapClientValue = mapValue;

/**
 * A value as serialized by the client: the type name, followed by the
 * arguments for the mapper registered under that name.
 *
 * @typedef {[string, ...unknown[]]} SerializedValue
 */

/**
 * The serialized enumerable own properties of an object, array or function as
 * `[name, value]` pairs.
 *
 * @typedef {Array<[string, SerializedValue]>} SerializedEntries
 */

/**
 * The mapped enumerable own properties of an object, array or function.
 *
 * @typedef {Record<string | symbol, unknown>} MappedProperties
 */

/**
 * Any function, regardless of its signature.
 *
 * @typedef {(...args: never[]) => unknown} AnyFunction
 */

/**
 * A function created for a serialized function, with the serialized own
 * properties assigned to it.
 *
 * @typedef {AnyFunction & MappedProperties} MappedFunction
 */

/**
 * Maps a stack trace received from the client back onto the original sources.
 *
 * @typedef {((stack: string) => string) | null | undefined} MapStack
 */

/**
 * @callback FunctionMapper
 * @param {string} name
 * @param {SerializedEntries} keys
 * @param {SerializedEntries} symbols
 * @param {MapStack} mapStack
 * @returns {MappedFunction}
 */

/**
 * @callback ErrorMapper
 * @param {string} message
 * @param {string | undefined} stack
 * @param {SerializedEntries} keys
 * @param {SerializedEntries} symbols
 * @param {MapStack} mapStack
 * @returns {Error}
 */

const map = {
  undefined: () => undefined,
  null: () => null,
  window: () => '[object Window]',
  /** @type {(value: boolean) => boolean} */
  Boolean: (value) => value,
  NaN: () => NaN,
  Infinity: () => Infinity,
  '-Infinity': () => -Infinity,
  /** @type {(value: number) => number} */
  Number: (value) => value,
  /** @type {(value: string) => bigint} */
  BigInt: (value) => BigInt(value),
  /** @type {(value: string) => string} */
  String: (value) => value,
  /** @type {(desc: string | undefined) => symbol} */
  Symbol: (desc) => Symbol(desc),
  /** @type {(ts: number | 'NaN') => Date} */
  Date: (ts) => new Date(ts === 'NaN' ? NaN : ts),
  /** @type {(source: string, flags: string) => RegExp} */
  RegExp: (source, flags) => new RegExp(source, flags),
  /** @type {FunctionMapper} */
  Function: (name, keys, symbols, mapStack) => {
    const fn = function () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  /** @type {FunctionMapper} */
  AsyncFunction: (name, keys, symbols, mapStack) => {
    const fn = async function () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  /** @type {FunctionMapper} */
  GeneratorFunction: (name, keys, symbols, mapStack) => {
    const fn = function* () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  /** @type {FunctionMapper} */
  AsyncGeneratorFunction: (name, keys, symbols, mapStack) => {
    const fn = async function* () {};
    return mapFunction(fn, name, keys, symbols, mapStack);
  },
  /** @type {(name: string, ext?: string) => new () => Object} */
  Class: (name, ext) => {
    if (!ext) {
      return withClassName(class {}, name);
    }
    const base = withClassName(class {}, ext);
    return withClassName(class extends base {}, name);
  },
  Object: mapObject,
  /** @type {(keys: SerializedEntries, symbols: SerializedEntries, mapStack: MapStack) => unknown[] & MappedProperties} */
  Array: (keys, symbols, mapStack) =>
    Object.assign([], mapObject(keys, symbols, mapStack)),
  /** @type {(values: SerializedValue[], mapStack: MapStack) => Set<unknown>} */
  Set: (values, mapStack) => new Set(values.map((v) => mapValue(v, mapStack))),
  /** @type {(values: Array<[SerializedValue, SerializedValue]>, mapStack: MapStack) => Map<unknown, unknown>} */
  Map: (values, mapStack) =>
    new Map(
      values.map(([k, v]) => [mapValue(k, mapStack), mapValue(v, mapStack)])
    ),

  WeakRef: () => new WeakRef({}),
  WeakSet: () => new WeakSet(),
  WeakMap: () => new WeakMap(),
  /** @type {(state: 'pending' | 'fulfilled' | 'rejected', value: SerializedValue | undefined, mapStack: MapStack) => Promise<unknown>} */
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
  /** @type {(path: Array<string | number>) => string} */
  Circular: (path) => `[Circular *${path.join('.')}]`,
  /** @type {(value: unknown) => unknown} */
  Unknown: (value) => value,
  // DOM
  /** @type {(name: string, value: string) => Attr} */
  Attr: (name, value) => new Attr(name, value),
  /** @type {(text: string) => Comment} */
  Comment: (text) => new Comment(text),
  /** @type {(nodes: SerializedValue[]) => NodeList} */
  DocumentFragment: (nodes) => mapNodeList('DocumentFragment', nodes),
  /** @type {(name: string, attrs: Record<string, string>, nodes: SerializedValue[]) => Element} */
  Element: (name, attrs, nodes) =>
    new Element(
      name,
      mapAttributes(attrs),
      nodes.map((n) => mapValue(n))
    ),
  /** @type {(elements: SerializedValue[]) => NodeList} */
  HTMLCollection: (elements) => mapNodeList('HTMLCollection', elements),
  /** @type {(attrs: Record<string, string>) => NamedNodeMap} */
  NamedNodeMap: (atts) => new NamedNodeMap(mapAttributes(atts)),
  /** @type {(nodes: SerializedValue[]) => NodeList} */
  NodeList: (nodes) => mapNodeList('NodeList', nodes),
  /** @type {(text: string) => Text} */
  Text: (text) => new Text(text),
  /** @type {(nodes: SerializedValue[]) => NodeList} */
  ShadowRoot: (nodes) => mapNodeList('ShadowRoot', nodes)
};

/**
 * @param {SerializedEntries} keys
 * @param {SerializedEntries} symbols
 * @param {MapStack} mapStack
 * @returns {MappedProperties}
 */
function mapObject(keys, symbols, mapStack) {
  /** @type {Array<[string | symbol, unknown]>} */
  const entries = mapKeys(keys, mapStack);
  return Object.fromEntries(entries.concat(mapSymbols(symbols, mapStack)));
}

/**
 * @param {SerializedEntries} entries
 * @param {MapStack} mapStack
 * @returns {Array<[string, unknown]>}
 */
function mapKeys(entries, mapStack) {
  return entries.map(([k, v]) => [k, mapValue(v, mapStack)]);
}

/**
 * @param {SerializedEntries} entries
 * @param {MapStack} mapStack
 * @returns {Array<[symbol, unknown]>}
 */
function mapSymbols(entries, mapStack) {
  return entries.map(([key, value]) => [
    Symbol(key),
    mapValue(value, mapStack)
  ]);
}

/**
 * @param {AnyFunction} fn
 * @param {string} name
 * @param {SerializedEntries} keys
 * @param {SerializedEntries} symbols
 * @param {MapStack} mapStack
 * @returns {MappedFunction}
 */
function mapFunction(fn, name, keys, symbols, mapStack) {
  return Object.assign(
    withFunctionName(fn, name),
    mapObject(keys, symbols, mapStack)
  );
}

/**
 * @param {AnyFunction} fn
 * @param {string} name
 * @returns {AnyFunction}
 */
function withFunctionName(fn, name) {
  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}

/**
 * @param {new () => Object} Type
 * @param {string} name
 * @returns {new () => Object}
 */
function withClassName(Type, name) {
  Object.defineProperty(Type, 'name', { value: name });
  return Type;
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
 * @param {SerializedValue[]} nodes
 * @returns {NodeList}
 */
function mapNodeList(type, nodes) {
  return new NodeList(
    type,
    nodes.map((n) => mapValue(n))
  );
}

/**
 * @param {new (message: string) => Error} Type
 * @returns {ErrorMapper}
 */
function errorMapper(Type) {
  return (message, stack, keys, symbols, mapStack) => {
    const error = new Type(message);
    error.stack =
      stack && mapStack
        ? `${Type.name}: ${message}\n${mapStack(stack)}`
        : stack;
    return Object.assign(error, mapObject(keys, symbols, mapStack));
  };
}

/**
 * @param {new (values: number[]) => Object} Type
 * @returns {(values: number[]) => Object}
 */
function typedArrayMapper(Type) {
  return (values) => new Type(values);
}

/**
 * Registers a mapper for a type name that is only known at runtime. A mapper
 * receives the serialized arguments of its type, followed by the stack mapper.
 *
 * @param {string} type
 * @param {AnyFunction} mapper
 * @returns {void}
 */
function register(type, mapper) {
  /** @type {Record<string, AnyFunction>} */ (map)[type] = mapper;
}

for (const Type of [
  Error,
  TypeError,
  RangeError,
  ReferenceError,
  SyntaxError,
  URIError
]) {
  register(Type.name, errorMapper(Type));
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
  register(Type.name, typedArrayMapper(Type));
}

/**
 * @param {unknown} raw
 * @param {MapStack} [mapStack]
 * @returns {unknown}
 */
function mapValue(raw, mapStack) {
  if (Array.isArray(raw)) {
    const [type, ...args] = /** @type {SerializedValue} */ (raw);
    // The client decides which mapper applies. Its arguments cannot be
    // verified statically, so this is the one place where they are widened.
    const mapper =
      /** @type {Record<string, ((...args: unknown[]) => unknown) | undefined>} */ (
        map
      )[type];
    if (mapper) {
      return mapper(...args, mapStack);
    }
  }
  return raw;
}
