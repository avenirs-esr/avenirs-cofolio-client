import type { AvRoute } from '@/common/types'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { type ComponentMountingOptions, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
      stubs: {
        RouterLink: {
          name: 'RouterLink',
          props: ['to'],
          template: '<a :href="to" class="router-link-stub"><slot /></a>'
        },
        RouterView: {
          name: 'RouterView',
          template: '<div class="router-view-stub"><slot /></div>'
        },
      },
      ...(options?.global ?? {}),
    },
  })

  await wrapper.vm.$nextTick()
  return wrapper
}

function testRoute (route: AvRoute, expectedConfig: Partial<typeof route>, expectedComponent: unknown) {
  describe(route.name, () => {
    it('should have correct route config', () => {
      expect(route).toMatchObject({ ...expectedConfig, component: expect.any(Function) })
    })

    it('should dynamically import the component and match it', async () => {
      const componentLoader = route.component as () => Promise<{ default: unknown }>
      const componentModule = await componentLoader()
      expect(componentModule).toBeDefined()
      expect(componentModule.default).toBe(expectedComponent)
    })
  })
}

export {
  mountComposable,
  mountQueryComposable,
  mountWithRouter,
  testRoute
}
