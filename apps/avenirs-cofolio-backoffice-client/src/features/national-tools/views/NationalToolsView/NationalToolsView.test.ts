import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import NationalToolsView from '@/features/national-tools/views/NationalToolsView/NationalToolsView.vue'

BddTest().given('national tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolsView>>

  const mountView = () => {
    wrapper = mount(NationalToolsView)
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(mountView)

    BddTest().then('the view is rendered', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('the div is rendered', () => {
      const div = wrapper.find('div')
      expect(div.exists()).toBe(true)
    })
  })
})
