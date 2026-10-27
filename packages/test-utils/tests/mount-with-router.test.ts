import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { App } from 'vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from '@avenirs-esr/test-utils/unit'
import { enableAutoUnmount, RouterLinkStub } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { defineComponent, inject, onMounted, shallowRef } from 'vue'

enableAutoUnmount(afterEach)

BddTest().given('the shared router mounting engine', () => {
  const RoutedComponent = defineComponent({
    setup () {
      const status = shallowRef('initial')
      onMounted(() => {
        status.value = 'ready'
      })
      return { status }
    },
    template: '<main :data-status="status"><RouterLink to="/home">Home</RouterLink><RouterView><span>view-slot</span></RouterView></main>',
  })

  BddTest().when('mounted with no options', () => {
    let pending: ReturnType<typeof mountWithRouter>
    let wrapper: VueWrapper

    beforeEach(async () => {
      pending = mountWithRouter(RoutedComponent)
      wrapper = await pending
    })

    BddTest().then('it returns a Promise resolving after mounted reactive DOM updates', () => {
      expect(pending).toBeInstanceOf(Promise)
      expect(wrapper.attributes('data-status')).toBe('ready')
    })

    BddTest().then('it uses RouterLinkStub and preserves the exact RouterView stub contract', () => {
      expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/home')
      expect(wrapper.findComponent(RouterLinkStub).text()).toBe('Home')
      const view = wrapper.findComponent({ name: 'RouterView' })
      expect(view.vm.$options.name).toBe('RouterView')
      expect(view.vm.$options.template).toBe('<div class="router-view-stub"><slot /></div>')
      expect(view.element.tagName).toBe('DIV')
      expect(view.classes()).toEqual(['router-view-stub'])
      expect(view.text()).toBe('view-slot')
    })
  })

  for (const options of [{}, { global: {} }] satisfies ComponentMountingOptions<typeof RoutedComponent>[]) {
    BddTest().when(`mount options are ${JSON.stringify(options)}`, () => {
      let wrapper: VueWrapper

      beforeEach(async () => {
        wrapper = await mountWithRouter(RoutedComponent, options)
      })

      BddTest().then('it preserves default router stubs with omitted global or stub options', () => {
        expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
        expect(wrapper.find('.router-view-stub').text()).toBe('view-slot')
      })
    })
  }

  BddTest().when('caller options override router stubs and provide other global configuration', () => {
    const RouterLinkOverride = defineComponent({
      name: 'CallerRouterLink',
      props: { to: { type: String, required: true } },
      template: '<button :data-to="to"><slot /></button>',
    })
    const RouterViewOverride = defineComponent({
      name: 'CallerRouterView',
      template: '<article><slot /></article>',
    })
    const ChildStub = defineComponent({
      template: '<b>child</b>',
    })
    const observe = vi.fn(() => ({
      caller: inject('caller'),
      provided: inject('provided'),
    }))
    const Component = defineComponent({
      props: { label: { type: String, required: true } },
      setup () {
        observe()
      },
      template: '<section>{{ label }} {{ $custom }}<RouterLink to="/custom">Custom</RouterLink><RouterView><span>content</span></RouterView><Child /><slot /></section>',
    })
    const install = vi.fn((app: App) => {
      app.provide('caller', 'caller-value')
    })
    const options = {
      props: { label: 'label' },
      attrs: { 'data-testid': 'router-component' },
      slots: { default: '<aside>slot</aside>' },
      global: {
        plugins: [{ install }],
        provide: { provided: 'provided-value' },
        mocks: { $custom: 'mock-value' },
        stubs: {
          RouterLink: RouterLinkOverride,
          RouterView: RouterViewOverride,
          Child: ChildStub,
        },
      },
    }
    let wrapper: VueWrapper

    beforeEach(async () => {
      observe.mockClear()
      install.mockClear()
      wrapper = await mountWithRouter(Component, options)
    })

    BddTest().then('it lets caller stubs replace defaults without losing additional stubs', () => {
      expect(wrapper.findComponent(RouterLinkOverride).props('to')).toBe('/custom')
      expect(wrapper.findComponent(RouterLinkOverride).text()).toBe('Custom')
      expect(wrapper.findComponent(RouterViewOverride).text()).toBe('content')
      expect(wrapper.findComponent(ChildStub).text()).toBe('child')
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
      expect(wrapper.find('.router-view-stub').exists()).toBe(false)
      expect(options.global.stubs.RouterLink).toBe(RouterLinkOverride)
      expect(options.global.stubs.RouterView).toBe(RouterViewOverride)
    })

    BddTest().then('it preserves other mounting and global options and does not change the caller options', () => {
      expect(wrapper.attributes('data-testid')).toBe('router-component')
      expect(wrapper.text()).toBe('label mock-valueCustomcontentchildslot')
      expect(wrapper.find('aside').text()).toBe('slot')
      expect(install).toHaveBeenCalledOnce()
      expect(observe.mock.results[0].value).toEqual({ caller: 'caller-value', provided: 'provided-value' })
      expect(options.global.plugins).toHaveLength(1)
      expect(Object.keys(options.global.stubs)).toEqual(['RouterLink', 'RouterView', 'Child'])
    })
  })
})
