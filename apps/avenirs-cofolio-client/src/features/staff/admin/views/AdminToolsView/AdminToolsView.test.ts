import type { VueWrapper } from '@vue/test-utils'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { NationalToolsPaginatedListStub, PageTitleStub } from '@avenirs-esr/shared'
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
    NationalToolsPaginatedList: NationalToolsPaginatedListStub
  }

  const mountView = () => {
    wrapper = mount(AdminToolsView, {
      global: { stubs }
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getAvTabs = () => wrapper.findComponent(AvTabsStub)
  const getActiveAvTab = () => wrapper.findComponent(AvTabStub)
  const getNationalToolsPaginatedList = () => wrapper.findComponent(NationalToolsPaginatedListStub)

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
        'Outils établissement'
      ])
    })

    BddTest().then('it should select the national tools tab by default', () => {
      expect(getActiveAvTab().exists()).toBe(true)
      expect(getNationalToolsPaginatedList().exists()).toBe(true)
    })

    BddTest().then('it should pass the staff tool route name to the national tools list', () => {
      expect(getNationalToolsPaginatedList().props('baseRouteName')).toBe(ROUTES.STAFF.ADMIN.TOOL.name)
    })

    BddTest().and('the regional tools tab is selected', () => {
      beforeEach(async () => {
        await selectTab(1)
      })

      BddTest().then('it should render the regional tools placeholder', () => {
        expect(wrapper.text()).toContain('TODO #3228')
      })

      BddTest().then('it should not render the national tools list', () => {
        expect(getNationalToolsPaginatedList().exists()).toBe(false)
      })
    })

    BddTest().and('the local tools tab is selected', () => {
      beforeEach(async () => {
        await selectTab(2)
      })

      BddTest().then('it should render the local tools placeholder', () => {
        expect(wrapper.text()).toContain('TODO #3228')
      })

      BddTest().then('it should not render the national tools list', () => {
        expect(getNationalToolsPaginatedList().exists()).toBe(false)
      })
    })

    BddTest().and('the national tools tab is selected again', () => {
      beforeEach(async () => {
        await selectTab(1)
        await selectTab(0)
      })

      BddTest().then('it should render the national tools list again', () => {
        expect(getNationalToolsPaginatedList().exists()).toBe(true)
      })
    })
  })
})
