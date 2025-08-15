'use strict';

const { mochify } = require('../../index.js');

/**
 * Public types imported via JSDoc for type checking.
 * These resolve to your built .d.ts under lib/.
 *
 * @typedef {import('../../lib/load-config').MochifyOptions} MochifyOptions
 * @typedef {import('../../lib/driver').MochifyDriver} MochifyDriver
 */

/** @type {MochifyOptions} */
const opts = {
  reporter: 'spec'
  // Add other common consumer options as needed
};

/** @type {MochifyDriver} */
const driver = {
  // We don't actually evaluate; this fixture is for types only.
  // eslint-disable-next-line no-unused-vars
  evaluate(script) {
    return Promise.resolve(undefined);
  },
  end() {
    return Promise.resolve();
  }
};

// Bind mochify's parameter type to fail fast on signature drift.
/** @type {Parameters<typeof mochify>[0]} */
const typedOpts = opts;

async function _smoke() {
  await mochify(typedOpts);
}

module.exports = { driver, _smoke, typedOpts };
