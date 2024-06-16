'use strict';

const util = require('util');
const { Syntetic } = require('./syntetic');

class Attr extends Syntetic {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }

  toString() {
    return this.value ? `${this.name}="${this.value}"` : this.name;
  }

  [util.inspect.custom](_, opts) {
    return `${opts.stylize(this.name, 'special')}${
      this.value ? opts.stylize(`="${this.value}"`, 'string') : ''
    }`;
  }
}

exports.Attr = Attr;
