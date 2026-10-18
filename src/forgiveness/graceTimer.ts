export const COYOTE_SECONDS = 0.1;
export const PRESS_BUFFER_SECONDS = 0.12;

/** A window on sim time: arm it, tick it each step, consume it once. */
export class GraceTimer {
  private left = 0;

  constructor(readonly seconds: number) {}

  get active(): boolean {
    return this.left > 0;
  }

  arm(): void {
    this.left = this.seconds;
  }

  tick(dt: number): void {
    this.left = Math.max(0, this.left - dt);
  }

  consume(): boolean {
    const was = this.active;
    this.left = 0;
    return was;
  }

  clear(): void {
    this.left = 0;
  }
}

export interface Forgiveness {
  readonly coyote: GraceTimer;
  readonly buffer: GraceTimer;
}

/** GF-2 + GF-3: a coyote window after leaving a ledge and a press buffer before a jump becomes legal. */
export function createForgiveness(coyote = COYOTE_SECONDS, buffer = PRESS_BUFFER_SECONDS): Forgiveness {
  return { coyote: new GraceTimer(coyote), buffer: new GraceTimer(buffer) };
}
