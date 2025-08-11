'use strict';

const { inspect } = require('util');
const { assert, sinon } = require('@sinonjs/referee-sinon');
const { PassThrough } = require('stream');
const { Attr } = require('../lib/dom/attr');
const { NamedNodeMap } = require('../lib/dom/named-node-map');
const { Element } = require('../lib/dom/element');
const { NodeList } = require('../lib/dom/node-list');
const { Text } = require('../lib/dom/text');
const { withSourceMaps } = require('./fixture/with-source-maps');
const { mochify } = require('..');
const { Comment } = require('../lib/dom/comment');

describe('console', () => {
  const toString = (value) => inspect(value, { colors: true });

  before(() => {
    process.env.FORCE_COLOR = '1';
  });

  after(() => {
    delete process.env.FORCE_COLOR;
  });

  it('forwards client console invocations', async () => {
    sinon.replace(process.stdout, 'write', sinon.fake());
    const script = new PassThrough();

    const promise = mochify({
      driver: '../test/fixture/driver.js',
      reporter: 'json',
      spec: script
    });

    const map = {
      null: toString(null),
      undefined: toString(undefined),
      true: toString(true),
      false: toString(false),
      42: toString(42),
      '-0': toString(-0),
      NaN: toString(NaN),
      Infinity: toString(Infinity),
      '-Infinity': toString(-Infinity),
      '1n': toString(1n),
      '""': '',
      '"test"': 'test',
      'Symbol("test")': toString(Symbol('test')),
      '/^[a-z]+$/g': toString(/^[a-z]+$/g),
      '{test:1}': toString({ test: 1 }),
      '{test:""}': toString({ test: '' }),
      '{[Symbol("key")]:Symbol("value")}': toString({
        [Symbol('key')]: Symbol('value')
      }),
      /* eslint-disable-next-line no-sparse-arrays */
      '[,1,,2]': toString([, 1, , 2]),
      'Object.assign([1,2],{[Symbol("test")]:42})': toString(
        Object.assign([1, 2], { [Symbol('test')]: 42 })
      ),
      'new Date(12345)': toString(new Date(12345)),
      /* eslint-disable-next-line prefer-arrow-callback, mocha/prefer-arrow-callback */
      'function test(){}': toString(function test() {}),
      /* eslint-disable-next-line prefer-arrow-callback, mocha/prefer-arrow-callback */
      'async function test(){}': toString(async function test() {}),

      'function* test(){}': toString(function* test() {}),

      'async function* test(){}': toString(async function* test() {}),
      '()=>{}': toString(() => {}),
      'Object.assign(function test(){},{[Symbol("test")]:42})': toString(
        /* eslint-disable-next-line prefer-arrow-callback, mocha/prefer-arrow-callback */
        Object.assign(function test() {}, { [Symbol('test')]: 42 })
      ),
      'new Set([1,2])': toString(new Set([1, 2])),
      'new Map([[1,2],[3,4]])': toString(
        new Map([
          [1, 2],
          [3, 4]
        ])
      ),

      'new WeakRef({})': toString(new WeakRef({})),
      'new WeakSet()': toString(new WeakSet()),
      'new WeakMap()': toString(new WeakMap()),
      'new Promise(()=>{})': toString(new Promise(() => {})),
      'Promise.resolve("yes")': toString(Promise.resolve('yes')),
      /* eslint-disable-next-line prefer-promise-reject-errors */
      'Promise.reject("no")': toString(Promise.reject('no')),
      'class {}': toString(class {}),
      'class Test {}': toString(class Test {}),
      'class Test extends Date {}': toString(class Test extends Date {})
    };
    const params = Object.keys(map);
    for (const arg of params) {
      script.push(`console.log(${arg});`);
    }
    script.end();
    await promise;

    const output = process.stdout.write['args'].map((args) => args[0]);
    sinon.restore(); // Restore sandbox here or test output breaks

    assert.equals(output.length, params.length + 1);
    for (let i = 0; i < params.length; i++) {
      assert.equals(output[i], `${map[params[i]]}\n`);
    }
    const json = JSON.parse(output.pop());
    assert.equals(json.tests.length, 0);
  });

  it('forwards client console error messages with mapped stack', async () => {
    const script = new PassThrough();
    script.push(withSourceMaps('\n\nconsole.log(new Error("test"));'));
    script.end();
    sinon.replace(process.stdout, 'write', sinon.fake());

    await mochify({
      driver: '../test/fixture/driver.js',
      reporter: 'json',
      spec: script
    });
    const output = process.stdout.write['args'].map((args) => args[0]);
    sinon.restore(); // Restore sandbox here or test output breaks

    const error_lines = output[0].split('\n');
    assert.equals(error_lines[0], 'Error: test');
    assert.equals(error_lines[1], '    at myTest (source.js:42)');
    const json = JSON.parse(output.pop());
    assert.equals(json.tests.length, 0);
  });

  it('forwards DOM nodes passed to console.log', async () => {
    sinon.replace(process.stdout, 'write', sinon.fake());
    const script = new PassThrough();
    script.push('const div = document.createElement("div");');
    script.push('div.setAttribute("class", "some styling");');
    script.push('div.appendChild(document.createTextNode("some text"));');
    script.push('div.appendChild(document.createComment("oh, hi"));');

    const promise = mochify({
      driver: '../test/fixture/driver.js',
      reporter: 'json',
      spec: script
    });

    const attr = new Attr('class', 'some styling');
    const text = new Text('some text');
    const comment = new Comment('oh, hi');
    const map = {
      'div.childNodes[0]': toString(text),
      'div.childNodes[1]': toString(comment),
      'div.childNodes': toString(new NodeList('NodeList', [text, comment])),
      'div.attributes[0]': toString(attr),
      'div.attributes': toString(new NamedNodeMap([attr])),
      div: toString(new Element('div', [attr], [text, comment]))
    };
    const params = Object.keys(map);
    for (const arg of params) {
      script.push(`console.log(${arg});`);
    }
    script.end();
    await promise;

    const output = process.stdout.write['args'].map((args) => args[0]);
    sinon.restore(); // Restore sandbox here or test output breaks

    assert.equals(output.length, params.length + 1);
    for (let i = 0; i < params.length; i++) {
      // process.stdout.write(output[i]);
      assert.equals(output[i], `${map[params[i]]}\n`);
    }
    const json = JSON.parse(output.pop());
    assert.equals(json.tests.length, 0);
  });
});
