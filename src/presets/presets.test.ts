import { checkKit } from '../kit/validate';
import { PresetKey } from './presetKey';
import { FEEL_PRESETS, OWNER_DEFAULT_PICKS, presetConfig } from './presets';

describe('FEEL_PRESETS', () => {
  it('for every event and every preset, passes checkKit', () => {
    const configs = FEEL_PRESETS.flatMap((event) => event.options.map((option) => presetConfig(event.id, option.key)));

    const problems = configs.flatMap((config) => (config === undefined ? ['missing'] : checkKit(config)));

    expect(problems).toEqual([]);
  });

  it('for every event, offers Settle, Snap and Rush in that order', () => {
    const expected = [PresetKey.Settle, PresetKey.Snap, PresetKey.Rush];

    const keys = FEEL_PRESETS.map((event) => event.options.map((option) => option.key));

    expect(keys).toEqual(FEEL_PRESETS.map(() => expected));
  });
});

describe('OWNER_DEFAULT_PICKS', () => {
  it('with the recorded owner picks, is Rush for bump and win and Settle elsewhere', () => {
    const rush = ['bump', 'win'];

    const picks = Object.entries(OWNER_DEFAULT_PICKS);

    expect(picks.filter(([, key]) => key === PresetKey.Rush).map(([id]) => id)).toEqual(rush);
    expect(picks.filter(([, key]) => key === PresetKey.Settle)).toHaveLength(FEEL_PRESETS.length - rush.length);
  });
});

describe('presetConfig', () => {
  it('with no key, returns the owner default preset', () => {
    const rush = FEEL_PRESETS.find((event) => event.id === 'win')?.options.find((option) => option.key === PresetKey.Rush);

    const config = presetConfig('win');

    expect(config?.params).toBe(rush?.params);
  });

  it('with an unknown event, returns undefined', () => {
    const eventId = 'not-an-event';

    const config = presetConfig(eventId, PresetKey.Snap);

    expect(config).toBeUndefined();
  });

  it('with an unknown key, returns undefined', () => {
    const key = 'Z' as PresetKey;

    const config = presetConfig('lock', key);

    expect(config).toBeUndefined();
  });

  it('with an unknown event and no key, returns undefined', () => {
    const eventId = 'not-an-event';

    const config = presetConfig(eventId);

    expect(config).toBeUndefined();
  });
});
