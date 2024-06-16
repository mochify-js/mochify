'use strict';

const util = require('util');
const { Syntetic } = require('./syntetic');

class Element extends Syntetic {
  constructor(tag, attrs, nodes) {
    super();
    this.tag = tag;
    this.attrs = attrs;
    this.nodes = nodes;
  }

  toString() {
    return `<${this.tag}${this.attrs.length ? ' ' : ''}${this.attrs.join(
      ' '
    )}>${this.nodes.join('')}</${this.tag}>`;
  }

  [util.inspect.custom](_, opts, inspect) {
    return `${opts.stylize(`<${this.tag}`, 'regexp')}${
      this.attrs.length ? ' ' : ''
    }${this.attrs.map((attr) => inspect(attr, opts)).join(' ')}${opts.stylize(
      `>`,
      'regexp'
    )}${this.nodes.map((node) => inspect(node, opts)).join('')}${opts.stylize(
      `</${this.tag}>`,
      'regexp'
    )}`;
  }
}

exports.Element = Element;
