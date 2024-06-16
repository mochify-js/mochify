'use strict';

const { SourceMapGenerator } = require('source-map');

exports.withSourceMaps = withSourceMaps;

/**
 * @param {string} script
 * @returns {string}
 */
function withSourceMaps(script) {
  const map = new SourceMapGenerator();
  const lines = script.split('\n');
  for (let i = 0; i < lines.length; i++) {
    map.addMapping({
      source: 'source.js',
      name: 'myTest',
      generated: { line: i + 1, column: 0 },
      original: { line: i + 40, column: 0 }
    });
  }
  const source_map = map.toString();
  return `${script}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(
    source_map
  ).toString('base64')}`;
}
