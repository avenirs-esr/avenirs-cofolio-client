import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import {
  vueDsfrAutoimportPreset,
  vueDsfrComponentResolver,
} from '@gouvminint/vue-dsfr/meta'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import autoImportConfig from './auto-import-config.json' with { type: 'json' }

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd())
  const isMSWEnabled = mode !== 'production' && env.VITE_ENABLE_MSW === 'true'

  return defineConfig({
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL || 'http://localhost:3000'),
      __ENABLE_MSW__: JSON.stringify(env.VITE_ENABLE_MSW === 'true'),
      __BEARER_TOKEN__: JSON.stringify(`Bearer ${env.VITE_AVENIR_ESR_ACCESS_TOKEN}` ?? 'Bearer token')
    },
    plugins: [
      vue(),
      vueJsx(),
      VueDevTools(),
      AutoImport({
        include: [
          /\.[tj]sx?$/,
          /\.vue$/,
          /\.vue\?vue/,
        ],
        imports: [
          {
            // @ts-expect-error TS2322
            vue: autoImportConfig.vue,
          },
          // @ts-expect-error TS2322
          'vue-router',
          // @ts-expect-error TS2322
          'pinia',
          // @ts-expect-error TS2322
          'vitest',
          // @ts-expect-error TS2322
          vueDsfrAutoimportPreset,
        ],
        vueTemplate: true,
        dts: './src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        extensions: ['vue'],
        dirs: ['src/components'], // Autoimport de vos composants qui sont dans le dossier `src/components`
        include: [/\.vue$/, /\.vue\?vue/],
        dts: './src/components.d.ts',
        resolvers: [
          vueDsfrComponentResolver, // Autoimport des composants de VueDsfr dans les templates
        ],
      }),
      !isMSWEnabled && {
        name: 'ignore-mocks-when-msw-disabled',
        enforce: 'pre',
        resolveId (source) {
          if (source.includes('__mocks__')) {
            return '\0ignore-mock'
          }
          return null
        },
        load (id) {
          if (id === '\0ignore-mock') {
            return `
              export const mockedDeliverablesOverview = null;
              export const mockedStudentLevels = null;
              export const mockedEventsOverview = null;
              export const mockedHeaderOverview = null;
              export const mockedPagesOverview = null;
              export const mockedResumesOverview = null;
              export const mockedTracesOverview = null;
              export default {};
            `
          }
          return null
        }
      }
    ],
    base: process.env.BASE_URL || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      dedupe: ['vue'],
    },
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
        },
        external: id => !isMSWEnabled && id.includes('__mocks__'),
      }
    }
  })
}
