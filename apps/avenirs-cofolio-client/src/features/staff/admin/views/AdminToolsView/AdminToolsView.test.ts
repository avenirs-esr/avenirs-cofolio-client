import type { VueWrapper } from '@vue/test-utils'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { AdminToolsPaginatedListStub, PageTitleStub } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ROUTES } from '@/common/constants'
import AdminToolsView from '@/features/staff/admin/views/AdminToolsView/AdminToolsView.vue'

BddTest().given('an admin tools view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolsView>>

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    PageTitle: PageTitleStub,
    AdminToolsPaginatedList: AdminToolsPaginatedListStub,
  }

  const mountView = () => {
    wrapper = mount(AdminToolsView, {
      global: { stubs },
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getAvTabs = () => wrapper.findComponent(AvTabsStub)
  const getActiveAvTab = () => wrapper.findComponent(AvTabStub)
  const getAdminToolsPaginatedLists = () => wrapper.findAllComponents(AdminToolsPaginatedListStub)

  const getNationalToolsPaginatedList = () => getAdminToolsPaginatedLists().find(
    component => component.props('type') === EToolType.NATIONAL
  )

  const getRegionalToolsPaginatedList = () => getAdminToolsPaginatedLists().find(
    component => component.props('type') === EToolType.REGIONAL
  )

  const getLocalToolsPaginatedList = () => getAdminToolsPaginatedLists().find(
    component => component.props('type') === EToolType.LOCAL
  )

  const getTabTitles = () => getAvTabs().vm.$slots.default?.().map(tab => tab.props?.title)

  const selectTab = async (tabIndex: number) => {
    const exposed = getAvTabs().vm.$.exposed

    expect(exposed).toBeDefined()
    exposed!.selectTab(tabIndex)
    await flushPromises()
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('it should render the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should render the three tabs with their respective titles', () => {
      expect(getTabTitles()).toEqual([
        'Outils nationaux',
        'Outils régionaux',
        'Outils établissement(s)',
      ])
    })

    BddTest().then('it should select the national tools tab by default', () => {
      expect(getActiveAvTab().exists()).toBe(true)
      expect(getNationalToolsPaginatedList()).toBeDefined()
    })

    BddTest().then('it should pass the staff tool route name to every tools list', () => {
      getAdminToolsPaginatedLists().forEach((component) => {
        expect(component.props('baseRouteName')).toBe(ROUTES.STAFF.ADMIN.TOOL.name)
      })
    })

    BddTest().and('the regional tools tab is selected', () => {
      beforeEach(async () => {
        await selectTab(1)
      })

      BddTest().then('it should select the regional tools tab', () => {
        expect(getActiveAvTab().exists()).toBe(true)
        expect(getRegionalToolsPaginatedList()).toBeDefined()
      })
    })

    BddTest().and('the local tools tab is selected', () => {
      beforeEach(async () => {
        await selectTab(2)
      })

      BddTest().then('it should select the local tools tab', () => {
        expect(getActiveAvTab().exists()).toBe(true)
        expect(getLocalToolsPaginatedList()).toBeDefined()
      })
    })

    BddTest().and('the national tools tab is selected again', () => {
      beforeEach(async () => {
        await selectTab(1)
        await selectTab(0)
      })

      BddTest().then('it should render the national tools list again', () => {
        expect(getNationalToolsPaginatedList()).toBeDefined()
      })
    })
  })
})
