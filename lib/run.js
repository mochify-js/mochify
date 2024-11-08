'use strict';

const { fromSource, removeComments } = require('convert-source-map');
const { injectScript } = require('./inject-script');
const { stackMapper } = require('./stack-mapper');
const { pollEvents } = require('./poll-events');
const { mochaEventAdapter } = require('./mocha-event-adapter');

/**
 * @typedef {import('mocha').Runner} Runner
 * @typedef {import('./driver').MochifyDriver} MochifyDriver
 */

exports.run = run;

/**
 * @param {MochifyDriver} driver
 * @param {Runner} mocha_runner
 * @param {string} script
 * @returns {Promise<number>}
 */
async function run(driver, mocha_runner, script) {
  let mapStack = null;
  const source_map = fromSource(script);
  if (source_map) {
    mapStack = await stackMapper(source_map.toObject());
    script = removeComments(script);
  }

  await injectScript(driver, script);

  const emit = mochaEventAdapter(mocha_runner, mapStack);
  return pollEvents(driver, emit, mapStack);
}
