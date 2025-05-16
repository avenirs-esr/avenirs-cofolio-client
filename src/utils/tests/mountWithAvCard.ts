import { type ComponentMountingOptions, mount } from '@vue/test-utils'

const AvCardStub = defineComponent({
  name: 'AvCard',
  props: ['to'],
  template: `
    <div>
      <slot name="title" />
      <slot name="body" />
      <slot />
      <slot name="footer" />
    </div>`,
})

export function mountWithAvCard (component: any, options: ComponentMountingOptions<any> = {}) {
  const mergedOptions: ComponentMountingOptions<any> = {
    ...options,
    global: {
      ...options.global,
      stubs: {
        AvCard: AvCardStub,
        RouterLink: true,
        ...(options.global?.stubs || {}),
      },
    },
  }

  return mount(component, mergedOptions)
}
