import { FlashLimiter } from './flashLimiter';

describe('FlashLimiter.request', () => {
  it('with an alpha above 0.35, caps it at 0.35', () => {
    const limiter = new FlashLimiter();

    const alpha = limiter.request(0, 1);

    expect(alpha).toBeCloseTo(0.35);
  });

  it('with a fourth flash inside one second, refuses it', () => {
    const limiter = new FlashLimiter();
    [0, 0.1, 0.2].forEach((t) => limiter.request(t, 0.3));

    const alpha = limiter.request(0.5, 0.3);

    expect(alpha).toBe(0);
  });

  it('with the oldest flash a full second ago, allows the next one', () => {
    const limiter = new FlashLimiter();
    [0, 0.1, 0.2].forEach((t) => limiter.request(t, 0.3));

    const alpha = limiter.request(1, 0.3);

    expect(alpha).toBeCloseTo(0.3);
  });

  it('with scale 0 (reduced motion), returns 0 and does not use up the budget', () => {
    const limiter = new FlashLimiter({ maxPerSecond: 1 });
    limiter.scale = 0;
    limiter.request(0, 0.3);
    limiter.scale = 1;

    const alpha = limiter.request(0.1, 0.3);

    expect(alpha).toBeCloseTo(0.3);
  });

  it('with custom limits, applies them', () => {
    const limiter = new FlashLimiter({ maxPerSecond: 1, alphaCap: 0.2 });
    limiter.request(0, 1);

    const alpha = limiter.request(0.5, 1);

    expect(alpha).toBe(0);
  });
});

describe('FlashLimiter.clear', () => {
  it('with a full budget, frees it', () => {
    const limiter = new FlashLimiter({ maxPerSecond: 1 });
    limiter.request(0, 0.3);
    limiter.clear();

    const alpha = limiter.request(0.1, 0.3);

    expect(alpha).toBeCloseTo(0.3);
  });
});
