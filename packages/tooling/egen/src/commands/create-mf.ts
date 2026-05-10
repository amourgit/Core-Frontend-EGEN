// ============================================================
// commands/create-mf.ts — Micro-frontend scaffolding
// Generates a new EGEN micro-frontend module.
// Usage: egen create-mf <name> [options]
// ============================================================

import { resolve, join } from 'node:path';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

export interface CreateMfArgs {
  name: string;
  scope?: string;
  template?: 'react' | 'vanilla';
}

export async function runCreateMf(args: CreateMfArgs): Promise<void> {
  const { name, scope = '@egen', template = 'react' } = args;
  const packageName = `${scope}/${name}`;
  const dir = resolve(process.cwd(), name);

  if (existsSync(dir)) {
    console.error(`❌ Directory "${name}" already exists.`);
    process.exit(1);
  }

  mkdirSync(dir, { recursive: true });
  mkdirSync(join(dir, 'src'), { recursive: true });

  // package.json
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    name: packageName,
    version: '1.0.0',
    license: 'MPL-2.0',
    type: 'module',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    scripts: {
      serve: 'egen serve',
      build: 'egen build',
      test: 'vitest run',
    },
    peerDependencies: {
      '@egen/esm-framework': 'workspace:*',
      'react': '18.x',
      'react-dom': '18.x',
    },
    devDependencies: {
      '@egen/esm-framework': 'workspace:*',
      'egen': 'workspace:*',
      'typescript': '^5.8.3',
    },
  }, null, 2));

  // routes.json
  writeFileSync(join(dir, 'routes.json'), JSON.stringify({
    backendDependencies: {},
    extensions: [],
    pages: [],
    modals: [],
    workspaces: [],
  }, null, 2));

  // src/index.ts
  writeFileSync(join(dir, 'src/index.ts'), `import { getAsyncLifecycle } from '@egen/esm-framework';

// ── Module metadata ──────────────────────────────────────────
export const moduleName = '${packageName}';

// ── Lifecycle ─────────────────────────────────────────────────
export function startupApp() {
  // Initialize module here
}

export const routes = require('../routes.json');
`);

  // tsconfig.json
  writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({
    extends: '../../tsconfig.json',
    compilerOptions: { outDir: 'dist' },
    include: ['src'],
  }, null, 2));

  // webpack.config.js
  writeFileSync(join(dir, 'webpack.config.js'), `module.exports = require('egen/default-webpack-config');
`);

  console.log(`✅ Created micro-frontend: ${packageName}`);
  console.log(`   Directory: ${dir}`);
  console.log(`\n   Next steps:`);
  console.log(`   cd ${name}`);
  console.log(`   egen serve`);
}
