/*globals Mocha, mocha, window, document*/
/*eslint-disable no-var, prefer-arrow-callback, mocha/prefer-arrow-callback,
  object-shorthand, prefer-template*/
'use strict';

var constants = Mocha.Runner.constants;

var error_keys = ['name', 'message', 'stack', 'code', 'operator'];
var error_keys_decircular = ['actual', 'expected'];
var test_keys = [
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

var hasOwnProperty = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

function copy(keys, from, to) {
  keys.forEach(function (key) {
    if (hasOwnProperty.call(from, key)) {
      to[key] = from[key];
    }
  });
}
function copyDecircular(keys, from, to) {
  keys.forEach(function (key) {
    if (hasOwnProperty.call(from, key)) {
      to[key] = decircularCopy(from[key]);
    }
  });
}

var queue = [];

function pollEvents() {
  if (!queue.length) {
    return null;
  }
  var events = queue.slice();
  queue.length = 0;
  return events;
}

function write(event, data) {
  queue.push([event, data]);
}

function getTestData(test) {
  var json = {
    _fullTitle: test.fullTitle(),
    _titlePath: test.titlePath()
  };
  copy(test_keys, test, json);
  return json;
}

function forward(runner, event, processor) {
  runner.on(event, function (object, err) {
    write(event, processor(object, err));
  });
}

function MochifyReporter(runner) {
  var stats = runner.stats;

  forward(runner, constants.EVENT_RUN_BEGIN, function () {
    return {
      start: stats.start.toISOString()
    };
  });

  forward(runner, constants.EVENT_RUN_END, function () {
    return {
      end: stats.end.toISOString(),
      duration: stats.duration
    };
  });

  forward(runner, constants.EVENT_SUITE_BEGIN, function (suite) {
    return {
      root: suite.root,
      title: suite.title,
      pending: suite.pending,
      delayed: suite.delayed
    };
  });

  forward(runner, constants.EVENT_SUITE_END, function () {
    return {};
  });
  forward(runner, constants.EVENT_DELAY_BEGIN, function () {
    return {};
  });
  forward(runner, constants.EVENT_DELAY_END, function () {
    return {};
  });

  forward(runner, constants.EVENT_TEST_PASS, getTestData);
  forward(runner, constants.EVENT_TEST_PENDING, getTestData);
  forward(runner, constants.EVENT_TEST_FAIL, function (test, err) {
    var json = getTestData(test);
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

var chunks = [];
// @ts-ignore
mocha.mochify_receive = function (chunk) {
  chunks.push(chunk);
};
// @ts-ignore
mocha.mochify_run = function () {
  // Inject script
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.textContent = chunks.join('');
  document.body.appendChild(s);
  // Run mocha
  mocha.run(function (failures) {
    // @ts-ignore
    if (typeof __coverage__ !== 'undefined') {
      // @ts-ignore
      write('mochify.coverage', window.__coverage__);
    }
    write('mochify.callback', { code: failures ? 1 : 0 });
  });
};

['debug', 'log', 'info', 'warn', 'error'].forEach(function (name) {
  if (console[name]) {
    console[name] = function () {
      write('console.' + name, slice.call(arguments).map(decircularCopy));
    };
  }
});

window.onerror = function (msg, file, line, column, err) {
  if (err) {
    write('console.error', [err.stack || String(err)]);
  } else {
    write('console.error', [
      msg + '\n    at ' + file + ':' + line + ':' + column
    ]);
  }
};

window.onunhandledrejection = function (event) {
  write('console.error', [
    'Unhandled rejection: ' + event.reason.stack || String(event.reason)
  ]);
};

function decircularCopy(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  return JSON.parse(JSON.stringify(decircular(value)));
}

// Shameless copy of https://github.com/sindresorhus/decircular
// TODO Use the package once codebase is migrated to ES modules
function decircular(object) {
  const seenObjects = new WeakMap();

  function internalDecircular(value, path = []) {
    if (!(value !== null && typeof value === 'object')) {
      return value;
    }

    const existingPath = seenObjects.get(value);
    if (existingPath) {
      return `[Circular *${existingPath.join('.')}]`;
    }

    seenObjects.set(value, path);

    const newValue = Array.isArray(value) ? [] : {};

    for (const [key2, value2] of Object.entries(value)) {
      newValue[key2] = internalDecircular(value2, [...path, key2]);
    }

    seenObjects.delete(value);

    return newValue;
  }

  return internalDecircular(object);
}
