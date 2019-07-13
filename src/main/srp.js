const assert = require('assert').strict;
const bigint = require('bigint-buffer');
const bigInt = require('big-integer');

/*
 * genA returns A.
 * @param params: srpParams.js object
 * @param secret1: 32 byte buffer
 */ 
export const genA = (params, secret1) => {
  assert.strictEqual(true, Buffer.isBuffer(secret1));

  // convert secret1 to bignum
  const aNum = bigint.toBigIntLE(secret1);
  const A = bigInt(params.g).modPow(aNum, params.N)
  return A.toString('16');
};
