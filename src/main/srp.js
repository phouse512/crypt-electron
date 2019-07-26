const assert = require('assert').strict;
const bigint = require('bigint-buffer');
const bigInt = require('big-integer');
const crypto = require('crypto');

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
  const aNum = bigint.toBigIntBE(secret1);
  const A = bigInt(params.g).modPow(aNum, params.N)
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
  console.log(params.N);
  console.log(params.g);
  const totalLength = params.N_length_bits / 8;
  const N_buf = bigint.toBufferBE(params.N, totalLength);
  const g_buf = bigint.toBufferBE(params.g, 1);


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
  const B_num = bigInt(bigint.toBigIntBE(B));
  const u_num = bigInt(bigint.toBigIntBE(u));
  const a_num = bigInt(bigint.toBigIntBE(a));
  const x_num = bigInt(bigint.toBigIntBE(x));
  const k_num = bigInt(bigint.toBigIntBE(k));

  if (zero.geq(B_num) || N.leq(B_num)) {
    throw new Error('Invalid server-computed B, must be 1..N-1');
  }
  // console.log('a bitlength: ', a_num.bitLength());
  // console.log('x num: ', x_num);
  // console.log('a num: ', a_num)
  // console.log('B Num: ', B_num)
  // console.log('B bitlength: ', B_num.bitLength());
  // console.log('k num: ', k_num);
  // console.log('u num: ', u_num);

  const base = B_num.subtract(k_num.multiply(g.modPow(x_num, N)));
  const power = a_num.add(u_num.multiply(x_num));
  const S_num = euclideanModPow(base, power, N);
  console.log('S num: ', S_num);
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
  const g_buf = bigint.toBufferBE(params.g, 1);
  console.log('g buf: ', g_buf.toString('base64'));
  const N_buf = Buffer.from(params.N.toString(16), 'hex');
  console.log('N buf: ', N_buf.toString('base64'));

  const H_g = crypto.createHash(params.hash).update(g_buf).digest();
  console.log('H(g): ', H_g.toString('base64'));
  const H_N = crypto.createHash(params.hash).update(N_buf).digest();
  console.log('H(N): ', H_N.toString('base64'));
  const N_xor_g = xorBuffer(H_N, H_g);

  console.log('HNxorg: ', N_xor_g.toString('base64'))

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
