

export const toBigIntBE = (buffer) => {
  const hex = buffer.toString('hex');
  if (hex.length === 0) {
    return BigInt(0);
  }
  return BigInt(`0x${hex}`);
};

export const toBufferBE = (num, width) => {
  const hex = num.toString(16);
  return Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
};
