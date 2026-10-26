export const PresetKey = {
  Settle: 'A',
  Snap: 'B',
  Rush: 'C',
} as const;

export type PresetKey = (typeof PresetKey)[keyof typeof PresetKey];

export const PRESET_NAMES: Readonly<Record<PresetKey, string>> = {
  [PresetKey.Settle]: 'Settle',
  [PresetKey.Snap]: 'Snap',
  [PresetKey.Rush]: 'Rush',
};
