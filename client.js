/*globals Mocha, mocha, window, document, Attr, Comment, Element,
  DocumentFragment, HTMLCollection, NamedNodeMap, NodeList, Text, ShadowRoot */
'use strict';

const constants = Mocha.Runner.constants;

const MAX_DEPTH = 5;
const { propertyIsEnumerable } = Object.prototype;
const { filter, forEach, map, push, pop, shift, slice } = Array.prototype;

const queue = [];

function pollEvents() {
  if (!queue.length) {
    return null;
  }
  const events = [];
  while (queue.length && queue[0].length !== 3) {
    push.call(events, shift.call(queue));
  }
  return events;
}

function write(event, promise) {
  const entry = [event, null, promise];
  push.call(queue, entry);
  promise.then((data) => {
    entry[1] = data;
    pop.call(entry);
  });
}

function getTestData(test) {
  return {
    type: test.type,
    title: test.title,
    timedOut: test.timedOut,
    pending: test.pending,
    duration: test.duration,
    speed: test.speed,
    state: test.state,
    _fullTitle: test.fullTitle(),
    _titlePath: test.titlePath(),
    _slow: test.slow()
  };
}

function forward(runner, event, processor) {
  runner.on(event, (object, err) => {
    write(event, processor(object, err));
  });
}

function MochifyReporter(runner) {
  const stats = runner.stats;

  forward(runner, constants.EVENT_RUN_BEGIN, () =>
    Promise.resolve({
      start: stats.start.toISOString()
    })
  );

  forward(runner, constants.EVENT_RUN_END, () =>
    Promise.resolve({
      end: stats.end.toISOString(),
      duration: stats.duration
    })
  );

  forward(runner, constants.EVENT_SUITE_BEGIN, (suite) =>
    Promise.resolve({
      root: suite.root,
      title: suite.title,
      pending: suite.pending,
      delayed: suite.delayed
    })
  );

  const resolveEmpty = () => Promise.resolve({});
  forward(runner, constants.EVENT_SUITE_END, resolveEmpty);
  forward(runner, constants.EVENT_DELAY_BEGIN, resolveEmpty);
  forward(runner, constants.EVENT_DELAY_END, resolveEmpty);

  const resolveTestData = (test) => Promise.resolve(getTestData(test));
  forward(runner, constants.EVENT_TEST_PASS, resolveTestData);
  forward(runner, constants.EVENT_TEST_PENDING, resolveTestData);
  forward(runner, constants.EVENT_TEST_FAIL, (test, err) => {
    const json = getTestData(test);
    return new Promise((resolve) => {
      serialize(err).then((serialized) => {
        json.err = serialized;
        resolve(json);
      });
    });
  });
  forward(runner, constants.EVENT_TEST_END, resolveTestData);
}

// @ts-ignore
mocha.reporter(MochifyReporter);
mocha.ui(/* MOCHIFY_UI */);
// @ts-ignore
mocha.timeout(/* MOCHIFY_TIMEOUT */);

// Workaround for https://github.com/mozilla/geckodriver/issues/1798
if (typeof globalThis !== 'undefined' && globalThis !== window) {
  // Register globals on window. Mocha uses globalThis, if defined.
  // @ts-ignore
  window.mocha = mocha;
  mocha.suite.emit('pre-require', window, null, mocha);
}

// @ts-ignore
mocha.mochify_pollEvents = pollEvents;

const chunks = [];
// @ts-ignore
mocha.mochify_receive = function (chunk) {
  push.call(chunks, chunk);
};
// @ts-ignore
mocha.mochify_run = function () {
  // Inject script
  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.textContent = chunks.join('');
  document.body.appendChild(s);
  // Run mocha
  mocha.run((failures) => {
    // @ts-ignore
    if (typeof __coverage__ !== 'undefined') {
      // @ts-ignore
      write('mochify.coverage', Promise.resolve(window.__coverage__));
    }
    write('mochify.callback', Promise.resolve({ code: failures ? 1 : 0 }));
  });
};

['debug', 'log', 'info', 'warn', 'error'].forEach((name) => {
  if (console[name]) {
    console[name] = function () {
      write(
        `console.${name}`,
        Promise.all(map.call(slice.call(arguments), serialize))
      );
    };
  }
});

window.onerror = function (msg, file, line, column, err) {
  if (err) {
    write('console.error', Promise.all([serialize(err)]));
  } else {
    write(
      'console.error',
      Promise.resolve([`${msg} at ${file}:${line}:${column}`])
    );
  }
};

window.onunhandledrejection = function (event) {
  write(
    'console.error',
    Promise.all([
      Promise.resolve('Unhandled rejection'),
      serialize(event.reason)
    ])
  );
};

const function_names = [
  'Function',
  'AsyncFunction',
  'GeneratorFunction',
  'AsyncGeneratorFunction'
];
const weak_refs = ['WeakSet', 'WeakMap', 'WeakRef'];
const array_names = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array'
];
const error_names = [
  'Error',
  'AggregateError',
  'EvalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError'
];

function serialize(input) {
  const seen = new WeakMap();
  return internal(input);

  /* eslint-disable-next-line complexity */
  async function internal(value, path = []) {
    switch (typeof value) {
      case 'undefined':
        return ['undefined'];
      case 'boolean':
        return ['Boolean', value];
      case 'number':
        if (Number.isNaN(value)) {
          return ['NaN'];
        }
        if (value === Infinity) {
          return ['Infinity'];
        }
        if (value === -Infinity) {
          return ['-Infinity'];
        }
        return ['Number', value];
      case 'bigint':
        return ['BigInt', String(value)];
      case 'string':
        return ['String', value];
      case 'symbol':
        return ['Symbol', value.description || ''];
      case 'function': {
        const str = value.toString();
        if (str.startsWith('class ') && str.endsWith('}')) {
          const proto = Object.getPrototypeOf(value);
          if (proto === Function.prototype) {
            return ['Class', value.name || ''];
          }
          return ['Class', value.name || '', proto.name || ''];
        }
        return [
          function_names.includes(value.constructor.name)
            ? value.constructor.name
            : 'Function',
          value.name || '',
          await keys(value, path),
          await symbols(value, path)
        ];
      }
      case 'object': {
        switch (true) {
          case value === null:
            return ['null'];
          case seen.has(value):
            return ['Circular', seen.get(value)];
          case value instanceof Date: {
            const ts = value.getTime();
            return ['Date', Number.isNaN(ts) ? 'NaN' : ts];
          }
          case value instanceof RegExp:
            return ['RegExp', value.source, value.flags];
          case value instanceof Promise: {
            const t = {};
            const [state, result] = await Promise.race([value, t]).then(
              (r) => (r === t ? ['pending'] : ['fulfilled', r]),
              (r) => ['rejected', r]
            );
            if (state === 'pending') {
              return ['Promise', state];
            }
            return ['Promise', state, await internal(result, path)];
          }
          case value instanceof Set:
            return [
              'Set',
              await Promise.all(
                map.call(Array.from(value), (v) => internal(v, path))
              )
            ];
          case value instanceof Map:
            return [
              'Map',
              await Promise.all(
                map.call(Array.from(value), async ([k, v]) => [
                  await internal(k, path),
                  await internal(v, path)
                ])
              )
            ];
          case value instanceof Attr:
            return ['Attr', value.name, value.value];
          case value instanceof Comment:
            return ['Comment', value.data];
          case value instanceof Element:
            return [
              'Element',
              value.nodeName.toLowerCase(),
              nodeMap(value.attributes),
              await nodeList(value.childNodes, [...path, 'childNodes'])
            ];
          case value instanceof ShadowRoot:
            return ['ShadowRoot', await nodeList(value.childNodes, path)];
          case value instanceof DocumentFragment:
            return ['DocumentFragment', await nodeList(value.childNodes, path)];
          case value instanceof HTMLCollection:
            return ['HTMLCollection', await nodeList(value, path)];
          case value instanceof NamedNodeMap:
            return ['NamedNodeMap', nodeMap(value)];
          case value instanceof NodeList:
            return ['NodeList', await nodeList(value, path)];
          case value instanceof Text:
            return ['Text', value.data];
          case value.constructor && weak_refs.includes(value.constructor.name):
            return [value.constructor.name];
          case value.constructor &&
            array_names.includes(value.constructor.name):
            return [value.constructor.name, Array.from(value)];
          default: {
            seen.set(value, path);
            const mapped = [];
            if (Array.isArray(value)) {
              push.call(
                mapped,
                'Array',
                await keys(value, path),
                await symbols(value, path)
              );
            } else if (value instanceof Error) {
              push.call(
                mapped,
                error_names.includes(value.constructor.name)
                  ? value.constructor.name
                  : 'Error',
                value.message,
                value.stack,
                await keys(value, path),
                await symbols(value, path)
              );
            } else {
              push.call(
                mapped,
                'Object',
                await keys(value, path),
                await symbols(value, path)
              );
            }
            seen.delete(value);
            return mapped;
          }
        }
      }
      default:
        return ['Unknown', JSON.parse(JSON.stringify(value))];
    }
  }

  function keys(obj, path) {
    if (path.length > MAX_DEPTH) {
      return Promise.resolve([]);
    }
    return Promise.all(
      map.call(Object.entries(obj), async ([k, v]) => [
        k,
        await internal(v, [...path, k])
      ])
    );
  }

  function symbols(obj, path) {
    if (path.length > MAX_DEPTH) {
      return Promise.resolve([]);
    }
    return Promise.all(
      map.call(
        filter.call(Object.getOwnPropertySymbols(obj), (symbol) =>
          propertyIsEnumerable.call(obj, symbol)
        ),
        async (symbol) => [
          symbol.description || '',
          await internal(obj[symbol], [...path, String(symbol)])
        ]
      )
    );
  }

  function nodeMap(value) {
    const attrs = {};
    forEach.call(Array.from(value), (attr) => {
      attrs[attr.name] = attr.value;
    });
    return attrs;
  }

  function nodeList(value, path) {
    return Promise.all(
      map.call(Array.from(value), (node, i) => internal(node, [...path, i]))
    );
  }
}

/**
 * @returns {string}
 * @this {Object}
 */
function inspect() {
  return this.toString();
}

[
  Attr,
  Comment,
  Element,
  DocumentFragment,
  HTMLCollection,
  NamedNodeMap,
  NodeList
].forEach((Type) => {
  Object.defineProperty(Type.prototype, 'inspect', { value: inspect });
});
