import type { KitId } from '../kit/kitId';
import type { RankAxes, RankChain, RankSkip } from '../ranking/rankTypes';

export interface OptionsPageOption {
  readonly key: string;
  readonly name: string;
  readonly line: string;
  readonly params: Readonly<Record<string, number>>;
  readonly reducedMotion: Readonly<Record<string, number>>;
  readonly sound?: string;
}

export interface OptionsPageKit {
  readonly id: string;
  readonly kit: KitId;
  readonly tier: string;
  readonly render?: KitId;
  readonly shape?: string;
  readonly heavy?: boolean;
  readonly title: string;
  readonly today?: string;
  readonly options: readonly OptionsPageOption[];
  readonly todayParams?: Readonly<Record<string, number>>;
}

export interface OptionsPageRanking {
  readonly chain: RankChain;
  readonly skip: RankSkip;
  readonly axes: RankAxes;
}

/** Options page input: kits JSON plus optional page copy (intro paragraphs are trusted HTML). */
export interface OptionsPageInput {
  readonly game: string;
  readonly kits: readonly OptionsPageKit[];
  readonly tag?: string;
  readonly intro?: readonly string[];
  readonly todayLine?: string;
  readonly ranking?: OptionsPageRanking;
  readonly package?: string;
}
