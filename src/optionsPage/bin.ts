#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { runCli } from './cli';

process.exitCode = runCli(process.argv.slice(2), {
  read: (path) => readFileSync(path, 'utf8'),
  write: (path, text) => writeFileSync(path, text, 'utf8'),
  log: (message) => process.stdout.write(`${message}\n`),
});
