import { sanctumGetLSTAPY } from '../../src/sanctum/tools/sanctum_get_lst_apy';

describe('sanctumGetLSTAPY (integration, real API)', () => {
  it('should return APY mapping for real LST symbols', async () => {
    // Use real, known LST symbols registered in Sanctum
    const inputs = ['mSOL', 'bSOL', 'jitoSOL'];
    const result = await sanctumGetLSTAPY(inputs);

    // The result should be an object with numeric APY values for each input
    for (const symbol of inputs) {
      expect(result).toHaveProperty(symbol);
      expect(typeof result[symbol]).toBe('number');
      // Optionally, check that APY is within a reasonable range
      expect(result[symbol]).toBeGreaterThanOrEqual(0);
      expect(result[symbol]).toBeLessThan(1);
    }
    // Optionally log the result for manual inspection
    console.log('Sanctum LST APY result:', result);
  });

  it('should return an empty object or throw for unknown LST symbols', async () => {
    const inputs = ['FAKE_LST_123'];
    try {
      const result = await sanctumGetLSTAPY(inputs);
      // Should not throw, but may return an empty object or missing keys
      expect(result).not.toHaveProperty('FAKE_LST_123');
    } catch (e) {
      // Acceptable if the API throws for unknown LSTs
      expect(e).toBeInstanceOf(Error);
    }
  });
}); 