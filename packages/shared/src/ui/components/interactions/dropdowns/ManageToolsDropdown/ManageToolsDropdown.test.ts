import type { ManageToolsDropdownProps } from '#shared/ui/components/interactions/dropdowns/ManageToolsDropdown/ManageToolsDropdown.vue'
import type { VueWrapper } from '@vue/test-utils'
import { ManageEntityDropdownStub } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageToolsDropdown from '#shared/ui/components/interactions/dropdowns/ManageToolsDropdown/ManageToolsDropdown.vue'
import { AddToolDrawerStub } from '#shared/ui/components/overlay/drawers/AddToolDrawer/AddToolDrawer.stub'
import { DeleteToolsModalStub } from '#shared/ui/components/overlay/modals/DeleteToolsModal/DeleteToolsModal.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a manage tools dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageToolsDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    AddToolDrawer: AddToolDrawerStub,
    DeleteToolsModal: DeleteToolsModalStub,
  }

  const mountWith = (props: ManageToolsDropdownProps = {}) => {
    wrapper = mount(ManageToolsDropdown, { props, global: { stubs } })
  }

  const getManageEntityDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAddToolDrawer = () => wrapper.findComponent(AddToolDrawerStub)
  const getDeleteToolsModal = () => wrapper.findComponent(DeleteToolsModalStub)

  BddTest().when('the dropdown is mounted with default props', () => {
    beforeEach(() => mountWith())

    BddTest().then('it should manage the tools with the add and delete actions', () => {
      expect(getManageEntityDropdown().props('entityName')).toBe('les outils')
      expect(getManageEntityDropdown().props('actions')).toEqual([Action.ADD, Action.DELETE])
    })

    BddTest().then('it should render a hidden local add tool drawer', () => {
      expect(getAddToolDrawer().props('show')).toBe(false)
      expect(getAddToolDrawer().props('isNational')).toBe(false)
    })

    BddTest().then('it should render a closed delete tools modal for local tools', () => {
      expect(getDeleteToolsModal().props('opened')).toBe(false)
      expect(getDeleteToolsModal().props('isNational')).toBe(false)
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

    BddTest().then('it should render a delete tools modal for national tools', () => {
      expect(getDeleteToolsModal().props('isNational')).toBe(true)
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

    BddTest().then('it should keep the delete modal closed', () => {
      expect(getDeleteToolsModal().props('opened')).toBe(false)
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

  BddTest().when('the delete action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await getManageEntityDropdown().vm.$emit('actionSelected', Action.DELETE)
    })

    BddTest().then('it should open the delete tools modal', () => {
      expect(getDeleteToolsModal().props('opened')).toBe(true)
    })

    BddTest().then('it should keep the add tool drawer hidden', () => {
      expect(getAddToolDrawer().props('show')).toBe(false)
    })

    BddTest().and('the delete modal is cancelled', () => {
      beforeEach(async () => {
        await getDeleteToolsModal().vm.$emit('cancel')
      })

      BddTest().then('it should close the delete tools modal', () => {
        expect(getDeleteToolsModal().props('opened')).toBe(false)
      })
    })

    BddTest().and('tools are deleted', () => {
      beforeEach(async () => {
        await getDeleteToolsModal().vm.$emit('deleted')
      })

      BddTest().then('it should close the delete tools modal', () => {
        expect(getDeleteToolsModal().props('opened')).toBe(false)
      })
    })
  })
})
