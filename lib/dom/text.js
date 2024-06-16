'use strict';

const util = require('util');
const { Syntetic } = require('./syntetic');

class Text extends Syntetic {
  constructor(text) {
    super();
    this.text = text;
  }

  toString() {
    return this.text;
  }

  [util.inspect.custom]() {
    return this.text;
  }
}

exports.Text = Text;
