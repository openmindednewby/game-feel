# Changelog

## 0.4.0

- Shared feel kits across games (FEEL-KIT-1 "Every game event plays its feel kit"): `FEEL_PRESETS` (Settle / Snap / Rush per event class, ported game-neutral from the Surge options, every preset passes `checkKit`), `OWNER_DEFAULT_PICKS` (Settle, Rush for bump and win), `presetConfig`; `checkRanking` (the J-3 cross-kit check) with `DEFAULT_RANK_CHAIN` / `_AXES` / `_SKIP`; `@dloizides/game-feel/options-page` `buildOptionsPage` + the `game-feel-options-page <input.json> <out.html> [--game <name>]` bin: kits JSON in, standalone options page out (A/B/C/Today, phase slow motion, rank strip, artifact-db `picks/<id>`).

## 0.3.0

- Kit phases (FEEL-KIT-1 amendment "Every kit has anticipation, action, follow-through"): `Phase` on every `KIT_RANGES` beat, `playerInput` on `move` and `bump`, `checkKit` / `checkPhases` fail an unphased beat, a player-input action after 0 ms or a player-input anticipation over 33 ms (`PLAYER_INPUT_MAX_ANTICIPATION_MS`); `ScheduledBeat` and `KitCue` (the trace) carry the phase.

## 0.2.0

- `feelKit` module (FEEL-KIT-1 "Every game event plays its feel kit", step 3a): `KIT_RANGES` (pickup, power-up, hit, lock, bump, unlock, death, win, move as data: beat order, per-tier ranges, reduced-motion variant), `checkKit` / `expectKitInRange` / `defineKit` range validation, `playKit` / `KitRun` / `scheduleKit` beat sequencer on the game clock (commit frame 0, `KitMode` full / reduced / off), `FeelTrace` + `exposeFeelTrace` (`window.__feelTrace`, `?feeltrace=1`).

## 0.1.0

- First release (GAME-FEEL-1 "Make games feel well made", phase 2): trauma screenshake with smooth noise and 2D offset or 3D rotation output, a hitstop and slow-mo clock, a reduced-motion and `?juice=0` feel scale, a full-screen flash limiter and coyote / press-buffer timers. Extracted from Surge and Aurora.
