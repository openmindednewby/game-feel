import { DEFAULT_RANK_AXES } from './rankChain';
import type { RankAxes, RankBreach, RankChain, RankPicks, RankSkip, RankableKit, RankedValue } from './rankTypes';

/** The J-3 check: every pair where a lower chain step out-shouts a higher one; unpicked = A, today (T) unranked. */
export function checkRanking(kits: readonly RankableKit[], picks: RankPicks, chain: RankChain, skip: RankSkip, axes: RankAxes = DEFAULT_RANK_AXES): RankBreach[] {
  const breaches: RankBreach[] = [];
  const valueOf = (id: string, names: readonly string[]): RankedValue | null => {
    const kit = kits.find((candidate) => candidate.id === id);
    const key = picks[id] ?? 'A';
    const option = kit === undefined || key === 'T' ? undefined : kit.options.find((candidate) => candidate.key === key);
    const name = option === undefined ? undefined : names.find((candidate) => candidate in option.params);
    return option === undefined || name === undefined ? null : { id, key, value: Number(option.params[name]) };
  };
  for (const [axis, names] of Object.entries(axes)) {
    const skipped = skip[axis] ?? [];
    const steps = chain.map((ids) => ids.filter((id) => !skipped.includes(id)).map((id) => valueOf(id, names)).filter((v): v is RankedValue => v !== null));
    steps.forEach((lower, i) => steps.slice(i + 1).forEach((higher) => lower.forEach((low) => higher.forEach((high) => {
      if (low.value > high.value) {
        breaches.push({ axis, low, high });
      }
    }))));
  }
  return breaches;
}
