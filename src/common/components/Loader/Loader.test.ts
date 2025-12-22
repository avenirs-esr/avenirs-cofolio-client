import Loader, { type LoaderColor, type LoaderSize } from '@/common/components/Loader/Loader.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a loader component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Loader>>

  const stubs = {
    AvIcon: AvIconStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with default props', () => {
    let icon: VueWrapper<InstanceType<typeof AvIconStub>>

    beforeEach(() => {
      wrapper = mount(Loader, {
        global: { stubs }
      })
      icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
    })

    BddTest().then('it should render the loader container', () => {
      expect(wrapper.find('.loader').exists()).toBe(true)
    })

    BddTest().then('it should have correct layout classes', () => {
      const container = wrapper.find('.loader')
      expect(container.classes()).toContain('av-flex-col-xs')
      expect(container.classes()).toContain('av-row--middle')
    })

    BddTest().then('it should render the AvIcon component', () => {
      expect(icon.exists()).toBe(true)
    })

    BddTest().then('it should have spin animation', () => {
      expect(icon.props('animation')).toBe('spin')
    })

    BddTest().then('it should use default primary color', () => {
      expect(icon.props('color')).toBe('var(--dark-background-primary1)')
    })

    BddTest().then('it should use default medium size', () => {
      expect(icon.props('size')).toBe(2)
    })
  })

  BddTest().when('the component is mounted with custom colors', () => {
    BddTest().and('color is set to primary', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(Loader, {
          props: { color: 'primary' as LoaderColor },
          global: { stubs }
        })
      })

      BddTest().then('it should apply primary color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-primary1)')
      })
    })

    BddTest().and('color is set to accent', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(Loader, {
          props: { color: 'accent' as LoaderColor },
          global: { stubs }
        })
      })

      BddTest().then('it should apply accent color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-accent)')
      })
    })

    BddTest().and('color is set to success', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(Loader, {
          props: { color: 'success' as LoaderColor },
          global: { stubs }
        })
      })

      BddTest().then('it should apply success color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-success)')
      })
    })

    BddTest().and('color is set to info', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(Loader, {
          props: { color: 'info' as LoaderColor },
          global: { stubs }
        })
      })

      BddTest().then('it should apply info color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-info)')
      })
    })

    BddTest().and('color is set to warn', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(Loader, {
          props: { color: 'warn' as LoaderColor },
          global: { stubs }
        })
      })

      BddTest().then('it should apply warn color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-warn)')
      })
    })

    BddTest().and('color is set to error', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(Loader, {
          props: { color: 'error' as LoaderColor },
          global: { stubs }
        })
      })

      BddTest().then('it should apply error color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-error)')
      })
    })

    BddTest().and('color is set to neutral', () => {
      beforeEach(() => {
        vi.clearAllMocks()
        wrapper = mount(Loader, {
          props: { color: 'neutral' as LoaderColor },
          global: { stubs }
        })
      })

      BddTest().then('it should apply neutral color variable', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('color')).toBe('var(--dark-background-neutral)')
      })
    })
  })

  BddTest().when('the component is mounted with custom sizes', () => {
    BddTest().and('size is set to xs', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'xs' as LoaderSize },
          global: { stubs }
        })
      })

      BddTest().then('it should apply xs size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(1)
      })
    })

    BddTest().and('size is set to sm', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'sm' as LoaderSize },
          global: { stubs }
        })
      })

      BddTest().then('it should apply sm size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(1.5)
      })
    })

    BddTest().and('size is set to md', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'md' as LoaderSize },
          global: { stubs }
        })
      })

      BddTest().then('it should apply md size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(2)
      })
    })

    BddTest().and('size is set to lg', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'lg' as LoaderSize },
          global: { stubs }
        })
      })

      BddTest().then('it should apply lg size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(2.5)
      })
    })

    BddTest().and('size is set to xl', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: 'xl' as LoaderSize },
          global: { stubs }
        })
      })

      BddTest().then('it should apply xl size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(3)
      })
    })

    BddTest().and('size is set to 2xl', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: '2xl' as LoaderSize },
          global: { stubs }
        })
      })

      BddTest().then('it should apply 2xl size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(4)
      })
    })

    BddTest().and('size is set to 4xl', () => {
      beforeEach(() => {
        wrapper = mount(Loader, {
          props: { size: '4xl' as LoaderSize },
          global: { stubs }
        })
      })

      BddTest().then('it should apply 4xl size value', () => {
        const icon = wrapper.findComponent({ name: 'AvIcon' }) as VueWrapper<InstanceType<typeof AvIconStub>>
        expect(icon.props('size')).toBe(5)
      })
    })
  })
})
