import params, { hexToBigInt } from './srpParams';
import { assert } from 'chai';

describe('srpParams', () => {
  describe('hexToBigInt', () => {
    it('should interpret 02 hex correctly.', () => {
      const result = hexToBigInt('02');
      assert.equal(BigInt(2), result);
    })
  })
})