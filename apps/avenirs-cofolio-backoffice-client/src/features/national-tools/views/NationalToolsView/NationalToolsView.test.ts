import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { NationalToolsPaginatedListStub, PageTitleStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import { ROUTES } from '@/constants'
import NationalToolsView from '@/features/national-tools/views/NationalToolsView/NationalToolsView.vue'

BddTest().given('a national tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    NationalToolsPaginatedList: NationalToolsPaginatedListStub,
  }

  const mountView = () => {
    wrapper = mount(NationalToolsView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getNationalToolsPaginatedList = () => wrapper.findComponent(NationalToolsPaginatedListStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(mountView)

    BddTest().then('the view is rendered', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Outils nationaux')
    })

    BddTest().then('the national tools paginated list is rendered with the national tool route', () => {
      expect(getNationalToolsPaginatedList().exists()).toBe(true)
      expect(getNationalToolsPaginatedList().props('baseRouteName')).toBe(ROUTES.NATIONAL_TOOL.name)
    })
  })
})
