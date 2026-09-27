import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  // Dependencies are installed at runtime (native addons such as bcrypt and
  // puppeteer's browser lookup don't survive bundling).
  packages: 'external',
  sourcemap: true,
  logLevel: 'info',
})
