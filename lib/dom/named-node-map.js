'use strict';

const util = require('util');
const { Syntetic } = require('./syntetic');

class NamedNodeMap extends Syntetic {
  constructor(attrs) {
    super();
    this.attrs = attrs;
  }

  toString() {
    return `NamedNodeMap [${this.attrs.join(' ')}]`;
  }

  [util.inspect.custom](_, opts, inspect) {
    return `${opts.stylize(`NamedNodeMap [`, 'date')}${this.attrs
      .map((attr) => inspect(attr, opts))
      .join(' ')}${opts.stylize(`]`, 'date')}`;
  }
}

exports.NamedNodeMap = NamedNodeMap;
