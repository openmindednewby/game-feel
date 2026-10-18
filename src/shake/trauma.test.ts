import { Trauma, smoothNoise } from './trauma';

const FRAME = 1 / 60;
const FRAMES = 120;

describe('smoothNoise', () => {
  it('with any time and channel, stays inside [-1, 1]', () => {
    const times = Array.from({ length: 500 }, (_, i) => i * 0.137);

    const values = times.flatMap((t) => [smoothNoise(t, 0), smoothNoise(t, 1), smoothNoise(t, 2)]);

    expect(values.every((v) => v >= -1 && v <= 1)).toBe(true);
  });

  it('just before and at an integer step, gives the same value (continuous)', () => {
    const before = smoothNoise(3 - 1e-9, 1);

    const at = smoothNoise(3, 1);

    expect(at).toBeCloseTo(before, 6);
  });
});

describe('Trauma.add', () => {
  it('with amounts above the cap, clamps the level to 1', () => {
    const trauma = new Trauma();

    trauma.add(5);

    expect(trauma.level).toBe(1);
  });

  it('with a negative amount, never drops below 0', () => {
    const trauma = new Trauma();

    trauma.add(-2);

    expect(trauma.level).toBe(0);
  });

  it('with a custom cap, clamps to that cap', () => {
    const trauma = new Trauma({ cap: 0.4 });

    trauma.add(1);

    expect(trauma.level).toBe(0.4);
  });
});

describe('Trauma.intensity', () => {
  it('with trauma 0.5 and scale 0.5, returns scale x trauma squared', () => {
    const trauma = new Trauma();
    trauma.add(0.5);
    trauma.scale = 0.5;

    const value = trauma.intensity();

    expect(value).toBeCloseTo(0.125);
  });
});

describe('Trauma.offset', () => {
  it('with no trauma, returns a zero offset', () => {
    const trauma = new Trauma();

    const o = trauma.offset(FRAME);

    expect(Math.hypot(o.x, o.y)).toBe(0);
  });

  it('with full trauma, decays the level linearly by dt x decay', () => {
    const trauma = new Trauma({ decay: 2 });
    trauma.add(1);

    trauma.offset(0.1);

    expect(trauma.level).toBeCloseTo(0.8);
  });

  it('with full trauma held, keeps every axis within maxOffset', () => {
    const trauma = new Trauma({ decay: 0, maxOffset: 0.3 });
    trauma.add(1);

    const offsets = Array.from({ length: FRAMES }, () => trauma.offset(FRAME));

    expect(offsets.every((o) => Math.abs(o.x) <= 0.3 && Math.abs(o.y) <= 0.3)).toBe(true);
  });

  it('with full trauma held, changes less than 30% of the peak frame to frame (noise, not jitter)', () => {
    const trauma = new Trauma({ decay: 0 });
    trauma.add(1);

    const xs = Array.from({ length: FRAMES }, () => trauma.offset(FRAME).x);

    const steps = xs.slice(1).map((x, i) => Math.abs(x - (xs[i] as number)));
    expect(Math.max(...steps)).toBeLessThan(0.3 * 0.5);
  });

  it('with the default decay, settles to zero within a second of a full hit', () => {
    const trauma = new Trauma();
    trauma.add(1);

    Array.from({ length: 60 }, () => trauma.offset(FRAME));

    expect(trauma.level).toBe(0);
  });

  it('with scale 0 (reduced motion), returns a zero offset even at full trauma', () => {
    const trauma = new Trauma();
    trauma.add(1);
    trauma.scale = 0;

    const o = trauma.offset(FRAME);

    expect(Math.hypot(o.x, o.y)).toBe(0);
  });
});

describe('Trauma.rotation', () => {
  it('with full trauma held, keeps every angle within maxAngle', () => {
    const trauma = new Trauma({ decay: 0, maxAngle: 0.02, frequency: 8 });
    trauma.add(1);

    const angles = Array.from({ length: FRAMES }, () => trauma.rotation(FRAME));

    expect(angles.every((r) => [r.pitch, r.yaw, r.roll].every((a) => Math.abs(a) <= 0.02))).toBe(true);
  });

  it('with the default max angle, stays within 1.5 degrees', () => {
    const trauma = new Trauma({ decay: 0 });
    trauma.add(1);

    const angles = Array.from({ length: FRAMES }, () => trauma.rotation(FRAME));

    const limit = (1.5 * Math.PI) / 180;
    expect(angles.every((r) => [r.pitch, r.yaw, r.roll].every((a) => Math.abs(a) <= limit))).toBe(true);
  });
});

describe('Trauma.clear', () => {
  it('with trauma present, drops the level to 0', () => {
    const trauma = new Trauma();
    trauma.add(0.7);

    trauma.clear();

    expect(trauma.level).toBe(0);
  });
});
