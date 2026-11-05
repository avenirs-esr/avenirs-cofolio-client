import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import NationalToolsView from '@/features/national-tools/views/NationalToolsView/NationalToolsView.vue'

BddTest().given('a national tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolsView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountView = () => {
    wrapper = mount(NationalToolsView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(mountView)

    BddTest().then('the view is rendered', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Outils nationaux')
    })

    BddTest().then('the div is rendered', () => {
      const div = wrapper.find('div')
      expect(div.exists()).toBe(true)
    })
  })
})
