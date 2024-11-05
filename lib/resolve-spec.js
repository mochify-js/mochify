'use strict';

const { glob } = require('glob');

/**
 * @typedef {import('stream').Stream} Stream
 */

exports.resolveSpec = resolveSpec;

/**
 * @param {string | string[]} [require]
 * @param {string | string[] | Stream} [spec]
 * @returns {Promise<string[] | Stream>}
 */
async function resolveSpec(require, spec = 'test/**/*.js') {
  if (typeof spec === 'object' && !Array.isArray(spec)) {
    if (require && require.length) {
      throw new Error('Canot use input stream with require');
    }
    return spec;
  }
  return (require ? await resolve(require) : []).concat(
    (await resolve(spec)).sort()
  );
}

/**
 * @param {string | string[]} spec
 * @returns {Promise<string[]>}
 */
async function resolve(spec) {
  const patterns = Array.isArray(spec) ? spec : [spec];
  const matches = await Promise.all(patterns.map((pattern) => glob(pattern)));
  return matches.reduce((all, match) => all.concat(match), []);
}
