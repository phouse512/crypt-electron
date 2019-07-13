import { assert } from 'chai';
import crypto from 'crypto';

import { genA } from './srp';
import params, { hexToBigInt } from './srpParams';

describe('SRP methods', () => {
  describe('genA', () => {
    it('should return a hex num', () => {
      const randa = Buffer.alloc(32);
      crypto.randomFillSync(randa, 0, 32);

      const result = genA(params['2048'], randa);
      console.log(result);
    });
  });
})