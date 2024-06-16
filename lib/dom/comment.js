'use strict';

const util = require('util');
const { Syntetic } = require('./syntetic');

class Comment extends Syntetic {
  constructor(text) {
    super();
    this.text = text;
  }

  toString() {
    return `<!--${this.text}-->`;
  }

  [util.inspect.custom](_, opts) {
    return opts.stylize(this.toString(), 'undefined');
  }
}

exports.Comment = Comment;
