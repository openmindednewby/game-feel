import { KitId } from '../../kit/kitId';
import { Tier } from '../../kit/tier';
import { PresetKey } from '../presetKey';
import type { EventPresets } from '../presetTypes';

export const PICKUP_PRESETS: readonly EventPresets[] = [
  {
    id: 'pickup-t1',
    kit: KitId.Pickup,
    tier: Tier.Common,
    shape: 'coin',
    options: [
      {
        key: PresetKey.Settle,
        line: 'Ticks in place: short hop in, small pop, four sparks, the counter bumps.',
        params: { magnetMs: 60, magnetMaxTravel: 1, magnetEndScale: 0.9, popPeak: 1.18, popUpMs: 40, popOutMs: 70, soundMs: 120, sparkleCount: 4, sparkleLifeMs: 220, sparkleSize: 0.3, counterTickMs: 60, counterBump: 1.12, counterBumpMs: 120, counterRollMs: 0, flyMs: 0, hapticGapMs: 120, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 0, shakePct: 0, flashMs: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1, popUpMs: 0, popOutMs: 80, counterBump: 1, counterBumpMs: 120, sparkleCount: 1 },
      },
      {
        key: PresetKey.Snap,
        line: 'Fly: the item pops and an icon flies to the counter before it ticks.',
        params: { magnetMs: 45, magnetMaxTravel: 0.8, magnetEndScale: 0.85, popPeak: 1.3, popUpMs: 30, popOutMs: 50, soundMs: 90, sparkleCount: 6, sparkleLifeMs: 180, sparkleSize: 0.35, counterTickMs: 345, counterBump: 1.18, counterBumpMs: 90, counterRollMs: 0, flyMs: 300, hapticGapMs: 80, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 0, shakePct: 0, flashMs: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, popUpMs: 0, popOutMs: 60, counterBump: 1, counterBumpMs: 100, sparkleCount: 2 },
      },
      {
        key: PresetKey.Rush,
        line: 'Ladder (signature): each item in a streak rings one semitone higher, up to +12.',
        params: { magnetMs: 80, magnetMaxTravel: 1.5, magnetEndScale: 0.8, popPeak: 1.38, popUpMs: 50, popOutMs: 80, soundMs: 160, sparkleCount: 8, sparkleLifeMs: 320, sparkleSize: 0.45, counterTickMs: 80, counterBump: 1.22, counterBumpMs: 140, counterRollMs: 240, flyMs: 0, hapticGapMs: 80, streakWindowMs: 500, streakCapSemitones: 12, hitstopMs: 0, shakePct: 0, flashMs: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, popUpMs: 0, popOutMs: 90, counterBump: 1, counterBumpMs: 140, sparkleCount: 2 },
      },
    ],
  },
  {
    id: 'pickup-t2',
    kit: KitId.Pickup,
    tier: Tier.Rare,
    shape: 'shield',
    options: [
      {
        key: PresetKey.Settle,
        line: 'Ticks in place on the counter; one soft shimmer.',
        params: { magnetMs: 70, magnetMaxTravel: 1, magnetEndScale: 0.9, popPeak: 1.32, popUpMs: 45, popOutMs: 80, soundMs: 300, sparkleCount: 8, sparkleLifeMs: 260, sparkleSize: 0.35, counterTickMs: 70, counterBump: 1.2, counterBumpMs: 140, counterRollMs: 0, flyMs: 0, hapticGapMs: 120, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 0, shakePct: 0, flashMs: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1, popUpMs: 0, popOutMs: 90, counterBump: 1, counterBumpMs: 140, sparkleCount: 1 },
      },
      {
        key: PresetKey.Snap,
        line: 'Quick fly, sharp pop, eleven sparks.',
        params: { magnetMs: 50, magnetMaxTravel: 1, magnetEndScale: 0.85, popPeak: 1.42, popUpMs: 35, popOutMs: 60, soundMs: 260, sparkleCount: 10, sparkleLifeMs: 220, sparkleSize: 0.4, counterTickMs: 310, counterBump: 1.25, counterBumpMs: 100, counterRollMs: 0, flyMs: 260, hapticGapMs: 80, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 0, shakePct: 0, flashMs: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, popUpMs: 0, popOutMs: 60, counterBump: 1, counterBumpMs: 100, sparkleCount: 2 },
      },
      {
        key: PresetKey.Rush,
        line: 'Long pull, a slow fly to the counter, the longest shimmer.',
        params: { magnetMs: 90, magnetMaxTravel: 1.5, magnetEndScale: 0.8, popPeak: 1.5, popUpMs: 55, popOutMs: 90, soundMs: 400, sparkleCount: 10, sparkleLifeMs: 380, sparkleSize: 0.5, counterTickMs: 490, counterBump: 1.3, counterBumpMs: 160, counterRollMs: 0, flyMs: 400, hapticGapMs: 80, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 0, shakePct: 0, flashMs: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, popUpMs: 0, popOutMs: 100, counterBump: 1, counterBumpMs: 160, sparkleCount: 3 },
      },
    ],
  },
  {
    id: 'pickup-t3',
    kit: KitId.Pickup,
    tier: Tier.Jackpot,
    shape: 'jackpot',
    options: [
      {
        key: PresetKey.Settle,
        line: 'A 30 ms catch, a local flash, a ring and a roll-up; no shake.',
        params: { magnetMs: 80, magnetMaxTravel: 1.2, magnetEndScale: 0.9, popPeak: 1.42, popUpMs: 50, popOutMs: 90, soundMs: 600, sparkleCount: 14, sparkleLifeMs: 350, sparkleSize: 0.4, counterTickMs: 430, counterBump: 1.2, counterBumpMs: 160, counterRollMs: 450, flyMs: 350, hapticGapMs: 150, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 30, shakePct: 0, flashMs: 50 },
        reducedMotion: { magnetMs: 0, popPeak: 1, popUpMs: 0, popOutMs: 100, counterBump: 1, counterBumpMs: 160, sparkleCount: 3, hitstopMs: 0, shakePct: 0 },
      },
      {
        key: PresetKey.Snap,
        line: 'A 32 ms catch and a faint shake mark the jackpot.',
        params: { magnetMs: 50, magnetMaxTravel: 1, magnetEndScale: 0.85, popPeak: 1.5, popUpMs: 40, popOutMs: 70, soundMs: 500, sparkleCount: 18, sparkleLifeMs: 300, sparkleSize: 0.45, counterTickMs: 330, counterBump: 1.25, counterBumpMs: 120, counterRollMs: 500, flyMs: 280, hapticGapMs: 100, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 32, shakePct: 0.1, flashMs: 40 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, popUpMs: 0, popOutMs: 70, counterBump: 1, counterBumpMs: 120, sparkleCount: 4, hitstopMs: 0, shakePct: 0 },
      },
      {
        key: PresetKey.Rush,
        line: 'Roll-up (signature): the longest count-up and a ring; the rest mid-range.',
        params: { magnetMs: 100, magnetMaxTravel: 1.5, magnetEndScale: 0.8, popPeak: 1.5, popUpMs: 60, popOutMs: 90, soundMs: 600, sparkleCount: 20, sparkleLifeMs: 400, sparkleSize: 0.5, counterTickMs: 480, counterBump: 1.3, counterBumpMs: 160, counterRollMs: 800, flyMs: 380, hapticGapMs: 80, streakWindowMs: 0, streakCapSemitones: 0, hitstopMs: 35, shakePct: 0.15, flashMs: 60 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, popUpMs: 0, popOutMs: 100, counterBump: 1, counterBumpMs: 160, sparkleCount: 6, hitstopMs: 0, shakePct: 0 },
      },
    ],
  },
  {
    id: 'powerup',
    kit: KitId.PowerUp,
    tier: Tier.Common,
    options: [
      {
        key: PresetKey.Settle,
        line: 'Aura builds slowly, no camera kick, a 2 Hz warning blink, a 20 ms catch.',
        params: { magnetMs: 70, popPeak: 1.32, popMs: 110, soundMs: 320, sparkleCount: 12, sparkleLifeMs: 300, auraMs: 220, fovKickDeg: 0, fovKickMs: 0, warnFraction: 0.25, warnBlinkHz: 2, expireSoundMs: 220, auraOutMs: 260, hitstopMs: 20, shakePct: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1, sparkleCount: 2, fovKickDeg: 0, fovKickMs: 0, warnBlinkHz: 0, hitstopMs: 0 },
      },
      {
        key: PresetKey.Snap,
        line: 'Fast aura, a 25 ms catch, a 12° camera kick.',
        params: { magnetMs: 50, popPeak: 1.45, popMs: 80, soundMs: 280, sparkleCount: 13, sparkleLifeMs: 240, auraMs: 140, fovKickDeg: 12, fovKickMs: 180, warnFraction: 0.2, warnBlinkHz: 3, expireSoundMs: 180, auraOutMs: 180, hitstopMs: 25, shakePct: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, sparkleCount: 3, fovKickDeg: 0, fovKickMs: 0, warnBlinkHz: 0, hitstopMs: 0 },
      },
      {
        key: PresetKey.Rush,
        line: 'Kick (signature): a 24° camera kick; the rest mid-range.',
        params: { magnetMs: 90, popPeak: 1.45, popMs: 150, soundMs: 400, sparkleCount: 14, sparkleLifeMs: 350, auraMs: 250, fovKickDeg: 24, fovKickMs: 260, warnFraction: 0.25, warnBlinkHz: 4, expireSoundMs: 300, auraOutMs: 300, hitstopMs: 30, shakePct: 0 },
        reducedMotion: { magnetMs: 0, popPeak: 1.05, sparkleCount: 4, fovKickDeg: 0, fovKickMs: 0, warnBlinkHz: 0, hitstopMs: 0 },
      },
    ],
  },
];
