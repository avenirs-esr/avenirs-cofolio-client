import type { VueWrapper } from '@vue/test-utils'
import FormFieldCardContainer from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.vue'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a form field card container', () => {
  let wrapper: VueWrapper<InstanceType<typeof FormFieldCardContainer>>
  const stubs = {
    AvCard: AvCardStub
  }

  BddTest().when('component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(FormFieldCardContainer, {
        global: { stubs }
      })
    })

    BddTest().then('it should render vertical orientation by default', () => {
      expect(wrapper.find('[data-testid="vertical-container"]').exists()).toBe(true)
    })
  })

  BddTest().when('orientation is horizontal', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(FormFieldCardContainer, {
        props: {
          orientation: 'horizontal'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render horizontal layout', () => {
      expect(wrapper.find('[data-testid="horizontal-container"]').exists()).toBe(true)
    })
  })
})
