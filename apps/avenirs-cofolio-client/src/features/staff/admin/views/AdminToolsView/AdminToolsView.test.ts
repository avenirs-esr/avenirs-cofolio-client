import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ManageToolsDropdownStub, PageTitleStub, ToolTabsStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ROUTES } from '@/common/constants'
import AdminToolsView from '@/features/staff/admin/views/AdminToolsView/AdminToolsView.vue'

BddTest().given('an admin tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ToolTabs: ToolTabsStub,
    ManageToolsDropdown: ManageToolsDropdownStub
  }

  const mountView = () => {
    wrapper = mount(AdminToolsView, {
      global: { stubs },
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getToolTabs = () => wrapper.findComponent(ToolTabsStub)
  const getManageToolsDropdown = () => wrapper.findComponent(ManageToolsDropdownStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('it should render the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should render the tool tabs', () => {
      expect(getToolTabs().exists()).toBe(true)
    })

    BddTest().then('it should render the manage tools dropdown', () => {
      expect(getManageToolsDropdown().exists()).toBe(true)
    })

    BddTest().then('it should pass the national tools route name to ToolTabs', () => {
      expect(getToolTabs().props('nationalBaseRouteName')).toBe(ROUTES.STAFF.ADMIN.TOOL.NATIONAL.name)
    })

    BddTest().then('it should pass the regional tools route name to ToolTabs', () => {
      expect(getToolTabs().props('regionalBaseRouteName')).toBe(ROUTES.STAFF.ADMIN.TOOL.REGIONAL.name)
    })

    BddTest().then('it should pass the local tools route name to ToolTabs', () => {
      expect(getToolTabs().props('localBaseRouteName')).toBe(ROUTES.STAFF.ADMIN.TOOL.LOCAL.name)
    })

    BddTest().then('it should pass disabled add interactive props to ManageToolsDropdown', () => {
      const dropdown = getManageToolsDropdown()
      expect(dropdown.props('addInteractiveProps')).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
    })
  })
})
