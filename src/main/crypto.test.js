import { assert, expect } from 'chai';

import { generateSalt, generateSecretKey, getSrpX } from './crypto';
import params from './srpParams';
import { AssertionError } from 'assert';

describe('Crypto methods', () => {
  describe('generateSalt', () => {
    it('should return 16 byte buffer', () => {
      const salt = generateSalt();
      assert.equal(16, salt.length);
    });
  });

  describe('generateSecretKey', () => {
    it('should return 32 byte secret key', () => {
      const secretKey = generateSecretKey();
      assert.equal(32, secretKey.length);
    });
  });

  describe('getSrpX', () => {
    it('should return a BigInt object.', () => {
      const fakeEmail = Buffer.from('phouse512@gmail.com')
      const fakePw = Buffer.from('hello');
      const fakeSalt = Buffer.from('fakeSalt');

      const result = getSrpX(params['2048'], fakeSalt, fakeEmail, fakePw);
      assert.typeOf(result, 'bigint');
    });

    it('should throw error when passed I as string', () => {
      const fakeEmail = 'phouse512@gmail.com';
      const fakePw = Buffer.from('hello');
      const fakeSalt = Buffer.from('fakeSalt');
      const funcCall = () => getSrpX(params['2048'], fakeSalt, fakeEmail, fakePw);

      expect(funcCall).to.throw(AssertionError);
    });

    it('should throw error when passed P as string', () => {
      const fakeEmail = Buffer.from('phouse512@gmail.com');
      const fakePw = 'hello';
      const fakeSalt = Buffer.from('fakeSalt');
      const funcCall = () => getSrpX(params['2048'], fakeSalt, fakeEmail, fakePw);

      expect(funcCall).to.throw(AssertionError);
    });

    it('should throw error when passed salt as string', () => {
      const fakeEmail = Buffer.from('phouse512@gmail.com');
      const fakePw = Buffer.from('hello');
      const fakeSalt = 'fakeSalt';
      const funcCall = () => getSrpX(params['2048'], fakeSalt, fakeEmail, fakePw);

      expect(funcCall).to.throw(AssertionError);
    });

    it('should be idempotent', () => {
      const fakeEmail = Buffer.from('phouse512@gmail.com');
      const fakePw = Buffer.from('hello');
      const fakeSalt = Buffer.from('fakeSalt');
      const firstRun = getSrpX(params['2048'], fakeSalt, fakeEmail, fakePw);

      for(var i = 0; i < 100; i++) {
        assert.strictEqual(firstRun, getSrpX(params['2048'], fakeSalt, fakeEmail, fakePw));
      }
    });
  });
});
