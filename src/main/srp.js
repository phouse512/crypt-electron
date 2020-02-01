const assert = require('assert').strict;
const bigInt = require('big-integer');
const crypto = require('crypto');

import { toBigIntBE, toBufferBE } from './bigint_buffer';
import { hexToBigInt } from './srpParams';

const zero = bigInt(0);

/*
 * genA returns A.
 * @param params: srpParams.js object
 * @param secret1: 32 byte buffer
 * returns: A, as hex
 */ 
export const genA = (params, secret1) => {
  assert.strictEqual(true, Buffer.isBuffer(secret1));

  // convert secret1 to bignum
  const aNum = toBigIntBE(secret1);
  // console.log(typeof params.g);
  // console.log(typeof aNum);
  // console.log(typeof params.N);
  // console.log(typeof (params.g ** aNum));
  // console.log(`aNum inside genA: ${aNum}`);
  // const A = (params.g ** aNum) % params.N;
  const A = euclideanModPow(bigInt(params.g), aNum, params.N);
  // console.log(`ANum inside genA: ${A}`);
  return A.toString('16');
};

/*
 * getu returns u, a hash of A and B
 * @param params: srpParams.js object
 * @param A: Buffer
 * @param B: Buffer
 * returns U as hex of big int
 */
export const getu = (params, A, B) => {
  assert.strictEqual(true, Buffer.isBuffer(A));
  assert.strictEqual(true, Buffer.isBuffer(B));

  const uBuf = crypto.createHash(params.hash)
    .update(A).update(B)
    .digest();
  
  return uBuf.toString('hex');
};

/*
 * getk calculates the SRP6a multiplier.  H(N, g)
 * @param params: srpParams.js object
 */
export const getk = (params) => {
  const totalLength = params.N_length_bits / 8;
  const N_buf = toBufferBE(params.N, totalLength);
  const g_buf = toBufferBE(params.g, 1);


  // const paddedg_buf = Buffer.alloc(totalLength);
  // paddedg_buf.fill(0, 0, padLength);
  // g_buf.copy(paddedg_buf, padLength);
  const paddedg_buf = g_buf;
  const kBuf = crypto.createHash(params.hash)
    .update(N_buf)
    .update(paddedg_buf)
    .digest();

  return kBuf.toString('hex');
};

/*
 * euclideanModPow allows for a pow calculation that is consistent with other platforms.
 * a: big-integer, base
 * b: big-integer, power
 * m: big-integer, mod
 */
const euclideanModPow = (a, b, m) => {
  var x = bigInt(a).modPow(b, m);
  // console.log(`x: ${x.toString(10)}`)
  return x.isNegative() ? x.add(m) : x;
}

/*
 * getS computes S from k, x, a, B, u.
 *  also checks that B is not zero
 * @param params: srpParams.js object
 * @param k: Buffer
 * @param x: Buffer
 * @param a: Buffer
 * @param B: Buffer
 * @param u: Buffer
 */
export const getS = (params, k, x, a, B, u) => {
  const g = bigInt(params.g);
  const N = bigInt(params.N);
  const B_num = bigInt(toBigIntBE(B));
  const u_num = bigInt(toBigIntBE(u));
  const a_num = bigInt(toBigIntBE(a));
  const x_num = bigInt(toBigIntBE(x));
  const k_num = bigInt(toBigIntBE(k));

  if (zero.geq(B_num) || N.leq(B_num)) {
    throw new Error('Invalid server-computed B, must be 1..N-1');
  }

  const base = B_num.subtract(k_num.multiply(euclideanModPow(g, x_num, N)));
  const power = a_num.add(u_num.multiply(x_num));
  const S_num = euclideanModPow(base, power, N);
  return S_num.toString('16');
};

export const getK = (params, S) => {
  const S_buf = Buffer.from(S, 'hex');
  const K_buf = crypto.createHash(params.hash)
    .update(S_buf)
    .digest();

  return K_buf;
};

const xorBuffer = (buf1, buf2) => {
  var length = Math.max(buf1.length, buf2.length);
  var buffer = Buffer.allocUnsafe(length);
  for (var i = 0; i < length; i++) {
    buffer[i] = buf1[i] ^ buf2[i];
  }

  return buffer;
};

export const getM = (params, I, s, A, B, K) => {
  assert.strictEqual(true, Buffer.isBuffer(I));
  assert.strictEqual(true, Buffer.isBuffer(s));
  assert.strictEqual(true, Buffer.isBuffer(A));
  assert.strictEqual(true, Buffer.isBuffer(B));
  assert.strictEqual(true, Buffer.isBuffer(K));

  // H(N) xor H(g) 
  const g_buf = toBufferBE(params.g, 1);
  const N_buf = Buffer.from(params.N.toString(16), 'hex');

  const H_g = crypto.createHash(params.hash).update(g_buf).digest();
  const H_N = crypto.createHash(params.hash).update(N_buf).digest();
  const N_xor_g = xorBuffer(H_N, H_g);

  // H(^ | H(I) | s | A | B | K)
  const H_I = crypto.createHash(params.hash).update(I).digest();
  const M = crypto.createHash(params.hash)
    .update(N_xor_g)
    .update(H_I)
    .update(s)
    .update(A)
    .update(B)
    .update(K)
    .digest();
  return M;
};

export const getHAMK = (params, A_buf, M_buf, K_buf) => {
  assert.strictEqual(true, Buffer.isBuffer(A_buf));
  assert.strictEqual(true, Buffer.isBuffer(M_buf));
  assert.strictEqual(true, Buffer.isBuffer(K_buf));
  const H_AMK = crypto.createHash(params.hash)
    .update(A_buf)
    .update(M_buf)
    .update(K_buf)
    .digest();
  return H_AMK;
};

export const computeVerifier = (params, salt, I, P) => {
  // ASSERT salt, I, P are all buffers
  assert.strictEqual(true, Buffer.isBuffer(salt));
  assert.strictEqual(true, Buffer.isBuffer(I));
  assert.strictEqual(true, Buffer.isBuffer(P));

  // v = g % N
  const x = hexToBigInt(getSrpX(params, salt, I, P));
  const v = euclideanModPow(params.g, x, params.N);

  // returns hex representation of bigint
  return v.toString('16');
};

export const getSrpX = (params, salt, I, P) => {
  // ASSERT salt, I, P are all buffers
  assert.strictEqual(true, Buffer.isBuffer(salt));
  assert.strictEqual(true, Buffer.isBuffer(I));
  assert.strictEqual(true, Buffer.isBuffer(P));

  // = H(I | ":" | P))
  var hashIP = crypto.createHash(params.hash)
    .update(Buffer.concat([I, Buffer.from(':'), P]))
    .digest();
  
  // = H(s | H(I | ":" | P))
  var hashX = crypto.createHash(params.hash)
    .update(salt)
    .update(hashIP)
    .digest();

    return toBigIntBE(hashX).toString('16');
};
