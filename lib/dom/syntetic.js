'use strict';

class Syntetic {
  get [Symbol.toStringTag]() {
    // All syntetic objects are the same, or mocha won't show a diff.
    // It has to be different from object to enfore toJSON.
    return 'Syntetic';
  }

  toJSON() {
    return this.toString();
  }
}

exports.Syntetic = Syntetic;
