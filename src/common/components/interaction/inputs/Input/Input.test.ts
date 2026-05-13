import type { VueWrapper } from '@vue/test-utils'
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('an Input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Input>>

  const stubs = { AvInput: AvInputStub }

  BddTest().when('the component is mounted without a maxlength prop', () => {
    const props: InputProps = { modelValue: 'test' }

    beforeEach(() => {
      wrapper = mount(Input, { props, global: { stubs } })
    })

    BddTest().then('it should not render the maxLengthCaption slot', () => {
      expect(wrapper.find('[data-testid="maxlength-caption"]').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a maxlength prop', () => {
    const props: InputProps = { modelValue: 'test', maxlength: 100 }

    beforeEach(() => {
      wrapper = mount(Input, { props, global: { stubs } })
    })

    BddTest().then('it should render the maxLengthCaption slot', () => {
      expect(wrapper.find('[data-testid="maxlength-caption"]').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a maxlength prop and a model value exceeding the maxlength', () => {
    const props: InputProps = { modelValue: 'a'.repeat(101), maxlength: 100 }

    beforeEach(() => {
      wrapper = mount(Input, { props, global: { stubs } })
    })

    BddTest().then('it should render the maxlength error slot', () => {
      expect(wrapper.find('.maxlength-error').exists()).toBe(true)
    })
  })
})
