import type { ComponentMountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'
import { mount, RouterLinkStub } from '@vue/test-utils'

export async function mountWithRouter<T> (component: Component, options?: ComponentMountingOptions<T>) {
  const wrapper = mount(component, {
    ...options,
    global: {
      ...(options?.global ?? {}),
      stubs: {
        RouterLink: RouterLinkStub,
        RouterView: {
          name: 'RouterView',
          template: '<div class="router-view-stub"><slot /></div>',
        },
        ...(options?.global?.stubs ?? {}),
      },
    },
  })

  await wrapper.vm.$nextTick()
  return wrapper
}
