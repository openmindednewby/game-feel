export interface RankableOption {
  readonly key: string;
  readonly params: Readonly<Record<string, number>>;
}

export interface RankableKit {
  readonly id: string;
  readonly options: readonly RankableOption[];
}

/** Ranked steps, quietest first; event ids in one step share a rank. */
export type RankChain = readonly (readonly string[])[];

/** Per axis, the param names that carry it (the first one an option has wins). */
export type RankAxes = Readonly<Record<string, readonly string[]>>;

/** Per axis, the event ids left out of that axis. */
export type RankSkip = Readonly<Record<string, readonly string[] | undefined>>;

export type RankPicks = Readonly<Record<string, string | undefined>>;

export interface RankedValue {
  readonly id: string;
  readonly key: string;
  readonly value: number;
}

export interface RankBreach {
  readonly axis: string;
  readonly low: RankedValue;
  readonly high: RankedValue;
}
