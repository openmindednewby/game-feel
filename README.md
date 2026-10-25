# @dloizides/game-feel

Engine-free game feel for every web game in the fleet. Zero dependencies. Each module returns numbers;
the game applies them to its own camera, clock and overlay, so it works with three, Phaser, Babylon,
canvas or the DOM. Rules come from `BaseClient/docs/code-standards/game-feel.md` (GF-1..GF-45).
Extracted from Surge (`src/trauma.ts`, `src/feelScale.ts`, `src/game/loop.ts`, `src/player*.ts`) and
Aurora (`src/feel/feel.ts`).

```bash
npm install @dloizides/game-feel
```

| Module | Rule | What it does |
|---|---|---|
| `Trauma` | GF-17 | Hits add trauma (cap 1), linear decay, output = max x trauma² x smooth noise. `offset(dt)` for 2D, `rotation(dt)` (≤ 1.5° by default) for 3D cameras. |
| `HitstopClock` | GF-16, GF-5 | `request(s)` freezes sim time (longest wins, capped at 120 ms); `setSlowMo(k)`; `advance(dt)` returns the sim seconds to step. Keep reading input every frame. |
| `feelScale` / `feelScaleFrom` | GF-41, GF-42 | One multiplier set from `prefers-reduced-motion`, `?reducedMotion=1` and `?juice=0`. |
| `FlashLimiter` | GF-19 | Full-screen flash alpha ≤ 0.35, at most 3 per second. |
| `createForgiveness` / `GraceTimer` | GF-2, GF-3 | Coyote window (100 ms) and press buffer (120 ms) on sim time. |

## Usage

```ts
import { FlashLimiter, HitstopClock, Trauma, createForgiveness, feelScaleFrom } from '@dloizides/game-feel';

const feel = feelScaleFrom(window);
const trauma = new Trauma();
const hitstop = new HitstopClock();
const flash = new FlashLimiter();
trauma.scale = feel.shake;
hitstop.scale = feel.hitStop;
flash.scale = feel.flash;
const grace = createForgiveness();

function frame(dt: number, now: number): void {
  readInput();
  const sim = hitstop.advance(dt);
  if (sim > 0) {
    step(sim);
  }
  const r = trauma.rotation(dt);
  camera.rotation.set(base.x + r.pitch, base.y + r.yaw, base.z + r.roll);
}

function onHit(weight: number): void {
  trauma.add(0.3 * weight);
  hitstop.request(0.02 * weight);
  overlay.alpha = flash.request(performance.now() / 1000, 0.3);
}
```

Coyote and buffer: `grace.coyote.arm()` when the player leaves the ground, `grace.buffer.arm()` on a
jump press, `tick(simDt)` both every sim step, and jump when `grounded && grace.buffer.consume()` or
`pressed && grace.coyote.consume()`.

## Feel kits (FEEL-KIT-1 "Every game event plays its feel kit")

`KIT_RANGES` holds every kit of `BaseClient/docs/code-standards/feel-kits.md` as data: ordered beats,
allowed ranges per tier (`Tier.Common` / `Rare` / `Jackpot`; for `hit` Common = light, Rare = heavy)
and a reduced-motion variant. `defineKit` rejects a game's kit config with any missing, unknown or
out-of-range value; `expectKitInRange` is the same check for a unit test.

```ts
import { FeelTrace, KitId, Tier, defineKit, exposeFeelTrace, feelTraceRequested, kitModeFrom, playKit } from '@dloizides/game-feel';

const coin = defineKit({ kit: KitId.Pickup, tier: Tier.Common, params: COIN_PARAMS, reducedMotion: COIN_RM });
const trace = new FeelTrace();
if (feelTraceRequested(location.search)) {
  exposeFeelTrace(trace, window as unknown as Record<string, unknown>);
}
const mode = kitModeFrom({ search: location.search, prefersReducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });

function onCoin(nowMs: number): void {
  coins += 1;
  runs.push(playKit(coin, { trace, onBeat: (cue) => fx.play(cue) }, nowMs, mode));
}
```

Commit and every 0 ms beat fire inside `playKit`; call `run.advance(nowMs)` each frame for the rest.
`?juice=0` (`KitMode.Off`) plays only the commit. Each cue (`{kit, tier, mode, beat, scheduledMs,
tMs, durationMs, params}`) lands in the trace, exposed as `window.__feelTrace` under `?feeltrace=1`.

## Scripts

`npm run lint` · `npm run typecheck` · `npm test` · `npm run test:coverage` (100% threshold) ·
`npm run build`. Publish only with `./publish.ps1 -Bump <patch|minor> -SkipShowcase` (not a `ui-*`
package, so there is no showcase story).

## License

MIT
