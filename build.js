import { build } from 'esbuild'

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  sourcemap: true,
  platform: 'node',
  target: 'esnext'
}).catch(() => process.exit(1))
