import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import UpdateHandleSelector, { type UpdateHandleSelectorProps } from '@/common/components/VueFlow/UpdateHandleSelector/UpdateHandleSelector.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { Position } from '@vue-flow/core'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

BddTest().given('an update handle selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateHandleSelector>>

  const stubs = {
    Toggle: ToggleStub,
  }

  BddTest().when('the component is mounted with top position', () => {
    const props: UpdateHandleSelectorProps = {
      modelValue: false,
      position: Position.Top,
    }

    beforeEach(() => {
      wrapper = mount(UpdateHandleSelector, { props, global: { stubs } })
    })

    BddTest().then('it should render the toggle with correct description', () => {
      const toggle = wrapper.findComponent(ToggleStub)
      expect(toggle.exists()).toBe(true)
      expect(toggle.props('description')).toBe('Haut')
      expect(toggle.props('modelValue')).toBe(false)
      expect(toggle.props('id')).toBe('update-handle-selector-top')
    })

    BddTest().then('it should render the inline class', () => {
      expect(wrapper.classes()).toContain('av-row')
      expect(wrapper.classes()).toContain('av-row--center')
    })

    BddTest().and('the toggle is clicked', () => {
      beforeEach(async () => {
        const toggle = wrapper.findComponent(ToggleStub)
        await toggle.find('input').setValue(true)
      })

      BddTest().then('it should emit the update event with true', () => {
        expect(wrapper.emitted('update:model-value')).toBeTruthy()
        expect(wrapper.emitted('update:model-value')?.[0]).toEqual([true])
      })

      BddTest().and('the toggle is clicked again', () => {
        beforeEach(async () => {
          const toggle = wrapper.findComponent(ToggleStub)
          await toggle.find('input').setValue(false)
        })

        BddTest().then('it should emit the update event with false', () => {
          expect(wrapper.emitted('update:model-value')?.[1]).toEqual([false])
        })
      })
    })

    BddTest().and('the view is displayed on mobile', () => {
      beforeEach(() => {
        mockIsMobile.value = true
      })

      BddTest().then('it should display the mobile class', () => {
        expect(wrapper.classes()).toContain('is-mobile')
      })
    })
  })

  BddTest().when('the component is mounted with left position', () => {
    const props: UpdateHandleSelectorProps = {
      modelValue: true,
      position: Position.Left,
    }

    beforeEach(() => {
      wrapper = mount(UpdateHandleSelector, { props, global: { stubs } })
    })

    BddTest().then('it should render the toggle with correct description', () => {
      const toggle = wrapper.findComponent(ToggleStub)
      expect(toggle.exists()).toBe(true)
      expect(toggle.props('description')).toBe('Gauche')
      expect(toggle.props('modelValue')).toBe(true)
      expect(toggle.props('id')).toBe('update-handle-selector-left')
    })

    BddTest().then('it should not render the inline class', () => {
      expect(wrapper.classes()).not.toContain('av-row')
      expect(wrapper.classes()).not.toContain('av-row--center')
    })
  })
})
