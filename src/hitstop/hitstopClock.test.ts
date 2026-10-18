import { HitstopClock } from './hitstopClock';

describe('HitstopClock.request', () => {
  it('with two overlapping requests, keeps the longest instead of adding them', () => {
    const clock = new HitstopClock();
    clock.request(0.05);

    clock.request(0.02);

    expect(clock.remaining).toBeCloseTo(0.05);
  });

  it('with a request above maxHold, caps it at maxHold', () => {
    const clock = new HitstopClock({ maxHold: 0.08 });

    clock.request(1);

    expect(clock.remaining).toBeCloseTo(0.08);
  });

  it('with the default maxHold, caps a request at 120 ms', () => {
    const clock = new HitstopClock();

    clock.request(1);

    expect(clock.remaining).toBeCloseTo(0.12);
  });

  it('with scale 0 (reduced motion), does not freeze', () => {
    const clock = new HitstopClock();
    clock.scale = 0;

    clock.request(0.1);

    expect(clock.frozen).toBe(false);
  });

  it('with a negative request, does not freeze', () => {
    const clock = new HitstopClock();

    clock.request(-0.1);

    expect(clock.remaining).toBe(0);
  });
});

describe('HitstopClock.advance', () => {
  it('during a freeze, returns 0 sim seconds', () => {
    const clock = new HitstopClock();
    clock.request(0.1);

    const sim = clock.advance(0.016);

    expect(sim).toBe(0);
  });

  it('with a frame that crosses the end of a freeze, returns only the time after it', () => {
    const clock = new HitstopClock();
    clock.request(0.01);

    const sim = clock.advance(0.016);

    expect(sim).toBeCloseTo(0.006);
  });

  it('with no freeze and slow-mo 0.5, returns half the frame', () => {
    const clock = new HitstopClock();
    clock.setSlowMo(0.5);

    const sim = clock.advance(0.02);

    expect(sim).toBeCloseTo(0.01);
  });

  it('after the freeze has run out, reports not frozen', () => {
    const clock = new HitstopClock();
    clock.request(0.03);

    [0.016, 0.016].forEach((dt) => clock.advance(dt));

    expect(clock.frozen).toBe(false);
  });
});

describe('HitstopClock.setSlowMo', () => {
  it('with a scale above 1, clamps to 1', () => {
    const clock = new HitstopClock();

    clock.setSlowMo(3);

    expect(clock.timeScale).toBe(1);
  });

  it('with a negative scale, clamps to 0', () => {
    const clock = new HitstopClock();

    clock.setSlowMo(-1);

    expect(clock.timeScale).toBe(0);
  });
});

describe('HitstopClock.clear', () => {
  it('with a freeze and slow-mo set, resets both', () => {
    const clock = new HitstopClock();
    clock.request(0.1);
    clock.setSlowMo(0.2);

    clock.clear();

    expect([clock.frozen, clock.timeScale]).toEqual([false, 1]);
  });
});
