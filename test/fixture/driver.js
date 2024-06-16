'use strict';

const jsdom = require('jsdom');

/**
 * @typedef {import('../../lib/driver').MochifyDriver} MochifyDriver
 */

exports.mochifyDriver = mochifyDriver;

/**
 * @param {Object} opts
 * @param {string} [opts.url]
 * @returns {Promise<MochifyDriver>}
 */
async function mochifyDriver({ url }) {
  const { window } = url
    ? await jsdom.JSDOM.fromURL(url, {
        runScripts: 'dangerously'
      })
    : new jsdom.JSDOM('<!DOCTYPE html>\n<html><body></body></html>', {
        runScripts: 'dangerously',
        url: 'http://localhost/source.js'
      });

  return {
    evaluate(script) {
      return Promise.resolve(window.eval(script));
    },
    end() {
      return Promise.resolve();
    }
  };
}
