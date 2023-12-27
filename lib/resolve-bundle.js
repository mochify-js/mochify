'use strict';

const fs = require('fs').promises;
const execa = require('execa');
const { parseArgsStringToArgv } = require('string-argv');

/**
 * @typedef {import('stream').Stream} Stream
 * @typedef {import('execa').ExecaError} ExecaError
 */

exports.resolveBundle = resolveBundle;

/**
 * @param {string | undefined} command
 * @param {string[] | Stream} resolved_spec
 * @returns {Promise<string>}
 */
async function resolveBundle(command, resolved_spec) {
  if (typeof resolved_spec === 'object' && !Array.isArray(resolved_spec)) {
    return bufferStream(resolved_spec);
  }

  if (!command) {
    return concatFiles(resolved_spec);
  }

  const [cmd, ...args] = parseArgsStringToArgv(command);

  const result = await execa(cmd, args.concat(resolved_spec), {
    preferLocal: true
  });

  if (result.failed || result.killed) {
    throw new Error(/** @type {ExecaError} */ (result).shortMessage);
  }

  return result.stdout;
}

/**
 * @param {string[]} files
 * @returns {Promise<string>}
 */
async function concatFiles(files) {
  const buffers = await Promise.all(files.map((file) => fs.readFile(file)));
  return Buffer.concat(buffers).toString('utf8');
}

/**
 * @param {Stream} stream
 * @returns {Promise<string>}
 */
function bufferStream(stream) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on('data', (chunk) => buffers.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(buffers).toString('utf8')));
  });
}
