import { getTopLSTTokens } from '../../src/sanctum/tools/getTopLST';

describe('getTopLSTTokens (integration, real API)', () => {
  it('should return an array of 10 LST tokens with expected properties', async () => {
    const tokens = await getTopLSTTokens();
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBe(10);
    for (const token of tokens) {
      expect(typeof token).toBe('object');
      expect(token).toHaveProperty('address');
      expect(token).toHaveProperty('symbol');
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('decimals');
      expect(token).toHaveProperty('daily_volume');
      expect(typeof token.daily_volume).toBe('number');
    }
  });
});
