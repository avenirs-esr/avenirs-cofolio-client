import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub, ToolTabsStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ROUTES } from '@/common/constants'
import AdminToolsView from '@/features/staff/admin/views/AdminToolsView/AdminToolsView.vue'

BddTest().given('an admin tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ToolTabs: ToolTabsStub,
  }

  const mountView = () => {
    wrapper = mount(AdminToolsView, {
      global: { stubs },
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getToolTabs = () => wrapper.findComponent(ToolTabsStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('it should render the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should pass the staff tool route name to ToolTabs', () => {
      expect(getToolTabs().exists()).toBe(true)
      expect(getToolTabs().props('baseRouteName')).toBe(ROUTES.STAFF.ADMIN.TOOL.name)
    })
  })
})
