import type { ManageToolsDropdownProps } from '#shared/ui/components/interactions/dropdowns/ManageToolsDropdown/ManageToolsDropdown.vue'
import type { VueWrapper } from '@vue/test-utils'
import { ManageEntityDropdownStub } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageToolsDropdown from '#shared/ui/components/interactions/dropdowns/ManageToolsDropdown/ManageToolsDropdown.vue'
import { AddToolDrawerStub } from '#shared/ui/components/overlay/drawers/AddToolDrawer/AddToolDrawer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a manage tools dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageToolsDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    AddToolDrawer: AddToolDrawerStub,
  }

  const mountWith = (props: ManageToolsDropdownProps = {}) => {
    wrapper = mount(ManageToolsDropdown, { props, global: { stubs } })
  }

  const getManageEntityDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAddToolDrawer = () => wrapper.findComponent(AddToolDrawerStub)

  BddTest().when('the dropdown is mounted with default props', () => {
    beforeEach(() => mountWith())

    BddTest().then('it should manage the tools with the add action only', () => {
      expect(getManageEntityDropdown().props('entityName')).toBe('les outils')
      expect(getManageEntityDropdown().props('actions')).toEqual([Action.ADD])
    })

    BddTest().then('it should render a hidden local add tool drawer', () => {
      expect(getAddToolDrawer().props('show')).toBe(false)
      expect(getAddToolDrawer().props('isNational')).toBe(false)
    })
  })

  BddTest().when('the dropdown is mounted for national tools with a custom entity name', () => {
    beforeEach(() => mountWith({ isNational: true, entityName: 'les outils nationaux' }))

    BddTest().then('it should use the custom entity name', () => {
      expect(getManageEntityDropdown().props('entityName')).toBe('les outils nationaux')
    })

    BddTest().then('it should render a national add tool drawer', () => {
      expect(getAddToolDrawer().props('isNational')).toBe(true)
    })
  })

  BddTest().when('the add action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await wrapper.find(`[data-testid="${Action.ADD}"]`).trigger('click')
    })

    BddTest().then('it should show the add tool drawer', () => {
      expect(getAddToolDrawer().props('show')).toBe(true)
    })

    BddTest().and('the add tool drawer is closed', () => {
      beforeEach(async () => {
        await getAddToolDrawer().vm.$emit('close')
      })

      BddTest().then('it should hide the add tool drawer', () => {
        expect(getAddToolDrawer().props('show')).toBe(false)
      })
    })
  })

  BddTest().when('another action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await getManageEntityDropdown().vm.$emit('actionSelected', Action.DELETE)
    })

    BddTest().then('it should keep the add tool drawer hidden', () => {
      expect(getAddToolDrawer().props('show')).toBe(false)
    })
  })
})
