# Changelog

## 0.2.0

- `feelKit` module (FEEL-KIT-1 "Every game event plays its feel kit", step 3a): `KIT_RANGES` (pickup, power-up, hit, lock, bump, unlock, death, win, move as data: beat order, per-tier ranges, reduced-motion variant), `checkKit` / `expectKitInRange` / `defineKit` range validation, `playKit` / `KitRun` / `scheduleKit` beat sequencer on the game clock (commit frame 0, `KitMode` full / reduced / off), `FeelTrace` + `exposeFeelTrace` (`window.__feelTrace`, `?feeltrace=1`).

## 0.1.0

- First release (GAME-FEEL-1 "Make games feel well made", phase 2): trauma screenshake with smooth noise and 2D offset or 3D rotation output, a hitstop and slow-mo clock, a reduced-motion and `?juice=0` feel scale, a full-screen flash limiter and coyote / press-buffer timers. Extracted from Surge and Aurora.
