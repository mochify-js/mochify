'use strict';

const jsdom = require('jsdom');

/**
 * @typedef {import('../../lib/driver').MochifyDriver} MochifyDriver
 */

exports.mochifyDriver = mochifyDriver;

/**
 * @returns {Promise<MochifyDriver>}
 */
function mochifyDriver() {
  const { window } = new jsdom.JSDOM(
    '<!DOCTYPE html>\n<html><body></body></html>',
    {
      runScripts: 'dangerously'
    }
  );

  return Promise.resolve({
    evaluate(script) {
      return Promise.resolve(window.eval(script));
    },
    end() {
      return Promise.resolve();
    }
  });
}
