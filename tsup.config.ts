import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'options-page': 'src/optionsPage/index.ts',
    'options-page-cli': 'src/optionsPage/bin.ts',
  },
  loader: { '.txt': 'text' },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false,
  treeshake: true,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  external: [],
});
