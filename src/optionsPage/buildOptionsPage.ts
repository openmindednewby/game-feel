import { KitId } from '../kit/kitId';
import { checkRanking } from '../ranking/checkRanking';
import { DEFAULT_RANK_AXES, DEFAULT_RANK_CHAIN, DEFAULT_RANK_SKIP } from '../ranking/rankChain';
import pageControls from './assets/page-controls.html.txt';
import pageCss from './assets/page.css.txt';
import pageJs from './assets/page.js.txt';
import type { OptionsPageInput, OptionsPageKit } from './optionsPageTypes';

const FONTS = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';
const RENDERERS: readonly string[] = Object.values(KitId);

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const scriptJson = (value: unknown): string => JSON.stringify(value, null, 1).replace(/</g, '\\u003c');

function withRenderers(kits: readonly OptionsPageKit[]): OptionsPageKit[] {
  return kits.map((kit) => {
    const render = kit.render ?? kit.kit;
    if (!RENDERERS.includes(render)) {
      throw new Error(`${kit.id}: no renderer for "${render}" (use one of ${RENDERERS.join(', ')})`);
    }
    return { ...kit, render };
  });
}

function defaultIntro(input: OptionsPageInput): string[] {
  const today = input.kits.some((kit) => kit.todayParams !== undefined) ? ' and today\'s feel' : '';
  return [
    `${input.kits.length} ${escapeHtml(input.game)} events. Each has three characters${today}: <b>A Settle</b> (calm, short), <b>B Snap</b> (crisp, bright), <b>C Rush</b> (one signature move). Switch letters on a card to compare the same moment, then pick. The rank strip checks the mix: a lower event never freezes, shakes or bursts harder than one ranked above it.`,
    '<b>Phases.</b> Under the Pick button, <b>Before</b> (anticipation), <b>Impact</b> (action) or <b>After</b> (follow-through) loops that phase alone in slow motion (0.25x, 0.1x, 0.5x); the timeline bands mark all three. Player-input events land on the input frame; their anticipation only overlaps it by up to 2 frames.',
  ];
}

function header(input: OptionsPageInput): string {
  const game = escapeHtml(input.game);
  const tag = escapeHtml(input.tag ?? `FEEL-KIT-1 "Every game event plays its feel kit" · ${input.game}`);
  const intro = (input.intro ?? defaultIntro(input)).map((paragraph) => `    <p>${paragraph}</p>`).join('\n');
  return `  <header class="intro">\n    <span class="tag">${tag}</span>\n    <h1>${game} Feel Kits</h1>\n${intro}\n    <p><span class="sim">Preview simulation, not the ${game} build</span></p>\n${pageControls}  </header>`;
}

/** A standalone HTML options page (A/B/C/Today per event, phase slow motion, J-3 rank strip, artifact-db `picks/<id>`). */
export function buildOptionsPage(input: OptionsPageInput): string {
  const kits = withRenderers(input.kits);
  const config = {
    ranking: input.ranking ?? { chain: DEFAULT_RANK_CHAIN, skip: DEFAULT_RANK_SKIP, axes: DEFAULT_RANK_AXES },
    todayLine: input.todayLine ?? `What ${input.game} plays now.`,
  };
  const script = pageJs.replace('__CHECK_RANKING__', () => `(${checkRanking.toString()})`);
  return [
    `<title>${escapeHtml(input.game)} Feel Kits</title>`,
    '<meta name="claude:viewport-fit-sides" content="cover">',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    `<link rel="stylesheet" href="${FONTS}">`,
    `<style>\n${pageCss}</style>`,
    '',
    `<div class="wrap">\n${header(input)}\n  <main id="kits" style="display:grid;gap:20px"></main>\n</div>`,
    '',
    `<script type="application/json" id="kit-options">\n${scriptJson({ package: input.package ?? '@dloizides/game-feel', kits })}\n</script>`,
    `<script type="application/json" id="page-config">\n${scriptJson(config)}\n</script>`,
    `<script>\n${script}</script>`,
    '',
  ].join('\n');
}
