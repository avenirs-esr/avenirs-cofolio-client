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
  const getAllAvTabComponents = () => wrapper.findAllComponents(AvTabStub)
  const getActiveAvTab = () => getAllAvTabComponents()[0]
  const getToolsPaginatedLists = () => wrapper.findAllComponents(ToolsPaginatedListStub)

  const getToolsPaginatedList = (type: EToolType) => getToolsPaginatedLists().find(
    component => component.props('type') === type,
  )

  const getNationalToolsPaginatedList = () => getToolsPaginatedList(EToolType.NATIONAL)
  const getRegionalToolsPaginatedList = () => getToolsPaginatedList(EToolType.REGIONAL)
  const getLocalToolsPaginatedList = () => getToolsPaginatedList(EToolType.LOCAL)

  const getTabTitles = () => getAllAvTabComponents().map(tab => tab.props('title'))

  const emitCount = async (type: EToolType, value: number) => {
    getToolsPaginatedList(type)?.vm.$emit('count', type, value)
    await flushPromises()
  }

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
        localBaseRouteName,
      })
    })

    BddTest().then('it should render the three tabs with their respective titles', () => {
      expect(getTabTitles()).toEqual([
        'Outils nationaux (0)',
        'Outils régionaux (0)',
        'Outils locaux (0)',
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
        regionalBaseRouteName,
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

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountComponent()
    })

    BddTest().then('it should initialize all tools counts to zero', () => {
      expect(getTabTitles()).toEqual([
        'Outils nationaux (0)',
        'Outils régionaux (0)',
        'Outils locaux (0)',
      ])
    })

    BddTest().and('a tools list emits a count', () => {
      BddTest().then('it should update the national tools tab title', async () => {
        await emitCount(EToolType.NATIONAL, 5)

        expect(getTabTitles()?.[0]).toContain('5')
      })

      BddTest().then('it should update the regional tools tab title', async () => {
        await emitCount(EToolType.REGIONAL, 8)

        expect(getTabTitles()?.[1]).toContain('8')
      })

      BddTest().then('it should update the local tools tab title', async () => {
        await emitCount(EToolType.LOCAL, 12)

        expect(getTabTitles()?.[2]).toContain('12')
      })
    })

    BddTest().and('multiple tools lists emit their counts', () => {
      BddTest().then('it should update each tab title independently', async () => {
        await emitCount(EToolType.NATIONAL, 5)
        await emitCount(EToolType.REGIONAL, 8)
        await emitCount(EToolType.LOCAL, 12)

        const titles = getTabTitles()

        expect(titles?.[0]).toContain('5')
        expect(titles?.[1]).toContain('8')
        expect(titles?.[2]).toContain('12')
      })

      BddTest().then('it should not modify other tab titles when a count changes', async () => {
        await emitCount(EToolType.NATIONAL, 5)

        const titles = getTabTitles()

        expect(titles?.[0]).toContain('5')
        expect(titles?.[1]).toBe('Outils régionaux (0)')
        expect(titles?.[2]).toBe('Outils locaux (0)')
      })
    })

    BddTest().and('a tools list emits an updated count', () => {
      BddTest().then('it should replace the previous count in the tab title', async () => {
        await emitCount(EToolType.NATIONAL, 5)
        await emitCount(EToolType.NATIONAL, 10)

        expect(getTabTitles()?.[0]).toContain('10')
        expect(getTabTitles()?.[0]).not.toContain('5')
      })

      BddTest().then('it should reset the tab count to zero', async () => {
        await emitCount(EToolType.NATIONAL, 5)
        await emitCount(EToolType.NATIONAL, 0)

        expect(getTabTitles()?.[0]).toBe('Outils nationaux (0)')
      })
    })
  })
})
