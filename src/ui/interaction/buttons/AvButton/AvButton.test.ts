import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import { MDI_ICONS } from '@/ui'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

describe('avButton', () => {
  let wrapper: ReturnType<typeof mount<typeof AvButton>>

  describe('given default props', () => {
    beforeEach(() => {
      wrapper = mount<typeof AvButton>(AvButton)
    })

    describe('when component is mounted', () => {
      it('then it should render DsfrButton component', () => {
        expect(wrapper.findComponent({ name: 'DsfrButton' }).exists()).toBe(true)
      })

      it('then it should have default prop values', () => {
        const btn = wrapper.getComponent({ name: 'DsfrButton' })
        expect(btn.props('secondary')).toBe(false)
        expect(btn.props('tertiary')).toBe(true)
        expect(btn.props('noOutline')).toBe(true)
        expect(btn.props('size')).toBe('md')
        expect(btn.props('disabled')).toBe(false)
        expect(btn.props('icon')).toBe(undefined)
      })
    })
  })

  describe('given specific props', () => {
    const props = {
      label: 'Click me',
      variant: 'OUTLINED' as const,
      size: 'lg' as const,
      icon: { name: 'test-icon' },
      disabled: true,
    }

    beforeEach(() => {
      wrapper = mount<typeof AvButton>(AvButton, { props })
    })

    describe('when component is mounted with these props', () => {
      it('then DsfrButton should receive correct props', () => {
        const btn = wrapper.getComponent({ name: 'DsfrButton' })
        expect(btn.props('label')).toBe('Click me')
        expect(btn.props('secondary')).toBe(false)
        expect(btn.props('size')).toBe('lg')
        expect(btn.props('icon')).toEqual({ name: 'test-icon' })
        expect(btn.props('disabled')).toBe(true)
        expect(btn.props('tertiary')).toBe(true)
        expect(btn.props('noOutline')).toBe(false)
      })
    })
  })

  describe('given isLoading is true', () => {
    beforeEach(() => {
      wrapper = mount(AvButton, {
        props: {
          isLoading: true,
          icon: { name: 'other-icon' },
        },
      })
    })

    describe('when component is mounted', () => {
      it('then icon should be replaced by loading icon with spin animation', () => {
        const btn = wrapper.getComponent({ name: 'DsfrButton' })
        expect(btn.props('icon')).toEqual({ name: MDI_ICONS.LOADING_OUTLINE, animation: 'spin' })
      })
    })
  })

  describe('given variant is DEFAULT', () => {
    beforeEach(() => {
      wrapper = mount(AvButton, { props: { variant: 'DEFAULT' } })
    })

    describe('when component is mounted', () => {
      it('then tertiary and noOutline props should be true', () => {
        const btn = wrapper.getComponent({ name: 'DsfrButton' })
        expect(btn.props('tertiary')).toBe(true)
        expect(btn.props('noOutline')).toBe(true)
      })
    })
  })

  describe('given noRadius prop is true', () => {
    beforeEach(() => {
      wrapper = mount(AvButton, { props: { noRadius: true } })
    })

    describe('when component is mounted', () => {
      it('then the button should have av-button--no-radius class', () => {
        expect(wrapper.classes()).toContain('av-button--no-radius')
      })
    })
  })

  describe('given a click handler is passed', () => {
    const onClick = vi.fn()

    beforeEach(() => {
      wrapper = mount(AvButton, { props: { onClick } })
    })

    describe('when the DsfrButton is clicked', () => {
      it('then the handler should be called', async () => {
        const btn = wrapper.getComponent({ name: 'DsfrButton' })
        await btn.trigger('click')
        expect(onClick).toHaveBeenCalled()
      })
    })
  })

  describe('given computedSvgScale calculation', () => {
    describe.each([
      ['small', 1],
      ['sm', 1],
      ['medium', 1.5],
      ['md', 1.5],
      ['large', 2],
      ['lg', 2],
      ['', 1.5]
    ] as [DsfrButtonProps['size'], number][])(
      'when size is %s',
      (size, expectedScale) => {
        beforeEach(() => {
          wrapper = mount<typeof AvButton>(AvButton, { props: { size } })
        })

        it(`then computedSvgScale should be `, () => {
          expect(wrapper.vm.computedSvgScale).toBe(expectedScale)
        })
      }
    )

    describe('when iconScale is a valid number', () => {
      beforeEach(() => {
        wrapper = mount(AvButton, { props: { iconScale: 3 } })
      })

      it('then computedSvgScale returns iconScale value', () => {
        expect(wrapper.vm.computedSvgScale).toBe(3)
      })
    })

    describe('when iconScale is NaN', () => {
      beforeEach(() => {
        wrapper = mount(AvButton, { props: { iconScale: Number.NaN, size: 'md' } })
      })

      it('then computedSvgScale falls back to size based value', () => {
        expect(wrapper.vm.computedSvgScale).toBe(1.5)
      })
    })
  })
})
