import { generateSalt, generateSecretKey } from './crypto';
import { assert }from 'chai';

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
    })
  })
});
