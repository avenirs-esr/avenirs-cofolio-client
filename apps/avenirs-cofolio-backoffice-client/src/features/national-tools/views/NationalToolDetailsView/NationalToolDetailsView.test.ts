import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import NationalToolDetailsView from '@/features/national-tools/views/NationalToolDetailsView/NationalToolDetailsView.vue'

BddTest().given('a national tool details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolDetailsView>>

  const mountWith = () => {
    wrapper = mount(NationalToolDetailsView)
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('the wrapper should be defined', () => {
      expect(wrapper).toBeDefined()
    })
  })
})
