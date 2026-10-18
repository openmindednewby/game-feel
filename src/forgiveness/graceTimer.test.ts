import { COYOTE_SECONDS, GraceTimer, PRESS_BUFFER_SECONDS, createForgiveness } from './graceTimer';

const STEP = 0.02;

const tickFor = (timer: GraceTimer, seconds: number): void => {
  for (let t = 0; t < seconds - 1e-9; t += STEP) {
    timer.tick(STEP);
  }
};

describe('GraceTimer.consume', () => {
  it('with a press 80 ms after leaving a ledge, still allows the jump (coyote)', () => {
    const { coyote } = createForgiveness();
    coyote.arm();
    tickFor(coyote, 0.08);

    const jumps = coyote.consume();

    expect(jumps).toBe(true);
  });

  it('with a press 200 ms after leaving a ledge, refuses the jump', () => {
    const { coyote } = createForgiveness();
    coyote.arm();
    tickFor(coyote, 0.2);

    const jumps = coyote.consume();

    expect(jumps).toBe(false);
  });

  it('with a press 100 ms before landing, fires on the landing step (press buffer)', () => {
    const { buffer } = createForgiveness();
    buffer.arm();
    tickFor(buffer, 0.1);

    const jumps = buffer.consume();

    expect(jumps).toBe(true);
  });

  it('after a consume, refuses a second one', () => {
    const timer = new GraceTimer(0.1);
    timer.arm();
    timer.consume();

    const again = timer.consume();

    expect(again).toBe(false);
  });
});

describe('GraceTimer.clear', () => {
  it('with an armed window, closes it', () => {
    const timer = new GraceTimer(0.1);
    timer.arm();

    timer.clear();

    expect(timer.active).toBe(false);
  });
});

describe('createForgiveness', () => {
  it('with no arguments, uses the 100 ms coyote and 120 ms buffer defaults', () => {
    const defaults = [COYOTE_SECONDS, PRESS_BUFFER_SECONDS];

    const f = createForgiveness();

    expect([f.coyote.seconds, f.buffer.seconds]).toEqual(defaults);
  });

  it('with custom windows, uses them', () => {
    const windows = [0.06, 0.15];

    const f = createForgiveness(0.06, 0.15);

    expect([f.coyote.seconds, f.buffer.seconds]).toEqual(windows);
  });
});
