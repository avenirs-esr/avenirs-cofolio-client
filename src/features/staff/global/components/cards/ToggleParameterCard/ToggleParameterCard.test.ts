import type { ToggleParameterCardProps } from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import { IconTitleCardContainerStub } from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import ToggleParameterCard from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a toggle parameter card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToggleParameterCard>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    Toggle: ToggleStub,
  }

  const props: ToggleParameterCardProps = {
    title: 'Association de traces',
    icon: 'mdi:attach-file',
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ToggleParameterCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the card', () => {
      const card = wrapper.find('[data-testid="toggle-parameter-card"]')
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should render the toggle enabled by default', () => {
      const toggle = wrapper.findComponent(ToggleStub)
      expect(toggle.exists()).toBe(true)
      expect(toggle.props('modelValue')).toBe(true)
    })

    BddTest().then('it should render the slot content', () => {
      wrapper = mount(ToggleParameterCard, {
        props,
        global: { stubs },
        slots: { default: '<p data-testid="slot-content">Contenu</p>' },
      })
      const slot = wrapper.find('[data-testid="slot-content"]')
      expect(slot.exists()).toBe(true)
    })

    BddTest().and('the user clicks the toggle', () => {
      beforeEach(() => {
        const toggle = wrapper.findComponent(ToggleStub)
        toggle.vm.$emit('update:modelValue', false)
      })

      BddTest().then('the toggle value should be false', () => {
        const toggle = wrapper.findComponent(ToggleStub)
        expect(toggle.props('modelValue')).toBe(false)
      })
    })
  })
})
