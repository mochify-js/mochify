'use strict';

const { mapClientValue } = require('./map-client-value.js');

/**
 * @typedef {import('./driver').MochifyDriver} MochifyDriver
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
      const events = /** @type {Array<[string, any]>} */ (
        await driver.evaluate('window.mocha.mochify_pollEvents()')
      );
      if (!events) {
        setImmediate(doPoll);
        return;
      }

      for (const [event, data] of events) {
        if (event === 'mochify.callback') {
          resolve(data.code || 0);
          return;
        }
        if (event === 'mochify.coverage') {
          global.__coverage__ = data;
        } else if (event.startsWith('console.')) {
          console[event.substring(8)](
            ...data.map((value) => mapClientValue(value, mapStack))
          );
        } else {
          emit(event, data);
        }
      }

      setImmediate(doPoll);
    }

    doPoll();
  });
}
