const DEFAULT_MAX_PER_SECOND = 3;
const DEFAULT_ALPHA_CAP = 0.35;
const WINDOW_SECONDS = 1;

export interface FlashLimiterOptions {
  readonly maxPerSecond?: number;
  readonly alphaCap?: number;
}

/** GF-19: caps full-screen flash alpha and allows at most maxPerSecond flashes in any one-second window. */
export class FlashLimiter {
  scale = 1;
  private readonly fired: number[] = [];
  private readonly maxPerSecond: number;
  private readonly alphaCap: number;

  constructor(options: FlashLimiterOptions = {}) {
    this.maxPerSecond = options.maxPerSecond ?? DEFAULT_MAX_PER_SECOND;
    this.alphaCap = options.alphaCap ?? DEFAULT_ALPHA_CAP;
  }

  /** Returns the alpha to draw for a flash asked for at `now` seconds, or 0 when it is refused. */
  request(now: number, alpha: number): number {
    const granted = Math.min(this.alphaCap, alpha) * this.scale;
    if (granted <= 0) {
      return 0;
    }
    this.forget(now);
    if (this.fired.length >= this.maxPerSecond) {
      return 0;
    }
    this.fired.push(now);
    return granted;
  }

  clear(): void {
    this.fired.length = 0;
  }

  private forget(now: number): void {
    for (;;) {
      const first = this.fired[0];
      if (first === undefined || now - first < WINDOW_SECONDS) {
        return;
      }
      this.fired.shift();
    }
  }
}
