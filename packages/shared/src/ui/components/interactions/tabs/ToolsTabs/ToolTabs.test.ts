import type { VueWrapper } from '@vue/test-utils'
import { EToolType } from '#shared/api/avenir-esr/index'
import { ToolsPaginatedListStub } from '#shared/ui/components/interactions/lists/ToolsPaginatedList/ToolsPaginatedList.stub'
import { ToolTabs } from '#shared/ui/index'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a tool tabs component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolTabs>>

  const nationalBaseRouteName = 'national-tools'
  const regionalBaseRouteName = 'regional-tools'
  const localBaseRouteName = 'local-tools'

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

  BddTest().when('the component is mounted with all base route names', () => {
    beforeEach(() => {
      mountComponent({
        nationalBaseRouteName,
        regionalBaseRouteName,
        localBaseRouteName
      })
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

    BddTest().then('it should pass the correct base route name to the national tools list', () => {
      expect(getNationalToolsPaginatedList()?.props('baseRouteName')).toBe(nationalBaseRouteName)
    })

    BddTest().then('it should render the national tools with the correct type', () => {
      expect(getNationalToolsPaginatedList()?.props('type')).toBe(EToolType.NATIONAL)
    })

    BddTest().and('the regional tools tab is selected', () => {
      beforeEach(async () => {
        await selectTab(1)
      })

      BddTest().then('it should select the regional tools tab', () => {
        expect(getActiveAvTab().exists()).toBe(true)
        expect(getRegionalToolsPaginatedList()).toBeDefined()
      })

      BddTest().then('it should pass the correct base route name to the regional tools list', () => {
        expect(getRegionalToolsPaginatedList()?.props('baseRouteName')).toBe(regionalBaseRouteName)
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

      BddTest().then('it should pass the correct base route name to the local tools list', () => {
        expect(getLocalToolsPaginatedList()?.props('baseRouteName')).toBe(localBaseRouteName)
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

  BddTest().when('the component is mounted without base route names', () => {
    beforeEach(() => {
      mountComponent()
    })

    BddTest().then('it should not pass base route names to the tools lists', () => {
      getToolsPaginatedLists().forEach((component) => {
        expect(component.props('baseRouteName')).toBeUndefined()
      })
    })
  })

  BddTest().when('the component is mounted with only national and regional base route names', () => {
    beforeEach(() => {
      mountComponent({
        nationalBaseRouteName,
        regionalBaseRouteName
      })
    })

    BddTest().then('it should pass the national base route name', () => {
      expect(getNationalToolsPaginatedList()?.props('baseRouteName')).toBe(nationalBaseRouteName)
    })

    BddTest().then('it should render the regional tab', async () => {
      await selectTab(1)
      expect(getRegionalToolsPaginatedList()?.props('baseRouteName')).toBe(regionalBaseRouteName)
    })

    BddTest().then('it should not pass a base route name to the local tools list', async () => {
      await selectTab(2)
      expect(getLocalToolsPaginatedList()?.props('baseRouteName')).toBeUndefined()
    })
  })
})
