import type { VueWrapper } from '@vue/test-utils'
import { EToolType } from '#shared/api/avenir-esr/index'
import { ToolsPaginatedListStub } from '#shared/ui/components/interactions/lists/ToolsPaginatedList/ToolsPaginatedList.stub'
import { ToolTabs } from '#shared/ui/index'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a tool tabs component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolTabs>>

  const baseRouteName = 'test-route'

  const stubs = {
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    ToolsPaginatedList: ToolsPaginatedListStub,
  }

  const mountComponent = (props = {}) => {
    wrapper = mount(ToolTabs, {
      props,
      global: { stubs },
    })
  }

  const getAvTabs = () => wrapper.findComponent(AvTabsStub)
  const getActiveAvTab = () => wrapper.findComponent(AvTabStub)
  const getToolsPaginatedLists = () => wrapper.findAllComponents(ToolsPaginatedListStub)

  const getNationalToolsPaginatedList = () => getToolsPaginatedLists().find(
    component => component.props('type') === EToolType.NATIONAL,
  )

  const getRegionalToolsPaginatedList = () => getToolsPaginatedLists().find(
    component => component.props('type') === EToolType.REGIONAL,
  )

  const getLocalToolsPaginatedList = () => getToolsPaginatedLists().find(
    component => component.props('type') === EToolType.LOCAL,
  )

  const getTabTitles = () => getAvTabs().vm.$slots.default?.().map(tab => tab.props?.title)

  const selectTab = async (tabIndex: number) => {
    const exposed = getAvTabs().vm.$.exposed

    expect(exposed).toBeDefined()
    exposed!.selectTab(tabIndex)
    await flushPromises()
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountComponent({ baseRouteName })
    })

    BddTest().then('it should render the three tabs with their respective titles', () => {
      expect(getTabTitles()).toEqual([
        'Outils nationaux',
        'Outils régionaux',
        'Outils locaux',
      ])
    })

    BddTest().then('it should select the national tools tab by default', () => {
      expect(getActiveAvTab().exists()).toBe(true)
      expect(getNationalToolsPaginatedList()).toBeDefined()
    })

    BddTest().then('it should pass the base route name to every tools list', () => {
      getToolsPaginatedLists().forEach((component) => {
        expect(component.props('baseRouteName')).toBe(baseRouteName)
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

  BddTest().when('the component is mounted without a base route name', () => {
    beforeEach(() => {
      mountComponent()
    })

    BddTest().then('it should not pass a base route name to the tools lists', () => {
      getToolsPaginatedLists().forEach((component) => {
        expect(component.props('baseRouteName')).toBeUndefined()
      })
    })
  })
})
