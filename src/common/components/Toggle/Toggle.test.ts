import Toggle from '@/common/components/Toggle/Toggle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

const AvToggleStub = {
  name: 'AvToggle',
  props: ['activeText', 'inactiveText', 'modelValue'],
  template: `<div class="av-toggle-stub">
    <span data-test="active-text">{{ activeText }}</span>
    <span data-test="inactive-text">{{ inactiveText }}</span>
  </div>`
}

BddTest().given('a Toggle component', () => {
  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render an AvToggle with correct translated labels', () => {
      const wrapper = mount(Toggle, {
        props: {
          modelValue: true,
          description: 'test'
        },
        global: {
          stubs: { AvToggle: AvToggleStub }
        }
      })

      expect(wrapper.find('[data-test="active-text"]').text()).toBe('Oui')
      expect(wrapper.find('[data-test="inactive-text"]').text()).toBe('Non')
    })
  })
})
