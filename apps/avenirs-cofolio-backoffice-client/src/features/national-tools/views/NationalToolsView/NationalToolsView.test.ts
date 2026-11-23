import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ManageToolsDropdownStub, PageTitleStub, ToolsPaginatedListStub } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ROUTES } from '@/constants'
import NationalToolsView from '@/features/national-tools/views/NationalToolsView/NationalToolsView.vue'

BddTest().given('a national tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ToolsPaginatedList: ToolsPaginatedListStub,
    ManageToolsDropdown: ManageToolsDropdownStub,
  }

  const mountView = () => {
    wrapper = mount(NationalToolsView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getToolsPaginatedList = () => wrapper.findComponent(ToolsPaginatedListStub)

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
      expect(getToolsPaginatedList().exists()).toBe(true)
      expect(getToolsPaginatedList().props('baseRouteName')).toBe(ROUTES.NATIONAL_TOOL.name)
      expect(getToolsPaginatedList().props('type')).toBe(EToolType.NATIONAL)
    })

    BddTest().then('the national tools management dropdown is rendered in the page title actions', () => {
      const dropdown = getPageTitle().findComponent(ManageToolsDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('isNational')).toBe(true)
      expect(dropdown.props('entityName')).toBe('les outils nationaux')
    })
  })
})
