'use strict';

const { mapClientValue } = require('./map-client-value.js');

/**
 * @typedef {import('./driver').MochifyDriver} MochifyDriver
 */

/**
 * An event as queued by the client: the event name and its payload.
 *
 * @typedef {[string, unknown]} ClientEvent
 */

exports.pollEvents = pollEvents;

/**
 * @param {MochifyDriver} driver
 * @param {(event: string, data: Object) => void} emit
 * @param {((stack: string) => string) | null} mapStack
 * @returns {Promise<number>}
 */
function pollEvents(driver, emit, mapStack) {
  return new Promise((resolve) => {
    async function doPoll() {
      const events = /** @type {ClientEvent[] | null} */ (
        await driver.evaluate('window.mocha.mochify_pollEvents()')
      );
      if (!events) {
        setImmediate(doPoll);
        return;
      }

      for (const [event, data] of events) {
        if (event === 'mochify.callback') {
          const { code } = /** @type {{ code?: number }} */ (data);
          resolve(code || 0);
          return;
        }
        if (event === 'mochify.coverage') {
          global.__coverage__ = data;
        } else if (event.startsWith('console.')) {
          console[event.substring(8)](
            .../** @type {unknown[]} */ (data).map((value) =>
              mapClientValue(value, mapStack)
            )
          );
        } else {
          emit(event, /** @type {Object} */ (data));
        }
      }

      setImmediate(doPoll);
    }

    doPoll();
  });
}
