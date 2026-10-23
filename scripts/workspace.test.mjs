import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const app = 'apps/avenirs-cofolio-client'
const text = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const json = path => JSON.parse(text(path))
const exists = path => existsSync(new URL(`../${path}`, import.meta.url))

test('app layout preserves its relative tooling paths', () => {
  for (const path of [
    'src/main.ts', 'public', 'tests/utils.ts',
    'a11y/playwright.a11y.config.ts', 'e2e/package.json', 'vite.config.ts',
    'vitest.config.ts', 'orval.config.ts', 'tsconfig.json', 'README.md',
    'scripts/generate-feature.mjs'
  ]) {
    assert.ok(exists(`${app}/${path}`), `Missing ${app}/${path}`)
  }
  assert.equal(json(`${app}/package.json`).name, 'avenirs-cofolio-client')
  assert.equal(json(`${app}/e2e/package.json`).name, 'e2e')
  assert.equal(json(`${app}/e2e/tsconfig.json`).extends, '../tsconfig.json')
  assert.deepEqual(json(`${app}/e2e/tsconfig.json`).compilerOptions.paths['@cofolio/*'], ['../src/*'])
  assert.ok(exists('.github/workflows/pr-workflow.yml'))
  assert.equal(exists(`${app}/.github`), false)
  assert.equal(exists('src'), false)
  assert.equal(exists('a11y'), false)
  assert.equal(exists('e2e'), false)
})

test('relocated generated files and accessibility reports remain ignored', () => {
  for (const path of [
    `${app}/src/api/avenir-esr/generated/types/workspace-probe.ts`,
    `${app}/a11y/reports/workspace-probe.html`,
    `${app}/.env`
  ]) {
    execFileSync('git', ['check-ignore', '--quiet', path], { cwd: root })
  }
})

test('Cofolio generates its API from the shared package contract without a local copy', async () => {
  const shared = json('packages/shared/package.json')
  const subpath = './api/specs/*'
  const specifier = '@avenirs-esr/shared/api/specs/avenir-esr.swagger.json'
  assert.equal(shared.name, '@avenirs-esr/shared')
  assert.equal(shared.private, true)
  assert.equal(shared.exports[subpath], subpath)
  assert.equal(json(`${app}/package.json`).dependencies[shared.name], 'workspace:*')
  const require = createRequire(new URL(`../${app}/package.json`, import.meta.url))
  const resolved = require.resolve(specifier)
  const expected = fileURLToPath(new URL('../packages/shared/api/specs/avenir-esr.swagger.json', import.meta.url))
  assert.equal(realpathSync(resolved), realpathSync(expected))
  assert.equal(JSON.parse(readFileSync(resolved, 'utf8')).openapi, '3.1.0')
  assert.equal(exists(`${app}/api-specs/avenir-esr.swagger.json`), false)
  const { default: config } = await import(new URL(`../${app}/orval.config.ts`, import.meta.url))
  const api = config['avenir-esr']
  assert.equal(realpathSync(api.input.target), realpathSync(expected))
  assert.equal(api.output.workspace, './src/api/avenir-esr/generated')
  assert.equal(api.output.client, 'vue-query')
  assert.deepEqual(api.output.override.mutator, {
    path: './../fetch-instance/fetch-instance.ts',
    name: 'customFetch'
  })
})

test('the Node tooling project type-checks the Orval configuration', () => {
  const require = createRequire(new URL(`../${app}/package.json`, import.meta.url))
  const ts = require('typescript')
  const configFile = fileURLToPath(new URL(`../${app}/tsconfig.node.json`, import.meta.url))
  const orvalFile = fileURLToPath(new URL(`../${app}/orval.config.ts`, import.meta.url))
  const parsed = ts.getParsedCommandLineOfConfigFile(configFile, {}, {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: diagnostic => assert.fail(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
  })
  assert.ok(parsed)
  assert.deepEqual(parsed.errors, [])
  assert.ok(parsed.fileNames.includes(orvalFile), 'Orval must belong to the configured Node tooling project')
  const program = ts.createProgram(parsed.fileNames, parsed.options)
  const diagnostics = ts.getPreEmitDiagnostics(program).map(diagnostic =>
    `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
  )
  assert.deepEqual(diagnostics, [])
})

test('application ignore rules are owned by the application', () => {
  for (const path of [
    `${app}/src/api/avenir-esr/generated/types/workspace-probe.ts`,
    `${app}/a11y/reports/workspace-probe.html`
  ]) {
    const match = execFileSync('git', ['check-ignore', '--verbose', '--no-index', path], {
      cwd: root,
      encoding: 'utf8'
    })
    assert.ok(match.startsWith(`${app}/.gitignore:`), match)
  }
  assert.doesNotMatch(text('.gitignore'), /^!?apps\/avenirs-cofolio-client\/(?:a11y\/reports|src\/api\/)/m)
})

test('workspace includes cofolio nested e2e and an inert config package', () => {
  const yaml = text('pnpm-workspace.yaml')
  for (const entry of ['apps/*', 'apps/avenirs-cofolio-client/e2e', 'packages/*']) {
    assert.ok(yaml.includes(`  - '${entry}'`), `Missing workspace entry ${entry}`)
  }
  assert.deepEqual(json('packages/config/package.json'), {
    name: '@avenirs-esr/config', version: '0.0.0', private: true, type: 'module'
  })
  assert.equal(json('package.json').name, 'avenirs-esr')
  assert.equal(json('package.json').packageManager, 'pnpm@10.34.2')
  assert.equal(json('package.json').private, true)
})

test('root dev runs direct apps in parallel without running packages', () => {
  assert.equal(json('package.json').scripts.dev, "pnpm --parallel --filter './apps/*' run dev")
})

test('workspace owns the Node and minimum pnpm requirements', () => {
  assert.equal(json('package.json').packageManager, 'pnpm@10.34.2')
  assert.deepEqual(json('package.json').engines, {
    node: '>=26.0.0',
    pnpm: '>=10.34.2'
  })
  assert.equal(json(`${app}/package.json`).engines, undefined)
})

test('workspace leaves Node runtime selection to nvm and root engines', () => {
  const workspace = text('pnpm-workspace.yaml')
  assert.doesNotMatch(workspace, /^nodeVersion:/m)
  assert.match(workspace, /^engineStrict: true$/m)
  assert.equal(json('package.json').engines.node, '>=26.0.0')
  assert.equal(text('.nvmrc').trim(), '26')
})

test('root shared commands run direct apps in parallel without running packages', () => {
  const scripts = json('package.json').scripts
  for (const name of [
    'build', 'build-only', 'build:development', 'build-only:development',
    'preview', 'preview:development', 'type-check', 'lint', 'format',
    'test', 'test:unit', 'test:watch', 'test:coverage', 'test:coverage:shard',
    'test:a11y', 'test:a11y:run', 'test:a11y:cleanup'
  ]) {
    assert.equal(scripts[name], `pnpm --parallel --filter './apps/*' run ${name}`)
  }
  assert.equal(scripts['clean:dist'], `pnpm --dir ${app} run clean:dist`)
  assert.equal(scripts['postgenerate:api'], undefined)
})

test('Cofolio owns its generator and E2E commands instead of the workspace root', () => {
  const workspaceScripts = json('package.json').scripts
  const clientScripts = json(`${app}/package.json`).scripts
  for (const name of ['generate:api', 'generate:feature', 'e2e', 'e2e:chrome', 'e2e:install', 'e2e:report']) {
    assert.equal(workspaceScripts[name], undefined, `${name} must not be exposed at root`)
  }
  assert.equal(clientScripts['generate:api'], 'orval')
  assert.equal(clientScripts['generate:feature'], 'node scripts/generate-feature.mjs')
  for (const name of ['e2e', 'e2e:chrome', 'e2e:install', 'e2e:report']) {
    assert.equal(clientScripts[name], `pnpm --dir e2e run ${name}`)
  }
})

test('git tooling belongs to the root and app prepare only generates its API', () => {
  const workspace = json('package.json')
  const client = json(`${app}/package.json`)
  assert.equal(workspace.scripts.prepare, 'husky')
  assert.equal(client.scripts.prepare, 'pnpm run generate:api')
  assert.equal(client.scripts.test, 'pnpm run test:unit')
  assert.equal(client.scripts['postgenerate:api'], 'eslint ./src/api --fix')
  for (const name of ['husky', '@commitlint/cli', '@commitlint/config-conventional', 'lint-staged']) {
    assert.ok(workspace.devDependencies[name])
    assert.equal(client.devDependencies[name], undefined)
  }
  assert.equal(client.devDependencies['vue-component-type-helpers'], '3.3.13')
  assert.equal(client.allowScripts, undefined)
  assert.equal(client['lint-staged'], undefined)
  assert.equal(text('.husky/pre-commit').trim(), 'pnpm run lint-staged')
  assert.equal(text('.husky/commit-msg').trim(), 'pnpm run commitlint "$1"')
})

test('browser suite runners use pnpm without changing package boundaries', () => {
  const scripts = json(`${app}/e2e/package.json`).scripts
  assert.equal(scripts.e2e, 'bddgen && playwright test --config=playwright.config.ts')
  assert.equal(scripts.bddgen, 'bddgen')
  assert.equal(scripts['e2e:chrome'], 'pnpm run e2e --project=chromium --project=mobile-chrome')
  assert.equal(scripts['e2e:desktop:chrome'], 'pnpm run e2e --project=chromium')
  for (const value of Object.values(scripts)) {
    assert.doesNotMatch(value, /\b(?:npm|npx)\b/)
    assert.doesNotMatch(value, /pnpm run \S+ -- /)
  }
  const a11y = text(`${app}/a11y/playwright.a11y.config.ts`)
  assert.ok(a11y.includes("command: 'pnpm run preview:development'"))
  assert.ok(a11y.includes("cwd: '../'"))
  assert.equal(exists(`${app}/a11y/package.json`), false)
  assert.equal(json(`${app}/e2e/package.json`).devDependencies['@playwright/test'], '^1.61.1')
  assert.equal(json(`${app}/package.json`).devDependencies['@playwright/test'], '1.56.1')
})

test('root editor paths target the relocated app', () => {
  const settings = json('.vscode/settings.json')
  assert.deepEqual(settings['i18n-ally.localesPaths'], [
    `${app}/src/locales`,
    `${app}/src/features/student/*/locales`,
    `${app}/src/features/staff/*/locales`
  ])
  assert.deepEqual(settings['cucumberautocomplete.steps'], [
    `${app}/e2e/framework/**/*Page.ts`,
    `${app}/e2e/framework/shared/fixtures/fixtures.ts`,
    `${app}/e2e/framework/**/*.hook.ts`
  ])
  assert.equal(settings['cucumberautocomplete.syncfeatures'], `${app}/e2e/tests/**/*.feature`)
})

test('Node 26 paths avoid inferred pnpm module names', () => {
  for (const config of ['tsconfig.app.json', 'tsconfig.vitest.json']) {
    const { baseUrl, paths } = json(`${app}/${config}`).compilerOptions
    assert.equal(baseUrl, undefined)
    assert.equal(paths['node_modules/*'], undefined)
    assert.deepEqual(paths['node_modules/@avenirs-esr/avenirs-dsav/*'], [
      './node_modules/@avenirs-esr/avenirs-dsav/*'
    ])
    assert.deepEqual(paths['node_modules/vitest/*'], ['./node_modules/vitest/*'])
  }
  assert.equal(json(`${app}/package.json`).devDependencies['@vue/shared'], '3.5.44')
})

test('vite can resolve its explicitly deduplicated vue runtime from the app', () => {
  assert.equal(json(`${app}/package.json`).devDependencies['@vue/runtime-core'], '3.5.44')
})

test('bddgen resolves playwright inside the e2e package instead of the app', () => {
  assert.equal(json(`${app}/e2e/package.json`).devDependencies.playwright, '1.61.1')
})

test('PR CI PNPM callers select feature workflows and application paths', () => {
  const ref = 'build/us-3043-pnpm-monorepo'
  const quality = text('.github/workflows/pr-workflow.yml')
  const e2e = text('.github/workflows/pr-e2e-develop.yaml')
  for (const workflow of ['frontend-quality-check-workflow.yaml', 'a11y-test-and-deploy-reports-workflow.yaml']) {
    assert.ok(quality.includes(`avenirs-esr/avenirs-workflows/.github/workflows/${workflow}@${ref}`))
  }
  assert.equal(quality.split('working-directory: apps/avenirs-cofolio-client').length - 1, 2)
  assert.ok(!quality.includes('package-manager:'))
  assert.ok(quality.includes("build-command: 'pnpm run build-only:development'"))
  assert.ok(e2e.includes(`avenirs-esr/avenirs-workflows/.github/workflows/pr-e2e-frontend-workflow.yaml@${ref}`))
  assert.ok(e2e.includes('working-directory: apps/avenirs-cofolio-client'))
  assert.ok(!e2e.includes('package-manager:'))
  assert.ok(text('.github/workflows/pr-e2e-cleanup.yaml').includes('pr-e2e-cleanup-workflow.yaml@main'))
  assert.ok(text('.github/workflows/deploy-dev-workflow.yaml').includes('deploy-workflow.yaml@main'))
})
