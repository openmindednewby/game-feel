import { buildOptionsPage } from './buildOptionsPage';
import type { OptionsPageInput } from './optionsPageTypes';

export interface CliIo {
  readonly read: (path: string) => string;
  readonly write: (path: string, text: string) => void;
  readonly log: (message: string) => void;
}

export const CLI_USAGE = 'usage: game-feel-options-page <input.json> <out.html> [--game <name>]';
const EXIT_OK = 0;
const EXIT_FAILED = 1;
const EXIT_USAGE = 2;

/** Reads `{ game?, kits, ... }` JSON, writes the options page; returns the process exit code. */
export function runCli(argv: readonly string[], io: CliIo): number {
  const gameAt = argv.indexOf('--game');
  const game = gameAt >= 0 ? argv[gameAt + 1] : undefined;
  const files = argv.filter((_arg, i) => gameAt < 0 || (i !== gameAt && i !== gameAt + 1));
  const [inputPath, outPath] = files;
  if (inputPath === undefined || outPath === undefined || files.length !== 2 || (gameAt >= 0 && game === undefined)) {
    io.log(CLI_USAGE);
    return EXIT_USAGE;
  }
  try {
    const input = JSON.parse(io.read(inputPath)) as Partial<OptionsPageInput>;
    const name = game ?? input.game;
    if (name === undefined || !Array.isArray(input.kits)) {
      io.log(`${inputPath}: needs "kits" and a game name (--game or "game")`);
      return EXIT_USAGE;
    }
    io.write(outPath, buildOptionsPage({ ...input, kits: input.kits, game: name }));
    io.log(`wrote ${outPath} (${input.kits.length} kits)`);
    return EXIT_OK;
  } catch (error) {
    io.log(error instanceof Error ? error.message : String(error));
    return EXIT_FAILED;
  }
}
