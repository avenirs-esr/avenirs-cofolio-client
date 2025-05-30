import router from '@/router'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { type ComponentMountingOptions, mount } from '@vue/test-utils'
import { type Component, createApp } from 'vue'

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

async function mountWithRouter<T> (component: Component, options?: ComponentMountingOptions<T>) {
  const wrapper = mount(component, {
    ...options,
    global: {
      plugins: [router],
      ...(options?.global ?? {}),
    },
  })

  await wrapper.vm.$nextTick()
  return wrapper
}

export {
  mountComposable,
  mountQueryComposable,
  mountWithRouter
}
