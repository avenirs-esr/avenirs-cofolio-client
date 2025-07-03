import { i18n } from '@/plugins/vue-i18n/vue-i18n'
import { QueryClient, type QueryClientConfig, VueQueryPlugin } from '@tanstack/vue-query'
import { type ComponentMountingOptions, mount, RouterLinkStub } from '@vue/test-utils'
import { type Component, createApp } from 'vue'

/**
 * Options permettant de configurer le montage d'un composable en test.
 */
interface MountComposableOptions {
  /**
   * Active l'utilisation de TanStack Query.
   * @default false
   */
  useTanstack?: boolean

  /**
   * Active la configuration du plugin i18n.
   * @default false
   */
  useI18n?: boolean

  /**
   * Active l'utilisation de Pinia pour le store.
   * @default false
   */
  usePinia?: boolean

  /**
   * Configuration personnalisée du QueryClient pour TanStack Query.
   */
  queryClientConfig?: QueryClientConfig
}

/**
 * Monte un composable Vue pour les tests avec options de configuration.
 *
 * @template T
 * @param {() => T} fn - Fonction composable à exécuter et monter.
 * @param {MountComposableOptions} options - Options pour configurer le montage.
 * @param {boolean} [options.useTanstack] - Active l'utilisation de TanStack Query.
 * @param {boolean} [options.useI18n] - Active l'utilisation du plugin i18n.
 * @param {boolean} [options.usePinia] - Active l'utilisation de Pinia pour le store.
 * @param {QueryClientConfig} [options.queryClientConfig] - Configuration personnalisée du QueryClient de TanStack Query.
 * @returns {{ result: T, unmount: () => void }} Objet contenant le résultat du composable et une fonction pour démonter l'application.
 */
function mountComposable<T> (fn: () => T, { useTanstack = false, useI18n = false, usePinia = false, queryClientConfig = {} }: MountComposableOptions): { result: T, unmount: () => void } {
  let composableResult: T | undefined
  const app = createApp({
    setup () {
      composableResult = fn()
      return () => null
    }
  })
  if (useI18n) {
    app.use(i18n)
  }
  if (usePinia) {
    const pinia = createPinia()
    setActivePinia(pinia)
    app.use(pinia)
  }
  const queryClient = new QueryClient(queryClientConfig)
  if (useTanstack) {
    app.use(VueQueryPlugin, { queryClient })
  }
  app.mount(document.createElement('div'))

  return {
    result: composableResult as T,
    unmount: () => app.unmount()
  }
}

/**
 * Monte un composable Vue configuré pour utiliser TanStack Query dans les tests.
 *
 * @template T
 * @param {() => T} fn - Fonction composable à exécuter et monter.
 * @param {QueryClientConfig} [queryClientConfig] - Configuration personnalisée du QueryClient de TanStack Query.
 * @returns {T} Le résultat retourné par le composable monté.
 */
function mountQueryComposable<T> (fn: () => T, queryClientConfig?: QueryClientConfig): T {
  const { result } = mountComposable(fn, { useTanstack: true, queryClientConfig })
  return result
}

/**
 * Monte un composant Vue avec un routeur simulé pour les tests.
 *
 * Cette fonction utilise Vue Test Utils pour monter le composant en injectant
 * des stubs pour `RouterLink` et `RouterView` afin de simuler le comportement
 * du routeur sans lancer une vraie instance.
 *
 * @template T
 * @param {Component} component - Composant Vue à monter.
 * @param {ComponentMountingOptions<T>} [options] - Options additionnelles pour le montage du composant.
 * @returns {Promise<ReturnType<typeof mount>>} Le wrapper du composant monté, après le prochain tick.
 */
async function mountWithRouter<T> (component: Component, options?: ComponentMountingOptions<T>) {
  const wrapper = mount(component, {
    ...options,
    global: {
      ...(options?.global ?? {}),
      stubs: {
        RouterLink: RouterLinkStub,
        RouterView: {
          name: 'RouterView',
          template: '<div class="router-view-stub"><slot /></div>'
        },
        ...(options?.global?.stubs ?? {})
      },
    },
  })

  await wrapper.vm.$nextTick()
  return wrapper
}

export {
  mountComposable,
  mountQueryComposable,
  mountWithRouter,
}
