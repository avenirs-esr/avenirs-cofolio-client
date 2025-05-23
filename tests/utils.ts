import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'

interface MountComposableOptions {
  useTanstack?: boolean
}

function mountComposable<T> (fn: () => T, { useTanstack = false }: MountComposableOptions): T {
  let composableResult: T | undefined
  const app = createApp({
    setup () {
      composableResult = fn()
      return () => null
    }
  })
  const queryClient = new QueryClient()
  if (useTanstack) {
    app.use(VueQueryPlugin, { queryClient })
  }
  app.mount(document.createElement('div'))
  return composableResult as T
}

function mountQueryComposable<T> (fn: () => T): T {
  return mountComposable(fn, { useTanstack: true })
}

export { mountComposable, mountQueryComposable }
