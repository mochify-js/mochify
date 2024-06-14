'use strict';

exports.parseClientValue = parseClientValue;

function parseClientValue(value) {
  if (value === null) {
    return null;
  }
  switch (typeof value) {
    case 'string':
      if (value === '[undefined]') {
        return undefined;
      }
      if (value === '[NaN]') {
        return NaN;
      }
      if (value === '[Infinity]') {
        return Infinity;
      }
      if (value === '[-Infinity]') {
        return -Infinity;
      }
      if (value.startsWith('[Function: ')) {
        return makeFunction(value.slice(11, -1));
      }
      if (value.startsWith('Symbol(')) {
        return Symbol(value.slice(7, -1));
      }
      return value;
    case 'object': {
      const new_value = Array.isArray(value) ? [] : {};
      for (const [key, value2] of Object.entries(value)) {
        new_value[key] = parseClientValue(value2);
      }
      return new_value;
    }
    default:
      return value;
  }
}

function makeFunction(name) {
  const fn = function () {};
  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}
