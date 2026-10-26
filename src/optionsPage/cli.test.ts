import { CLI_USAGE, runCli } from './cli';
import type { CliIo } from './cli';

const kits = [{ id: 'win', kit: 'win', tier: 't1', title: 'Win', options: [] }];
const ioWith = (files: Record<string, string>): CliIo & { out: Record<string, string>; logs: string[] } => {
  const out: Record<string, string> = {};
  const logs: string[] = [];
  return {
    out,
    logs,
    read: (path: string): string => {
      const text = files[path];
      if (text === undefined) {
        throw new Error(`ENOENT ${path}`);
      }
      return text;
    },
    write: (path: string, text: string): void => {
      out[path] = text;
    },
    log: (message: string): void => {
      logs.push(message);
    },
  };
};

describe('runCli', () => {
  it('with input and output paths and a game in the JSON, writes the page and returns 0', () => {
    const io = ioWith({ 'in.json': JSON.stringify({ game: 'Surge', kits }) });

    const code = runCli(['in.json', 'out.html'], io);

    expect(code).toBe(0);
    expect(io.out['out.html']).toContain('<h1>Surge Feel Kits</h1>');
  });

  it('with --game, overrides the game in the JSON', () => {
    const io = ioWith({ 'in.json': JSON.stringify({ game: 'Surge', kits }) });

    const code = runCli(['--game', 'Aurora', 'in.json', 'out.html'], io);

    expect(code).toBe(0);
    expect(io.out['out.html']).toContain('<h1>Aurora Feel Kits</h1>');
  });

  it('with one path, prints usage and returns 2', () => {
    const io = ioWith({});

    const code = runCli(['in.json'], io);

    expect(code).toBe(2);
    expect(io.logs).toEqual([CLI_USAGE]);
  });

  it('with --game and no value, prints usage and returns 2', () => {
    const io = ioWith({});

    const code = runCli(['in.json', 'out.html', '--game'], io);

    expect(code).toBe(2);
    expect(io.logs).toEqual([CLI_USAGE]);
  });

  it('with no game anywhere, names what is missing and returns 2', () => {
    const io = ioWith({ 'in.json': JSON.stringify({ kits }) });

    const code = runCli(['in.json', 'out.html'], io);

    expect(code).toBe(2);
    expect(io.logs[0]).toContain('needs "kits" and a game name');
  });

  it('with an unreadable input, logs the error and returns 1', () => {
    const io = ioWith({});

    const code = runCli(['missing.json', 'out.html'], io);

    expect(code).toBe(1);
    expect(io.logs).toEqual(['ENOENT missing.json']);
  });

  it('with a non-Error throw, logs it as text and returns 1', () => {
    const base = ioWith({});
    const io = { ...base, read: (): string => { throw 'boom'; } };

    const code = runCli(['in.json', 'out.html'], io);

    expect(code).toBe(1);
    expect(base.logs).toEqual(['boom']);
  });
});
