/*globals Mocha, mocha, window, document*/
'use strict';

const constants = Mocha.Runner.constants;

const error_keys = ['name', 'message', 'stack', 'code', 'operator'];
const error_keys_decircular = ['actual', 'expected'];
const test_keys = [
  'title',
  'type',
  'state',
  'pending',
  'duration',
  'timedOut',
  'speed',
  '_slow',
  '_currentRetry'
];

const hasOwnProperty = Object.prototype.hasOwnProperty;
const slice = Array.prototype.slice;

function copy(keys, from, to) {
  keys.forEach((key) => {
    if (hasOwnProperty.call(from, key)) {
      to[key] = from[key];
    }
  });
}
function copyDecircular(keys, from, to) {
  keys.forEach((key) => {
    if (hasOwnProperty.call(from, key)) {
      to[key] = serializableCopy(from[key]);
    }
  });
}

const queue = [];

function pollEvents() {
  if (!queue.length) {
    return null;
  }
  const events = queue.slice();
  queue.length = 0;
  return events;
}

function write(event, data) {
  queue.push([event, data]);
}

function getTestData(test) {
  const json = {
    _fullTitle: test.fullTitle(),
    _titlePath: test.titlePath()
  };
  copy(test_keys, test, json);
  return json;
}

function forward(runner, event, processor) {
  runner.on(event, (object, err) => {
    write(event, processor(object, err));
  });
}

function MochifyReporter(runner) {
  const stats = runner.stats;

  forward(runner, constants.EVENT_RUN_BEGIN, () => ({
    start: stats.start.toISOString()
  }));

  forward(runner, constants.EVENT_RUN_END, () => ({
    end: stats.end.toISOString(),
    duration: stats.duration
  }));

  forward(runner, constants.EVENT_SUITE_BEGIN, (suite) => ({
    root: suite.root,
    title: suite.title,
    pending: suite.pending,
    delayed: suite.delayed
  }));

  forward(runner, constants.EVENT_SUITE_END, () => ({}));
  forward(runner, constants.EVENT_DELAY_BEGIN, () => ({}));
  forward(runner, constants.EVENT_DELAY_END, () => ({}));

  forward(runner, constants.EVENT_TEST_PASS, getTestData);
  forward(runner, constants.EVENT_TEST_PENDING, getTestData);
  forward(runner, constants.EVENT_TEST_FAIL, (test, err) => {
    const json = getTestData(test);
    json.err = {};
    copy(error_keys, err, json.err);
    copyDecircular(error_keys_decircular, err, json.err);
    return json;
  });
  forward(runner, constants.EVENT_TEST_END, getTestData);
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
  chunks.push(chunk);
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
      write('mochify.coverage', window.__coverage__);
    }
    write('mochify.callback', { code: failures ? 1 : 0 });
  });
};

['debug', 'log', 'info', 'warn', 'error'].forEach((name) => {
  if (console[name]) {
    console[name] = function () {
      write(`console.${name}`, slice.call(arguments).map(serializableCopy));
    };
  }
});

window.onerror = function (msg, file, line, column, err) {
  if (err) {
    write('console.error', [err.stack || String(err)]);
  } else {
    write('console.error', [`${msg} at ${file}:${line}:${column}`]);
  }
};

window.onunhandledrejection = function (event) {
  write('console.error', [
    `Unhandled rejection: ${event.reason.stack || String(event.reason)}`
  ]);
};

function serializableCopy(object) {
  const seen = new WeakMap();

  function internal(value, path = []) {
    if (value === null) {
      return null;
    }
    switch (typeof value) {
      case 'undefined':
        return '[undefined]';
      case 'number':
        if (value === Infinity) {
          return '[Infinity]';
        }
        if (value === -Infinity) {
          return '[-Infinity]';
        }
        if (Number.isNaN(value)) {
          return '[NaN]';
        }
        return value;
      case 'function':
        return `[Function: ${value.name || ''}]`;
      case 'symbol':
        return value.toString();
      case 'object': {
        const existing = seen.get(value);
        if (existing) {
          return `[Circular *${existing.join('.')}]`;
        }
        seen.set(value, path);

        const new_value = Array.isArray(value) ? [] : {};
        for (const [key2, value2] of Object.entries(value)) {
          new_value[key2] = internal(value2, [...path, key2]);
        }
        seen.delete(value);
        return new_value;
      }
      default:
        return value;
    }
  }

  return internal(object);
}
