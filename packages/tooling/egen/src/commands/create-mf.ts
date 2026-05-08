// ============================================================
// commands/create-mf.ts — Micro-frontend scaffolding
// Generates a new EIGEN micro-frontend module.
// Usage: igen create-mf <name> [options]
// ============================================================

import { resolve, join } from 'node:path';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

export interface CreateMfArgs {
  name: string;
  scope?: string;
  template?: 'react' | 'vanilla';
}

export async function runCreateMf(args: CreateMfArgs): Promise<void> {
  const { name, scope = '@igen', template = 'react' } = args;
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
      serve: 'igen serve',
      build: 'igen build',
      test: 'vitest run',
    },
    peerDependencies: {
      '@igen/esm-framework': 'workspace:*',
      'react': '18.x',
      'react-dom': '18.x',
    },
    devDependencies: {
      '@igen/esm-framework': 'workspace:*',
      'igen': 'workspace:*',
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
  writeFileSync(join(dir, 'src/index.ts'), `import { getAsyncLifecycle } from '@igen/esm-framework';

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
  writeFileSync(join(dir, 'webpack.config.js'), `module.exports = require('igen/default-webpack-config');
`);

  console.log(\`✅ Created micro-frontend: \${packageName}\`);
  console.log(\`   Directory: \${dir}\`);
  console.log(\`\n   Next steps:\`);
  console.log(\`   cd \${name}\`);
  console.log(\`   igen serve\`);
}
