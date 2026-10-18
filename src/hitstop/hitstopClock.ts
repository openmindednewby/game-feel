const DEFAULT_MAX_HOLD = 0.12;

export interface HitstopOptions {
  readonly maxHold?: number;
}

/** GF-16 + GF-5: freezes sim time for hitstop and scales it for slow-mo; the game keeps reading input every frame. */
export class HitstopClock {
  scale = 1;
  private hold = 0;
  private slow = 1;
  private readonly maxHold: number;

  constructor(options: HitstopOptions = {}) {
    this.maxHold = options.maxHold ?? DEFAULT_MAX_HOLD;
  }

  get frozen(): boolean {
    return this.hold > 0;
  }

  get remaining(): number {
    return this.hold;
  }

  get timeScale(): number {
    return this.slow;
  }

  /** Requests a freeze; overlapping requests merge to the longest, never add up. */
  request(seconds: number): void {
    const wanted = Math.min(this.maxHold, Math.max(0, seconds * this.scale));
    this.hold = Math.max(this.hold, wanted);
  }

  setSlowMo(timeScale: number): void {
    this.slow = Math.min(1, Math.max(0, timeScale));
  }

  /** Returns the sim seconds to step for a frame of dt real seconds. */
  advance(dt: number): number {
    const held = Math.min(this.hold, dt);
    this.hold -= held;
    return (dt - held) * this.slow;
  }

  clear(): void {
    this.hold = 0;
    this.slow = 1;
  }
}
