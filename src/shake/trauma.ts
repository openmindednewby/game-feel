const HASH_I = 127.1;
const HASH_CH = 311.7;
const HASH_K = 43758.5453;
const DEFAULT_CAP = 1;
const DEFAULT_DECAY = 1.5;
const DEFAULT_FREQUENCY = 5;
const DEFAULT_MAX_OFFSET = 0.5;
const DEFAULT_MAX_DEGREES = 1.5;
const RADIANS_PER_DEGREE = Math.PI / 180;
const CHANNEL_X = 0;
const CHANNEL_Y = 1;
const CHANNEL_Z = 2;

export interface TraumaOptions {
  readonly cap?: number;
  readonly decay?: number;
  readonly frequency?: number;
  readonly maxOffset?: number;
  readonly maxAngle?: number;
}

export interface ShakeOffset {
  readonly x: number;
  readonly y: number;
}

export interface ShakeRotation {
  readonly pitch: number;
  readonly yaw: number;
  readonly roll: number;
}

const hash = (i: number, ch: number): number => {
  const s = Math.sin(i * HASH_I + ch * HASH_CH) * HASH_K;
  return (s - Math.floor(s)) * 2 - 1;
};

/** Smooth 1D value noise in [-1, 1] at time t on channel ch. */
export function smoothNoise(t: number, ch: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3 - 2 * f);
  return hash(i, ch) * (1 - u) + hash(i + 1, ch) * u;
}

/** GF-17 trauma shake: hits add trauma up to the cap, it decays linearly, output = max x scale x trauma^2 x smooth noise. */
export class Trauma {
  level = 0;
  scale = 1;
  private t = 0;
  private readonly cap: number;
  private readonly decay: number;
  private readonly frequency: number;
  private readonly maxOffset: number;
  private readonly maxAngle: number;

  constructor(options: TraumaOptions = {}) {
    this.cap = options.cap ?? DEFAULT_CAP;
    this.decay = options.decay ?? DEFAULT_DECAY;
    this.frequency = options.frequency ?? DEFAULT_FREQUENCY;
    this.maxOffset = options.maxOffset ?? DEFAULT_MAX_OFFSET;
    this.maxAngle = options.maxAngle ?? DEFAULT_MAX_DEGREES * RADIANS_PER_DEGREE;
  }

  add(amount: number): void {
    this.level = Math.min(this.cap, Math.max(0, this.level + amount));
  }

  intensity(): number {
    return this.scale * this.level * this.level;
  }

  /** 2D translate output for orthographic or 2D cameras; advances time and decays trauma. */
  offset(dt: number): ShakeOffset {
    const k = this.maxOffset * this.advance(dt);
    const at = this.t * this.frequency;
    return { x: k * smoothNoise(at, CHANNEL_X), y: k * smoothNoise(at, CHANNEL_Y) };
  }

  /** 3D rotate output in radians; advances time and decays trauma. */
  rotation(dt: number): ShakeRotation {
    const k = this.maxAngle * this.advance(dt);
    const at = this.t * this.frequency;
    return { pitch: k * smoothNoise(at, CHANNEL_X), yaw: k * smoothNoise(at, CHANNEL_Y), roll: k * smoothNoise(at, CHANNEL_Z) };
  }

  clear(): void {
    this.level = 0;
  }

  private advance(dt: number): number {
    this.t += dt;
    const k = this.intensity();
    this.level = Math.max(0, this.level - dt * this.decay);
    return k;
  }
}
