'use strict';

const { SourceMapConsumer } = require('source-map');
const { parse } = require('stacktrace-parser');

/**
 * @typedef {import('stacktrace-parser').StackFrame} StackFrame
 */

exports.stackMapper = stackMapper;

/**
 * @param {Object} map
 * @returns {Promise<function(string): string>}
 */
async function stackMapper(map) {
  const consumer = await new SourceMapConsumer(map);
  return (stack) =>
    parse(stack)
      .map((frame) => mapLine(consumer, frame))
      .filter(Boolean)
      .join('\n');
}

/**
 * @param {SourceMapConsumer} consumer
 * @param {StackFrame} frame
 * @returns {string | null}
 */
function mapLine(consumer, frame) {
  const { lineNumber, column, methodName, file } = frame;

  if (lineNumber !== null) {
    const mapped = consumer.originalPositionFor({
      line: lineNumber,
      column: column || 0
    });
    if (mapped.source) {
      return makeLine(
        mapped.name || methodName,
        mapped.source || file,
        mapped.line,
        mapped.column
      );
    }
  }

  return makeLine(methodName, file, lineNumber, column);
}

function makeLine(name, file, line, column) {
  const source = `${file}:${line}${column ? `:${column}` : ''}`;
  return `    at ${name ? `${name} (${source})` : source}`;
}
