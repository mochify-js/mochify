'use strict';

const util = require('util');
const { Syntetic } = require('./syntetic');

class NodeList extends Syntetic {
  constructor(type, nodes) {
    super();
    this.type = type;
    this.nodes = nodes;
  }

  toString() {
    return `${this.type} [${this.nodes.join('')}]`;
  }

  [util.inspect.custom](_, opts, inspect) {
    return `${opts.stylize(`${this.type} [`, 'date')}${this.nodes
      .map((node) => inspect(node, opts))
      .join('')}${opts.stylize(`]`, 'date')}`;
  }
}

exports.NodeList = NodeList;
