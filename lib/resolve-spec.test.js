'use strict';

const fs = require('fs');
const proxyquire = require('proxyquire');
const { assert, refute, sinon } = require('@sinonjs/referee-sinon');

describe('lib/resolve-spec', () => {
  function resolveRequire(glob, pattern) {
    const sut = proxyquire('./resolve-spec', { glob: { glob } });
    return sut.resolveSpec(pattern, []);
  }

  function resolveSpec(glob, pattern) {
    const sut = proxyquire('./resolve-spec', { glob: { glob } });
    return sut.resolveSpec(undefined, pattern);
  }

  context('require', () => {
    it('resolves nothing for undefined', async () => {
      const glob = sinon.fake.resolves(['unexpected.js']);

      const promise = resolveRequire(glob, undefined);

      await assert.resolves(promise, []);
      refute.called(glob);
    });

    it('invokes glob with given string pattern', () => {
      const glob = sinon.fake.returns(sinon.promise());
      const pattern = 'some/*.js';

      resolveRequire(glob, pattern);

      assert.calledOnceWith(glob, pattern);
    });

    it('invokes glob concurrently with patterns from array', () => {
      const glob = sinon.fake.returns(sinon.promise());
      const patterns = ['a/*.js', 'b/*.js', 'c/*.js'];

      resolveRequire(glob, patterns);

      assert.calledThrice(glob);
      assert.calledWith(glob, patterns[0]);
      assert.calledWith(glob, patterns[1]);
      assert.calledWith(glob, patterns[2]);
    });

    it('resolves with the result from a single pattern', async () => {
      const pattern = 'test/**/*.js';
      const matches = ['test/this.js', 'test/that.js'];
      const glob = sinon.fake.resolves(matches);

      const promise = resolveRequire(glob, pattern);

      await assert.resolves(promise, matches); // not sorted
    });

    it('resolves with the result from a pattern array', async () => {
      const patterns = ['a/*.js', 'b/*.js'];
      const matches_a = ['a/this.js', 'a/that.js'];
      const matches_b = ['b/more.js'];
      let calls = 0;
      const glob = sinon.fake(() => {
        switch (++calls) {
          case 1:
            return Promise.resolve(matches_a);
          case 2:
            return Promise.resolve(matches_b);
          default:
            throw new Error(`Unexpected call ${calls}`);
        }
      });

      const promise = resolveRequire(glob, patterns);

      await assert.resolves(promise, matches_a.concat(matches_b)); // not sorted
    });

    it('rejects with error from glob', async () => {
      const patterns = ['a/*.js', 'b/*.js'];
      const matches_a = ['a/this.js', 'a/that.js'];
      const error = new Error('Oh noes!');
      let calls = 0;
      const glob = sinon.fake(() => {
        switch (++calls) {
          case 1:
            return Promise.resolve(matches_a);
          case 2:
            return Promise.reject(error);
          default:
            throw new Error(`Unexpected call ${calls}`);
        }
      });

      const promise = resolveSpec(glob, patterns);

      await assert.rejects(promise, error);
    });
  });

  context('spec', () => {
    it('resolves glob "test/**/*.js" for undefined', async () => {
      const matches = ['test/this.js', 'test/that.js'];
      const glob = sinon.fake.resolves(matches);

      const promise = resolveSpec(glob, undefined);

      await assert.resolves(promise, matches.slice().sort());
      assert.calledOnceWith(glob, 'test/**/*.js');
    });

    it('invokes glob with given string pattern', () => {
      const glob = sinon.fake.returns(sinon.promise());
      const pattern = 'some/*.js';

      resolveSpec(glob, pattern);

      assert.calledOnceWith(glob, pattern);
    });

    it('invokes glob concurrently with patterns from array', () => {
      const glob = sinon.fake.returns(sinon.promise());
      const patterns = ['a/*.js', 'b/*.js', 'c/*.js'];

      resolveSpec(glob, patterns);

      assert.calledThrice(glob);
      assert.calledWith(glob, patterns[0]);
      assert.calledWith(glob, patterns[1]);
      assert.calledWith(glob, patterns[2]);
    });

    it('resolves with the result from a single pattern', async () => {
      const pattern = 'test/**/*.js';
      const matches = ['test/this.js', 'test/that.js'];
      const glob = sinon.fake.resolves(matches);

      const promise = resolveSpec(glob, pattern);

      await assert.resolves(promise, matches.slice().sort());
    });

    it('resolves with the result from a pattern array', async () => {
      const patterns = ['a/*.js', 'b/*.js'];
      const matches_a = ['a/this.js', 'a/that.js'];
      const matches_b = ['b/more.js'];
      let calls = 0;
      const glob = sinon.fake(() => {
        switch (++calls) {
          case 1:
            return Promise.resolve(matches_a);
          case 2:
            return Promise.resolve(matches_b);
          default:
            throw new Error(`Unexpected call ${calls}`);
        }
      });

      const promise = resolveSpec(glob, patterns);

      await assert.resolves(promise, matches_a.concat(matches_b).sort());
    });

    it('rejects with error from glob', async () => {
      const patterns = ['a/*.js', 'b/*.js'];
      const matches_a = ['a/this.js', 'a/that.js'];
      const error = new Error('Oh noes!');
      let calls = 0;
      const glob = sinon.fake(() => {
        switch (++calls) {
          case 1:
            return Promise.resolve(matches_a);
          case 2:
            return Promise.reject(error);
          default:
            throw new Error(`Unexpected call ${calls}`);
        }
      });

      const promise = resolveSpec(glob, patterns);

      await assert.rejects(promise, error);
    });

    it('passes through streams', async () => {
      const stream = fs.createReadStream(__filename);
      const glob = sinon.fake();

      const promise = resolveSpec(glob, stream);

      await assert.resolves(promise, stream);
      refute.called(glob);
    });
  });
});
