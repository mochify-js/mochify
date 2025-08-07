'use strict';

const fs = require('fs').promises;
const { PassThrough } = require('stream');
const { execa } = require('execa');
const { parseArgsStringToArgv } = require('string-argv');

/**
 * @typedef {import('stream').Stream} Stream
 * @typedef {import('execa').ExecaError} ExecaError
 * @typedef {import('./load-config').MochifyOptions} MochifyOptions
 */

exports.resolveBundle = resolveBundle;

/**
 * @param {string | undefined} command
 * @param {string[] | Stream} resolved_spec
 * @param {MochifyOptions} options
 * @returns {Promise<string>}
 */
async function resolveBundle(command, resolved_spec, options) {
  if (typeof resolved_spec === 'object' && !Array.isArray(resolved_spec)) {
    return bufferStream(resolved_spec);
  }

  if (!command) {
    return concatFiles(resolved_spec);
  }

  const [cmd, ...args] = parseArgsStringToArgv(command);

  let result;
  if (options.bundle_stdin) {
    const stdin = new PassThrough();
    switch (options.bundle_stdin) {
      case 'require':
        for (const file of resolved_spec) {
          stdin.write(`require('./${file}');\n`);
        }
        break;
      case 'import':
        for (const file of resolved_spec) {
          stdin.write(`import './${file}';\n`);
        }
        break;
      default:
        throw new Error(`Unknown bundle_stdin option: ${options.bundle_stdin}`);
    }
    stdin.end();
    result = await execa(cmd, args, {
      preferLocal: true,
      input: stdin,
      stderr: process.stderr
    });
  } else {
    result = await execa(cmd, args.concat(resolved_spec), {
      preferLocal: true,
      stderr: process.stderr
    });
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
