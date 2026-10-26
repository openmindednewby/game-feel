import { KitId } from '../kit/kitId';
import { checkRanking } from '../ranking/checkRanking';
import { buildOptionsPage } from './buildOptionsPage';
import type { OptionsPageKit } from './optionsPageTypes';

const coin: OptionsPageKit = {
  id: 'pickup-t1',
  kit: KitId.Pickup,
  tier: 't1',
  title: 'Gem pickup',
  options: [{ key: 'A', name: 'Settle', line: 'Ticks.', params: { hitstopMs: 0 }, reducedMotion: {} }],
};
const jsonOf = (html: string, id: string): Record<string, unknown> =>
  JSON.parse(html.split(`id="${id}">`)[1]?.split('</script>')[0] ?? '{}') as Record<string, unknown>;

describe('buildOptionsPage', () => {
  it('with kits and a game name, embeds the kits with their renderer and names the game', () => {
    const input = { game: 'Aurora', kits: [coin] };

    const html = buildOptionsPage(input);

    const kits = jsonOf(html, 'kit-options').kits as OptionsPageKit[];
    expect(kits[0]?.render).toBe(KitId.Pickup);
    expect(html).toContain('<h1>Aurora Feel Kits</h1>');
    expect(html).toContain('1 Aurora events. Each has three characters:');
  });

  it('with no ranking given, inlines checkRanking and the default J-3 chain', () => {
    const input = { game: 'Aurora', kits: [coin] };

    const html = buildOptionsPage(input);

    const config = jsonOf(html, 'page-config') as { ranking: { chain: string[][] }; todayLine: string };
    expect(html).toContain(`const rankCheck = (${checkRanking.toString()});`);
    expect(config.ranking.chain[0]).toEqual(['pickup-t1']);
    expect(config.todayLine).toBe('What Aurora plays now.');
  });

  it('with page copy given, uses it and escapes the game name', () => {
    const input = { game: 'A<b>', kits: [{ ...coin, todayParams: { hitstopMs: 0 } }], tag: 'round 1', intro: ['<b>Hi</b>'], todayLine: 'Live.', package: 'x@1' };

    const html = buildOptionsPage(input);

    expect(html).toContain('<h1>A&lt;b&gt; Feel Kits</h1>');
    expect(html).toContain('<p><b>Hi</b></p>');
    expect(html).toContain('<span class="tag">round 1</span>');
    expect(jsonOf(html, 'kit-options').package).toBe('x@1');
  });

  it('with a today feel and no intro, says so in the default intro', () => {
    const input = { game: 'G', kits: [{ ...coin, todayParams: { hitstopMs: 0 } }] };

    const html = buildOptionsPage(input);

    expect(html).toContain('three characters and today');
  });

  it('with a closing script tag inside kit text, escapes it out of the JSON block', () => {
    const kit = { ...coin, title: '</script><i>' };

    const html = buildOptionsPage({ game: 'G', kits: [kit] });

    expect(html).not.toContain('</script><i>');
  });

  it('with a render that has no renderer, throws naming the kit', () => {
    const kit = { ...coin, render: 'teleport' as KitId };

    const build = (): string => buildOptionsPage({ game: 'G', kits: [kit] });

    expect(build).toThrow('pickup-t1: no renderer for "teleport"');
  });
});
