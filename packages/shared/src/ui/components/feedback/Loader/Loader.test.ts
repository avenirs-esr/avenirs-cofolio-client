import type { LoaderColor, LoaderSize } from '@avenirs-esr/shared'
import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { Loader } from '@avenirs-esr/shared'
import { LoaderStub, mountComponent } from '@avenirs-esr/shared/test-utils'
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, expect } from 'vitest'

enableAutoUnmount(afterEach)

BddTest().given('the shared Loader component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Loader>>
  const stubs = { AvIcon: AvIconStub }
  const getIcon = () => wrapper.findComponent(AvIconStub)

  BddTest().when('the root entry is imported', () => {
    BddTest().then('it exports the shared component', () => {
      expect(Loader).toBeDefined()
    })
  })

  BddTest().when('loading is active', () => {
    beforeEach(() => {
      wrapper = mountComponent(Loader, {
        props: { isLoading: true },
        attrs: { 'data-testid': 'custom-loader' },
        slots: { default: '<span data-testid="loaded-content">Content</span>' },
        global: { stubs },
      })
    })

    BddTest().then('it forwards attributes and retains the layout classes', () => {
      expect(wrapper.get('[data-testid="custom-loader"]').classes()).toEqual(expect.arrayContaining([
        'loader',
        'av-row',
        'av-justify-center',
        'av-p-xs',
      ]))
    })

    BddTest().then('it renders the spinning icon with the default color and size', () => {
      expect(getIcon().props()).toMatchObject({
        name: MDI_ICONS.LOADING,
        animation: 'spin',
        size: 2,
        color: 'var(--dark-background-primary1)',
      })
      expect(wrapper.find('[data-testid="loaded-content"]').exists()).toBe(false)
    })

    BddTest().and('loading finishes', () => {
      beforeEach(async () => {
        await wrapper.setProps({ isLoading: false })
      })

      BddTest().then('it replaces the spinner with the supplied content', () => {
        expect(getIcon().exists()).toBe(false)
        expect(wrapper.get('[data-testid="loaded-content"]').text()).toBe('Content')
      })
    })
  })

  BddTest().when('loading and the default slot are omitted', () => {
    beforeEach(() => {
      wrapper = mountComponent(Loader, { global: { stubs } })
    })

    BddTest().then('it renders the existing empty fallback', () => {
      expect(wrapper.find('[data-testid="loader-slot-alt"]').exists()).toBe(true)
      expect(getIcon().exists()).toBe(false)
    })
  })

  BddTest().when('loading is omitted and content is supplied', () => {
    beforeEach(() => {
      wrapper = mountComponent(Loader, {
        slots: { default: '<span data-testid="default-content">Ready</span>' },
        global: { stubs },
      })
    })

    BddTest().then('it renders that content without a spinner', () => {
      expect(wrapper.get('[data-testid="default-content"]').text()).toBe('Ready')
      expect(getIcon().exists()).toBe(false)
    })
  })

  const colors: { color: LoaderColor, value: string }[] = [
    { color: 'primary', value: 'var(--dark-background-primary1)' },
    { color: 'accent', value: 'var(--dark-background-accent)' },
    { color: 'success', value: 'var(--dark-background-success)' },
    { color: 'info', value: 'var(--dark-background-info)' },
    { color: 'warn', value: 'var(--dark-background-warn)' },
    { color: 'error', value: 'var(--dark-background-error)' },
    { color: 'neutral', value: 'var(--dark-background-neutral)' },
  ]

  for (const { color, value } of colors) {
    BddTest().when(`the color is ${color}`, () => {
      beforeEach(() => {
        wrapper = mountComponent(Loader, { props: { isLoading: true, color }, global: { stubs } })
      })

      BddTest().then('it forwards the corresponding color variable', () => {
        expect(getIcon().props('color')).toBe(value)
      })
    })
  }

  const sizes: { size: LoaderSize, value: number }[] = [
    { size: 'xs', value: 1 },
    { size: 'sm', value: 1.5 },
    { size: 'md', value: 2 },
    { size: 'lg', value: 2.5 },
    { size: 'xl', value: 3 },
    { size: '2xl', value: 4 },
    { size: '4xl', value: 5 },
  ]

  for (const { size, value } of sizes) {
    BddTest().when(`the size is ${size}`, () => {
      beforeEach(() => {
        wrapper = mountComponent(Loader, { props: { isLoading: true, size }, global: { stubs } })
      })

      BddTest().then('it forwards the corresponding icon size', () => {
        expect(getIcon().props('size')).toBe(value)
      })
    })
  }
})

BddTest().given('the shared Loader stub', () => {
  let wrapper: VueWrapper<InstanceType<typeof LoaderStub>>

  beforeEach(() => {
    wrapper = mountComponent(LoaderStub, {
      props: { isLoading: true, color: 'accent', size: 'lg' },
      attrs: { 'data-source': 'consumer' },
      slots: { default: '<span data-testid="stub-content">Ready</span>' },
    })
  })

  BddTest().then('it exposes props and forwards attributes to the loading element', () => {
    expect(wrapper.props()).toMatchObject({ isLoading: true, color: 'accent', size: 'lg' })
    expect(wrapper.get('[data-testid="loader-stub"]').attributes('data-source')).toBe('consumer')
    expect(wrapper.find('[data-testid="stub-content"]').exists()).toBe(false)
  })

  BddTest().when('loading finishes', () => {
    beforeEach(async () => {
      await wrapper.setProps({ isLoading: false })
    })

    BddTest().then('it renders the default slot', () => {
      expect(wrapper.get('[data-testid="stub-content"]').text()).toBe('Ready')
      expect(wrapper.find('[data-testid="loader-stub"]').exists()).toBe(false)
    })
  })
})
