import { assert, expect } from 'chai';
import crypto from 'crypto';

import {
  computeVerifier,
  decrypt,
  encrypt,
  generateSalt,
  generateSecretKey,
  getSrpX,
} from './crypto';
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
    it('should return a hex object.', () => {
      const fakeEmail = Buffer.from('phouse512@gmail.com')
      const fakePw = Buffer.from('hello');
      const fakeSalt = Buffer.from('fakeSalt');

      const result = getSrpX(params['2048'], fakeSalt, fakeEmail, fakePw);
      assert.typeOf(result, 'string');
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

  // describe('computeVerifier', () => {
  //   const fakeEmail = Buffer.from('phouse512@gmail.com');
  //   const fakePw = Buffer.from('hello');
  //   const fakeSalt = Buffer.from('fakeSalt');
  //   const v = computeVerifier(params['2048'], fakeSalt, fakeEmail, fakePw);
  // });

  describe('encrypt', () => {
    it('should encrypt aes256 gcm and decrypt with same key', () => {
      const fakeKey = Buffer.alloc(32);
      crypto.randomFillSync(fakeKey, 0);
      const fakeData = Buffer.alloc(1024);
      crypto.randomFillSync(fakeData, 0);

      const encResult = encrypt('A256GCM', fakeKey, fakeData);
      const decResult = decrypt('A256GCM', fakeKey, encResult);
      assert.isTrue(fakeData.equals(decResult));
    });

    it('should throw an exception when wrong key used', () => {
      const fakeKey = Buffer.alloc(32);
      crypto.randomFillSync(fakeKey, 0);
      const fakeData = Buffer.alloc(1024);
      crypto.randomFillSync(fakeData, 0);

      const encResult = encrypt('A256GCM', fakeKey, fakeData);
      crypto.randomFillSync(fakeKey, 0);

      const decryptCall = () => decrypt('A256GCM', fakeKey, encResult);
      expect(decryptCall).to.throw(Error);
    });
  });
});
