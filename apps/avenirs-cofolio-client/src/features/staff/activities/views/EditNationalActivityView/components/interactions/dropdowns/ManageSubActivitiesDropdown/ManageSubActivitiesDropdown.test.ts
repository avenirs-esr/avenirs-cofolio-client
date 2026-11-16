import type { VueWrapper } from '@vue/test-utils'
import type { ManageSubActivitiesDropdownProps } from '@/features/staff/activities/views/EditNationalActivityView/components/interactions/dropdowns/ManageSubActivitiesDropdown/ManageSubActivitiesDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageSubActivitiesDropdown from '@/features/staff/activities/views/EditNationalActivityView/components/interactions/dropdowns/ManageSubActivitiesDropdown/ManageSubActivitiesDropdown.vue'

const ENTITY_NAME = 'les sous-activités'

BddTest().given('a ManageSubActivitiesDropdown component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageSubActivitiesDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
  }

  const mountWith = (props: Partial<ManageSubActivitiesDropdownProps> = {}) => {
    wrapper = mount(ManageSubActivitiesDropdown, {
      props,
      global: { stubs },
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAddButton = () => wrapper.find(`[data-testid="${Action.ADD}"]`)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should pass the entity name to the dropdown', () => {
      expect(getDropdown().props('entityName')).toBe(ENTITY_NAME)
    })

    BddTest().then('it should contain the add action', () => {
      expect(getDropdown().props('actions')).toEqual([Action.ADD])
    })

    BddTest().then('it should be neither loading nor disabled', () => {
      expect(getDropdown().props('isLoading')).toBe(false)
      expect(getDropdown().props('disabled')).toBe(false)
    })
  })

  BddTest().when('the component is loading', () => {
    beforeEach(() => {
      mountWith({
        isLoading: true
      })
    })

    BddTest().then('it should show the dropdown as loading', () => {
      expect(getDropdown().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the component is disabled', () => {
    const disabledTooltip = 'Ajout impossible'

    beforeEach(() => {
      mountWith({
        disabled: true,
        disabledTooltip
      })
    })

    BddTest().then('it should disable the dropdown, with its tooltip', () => {
      expect(getDropdown().props('disabled')).toBe(true)
      expect(getDropdown().props('disabledTooltip')).toBe(disabledTooltip)
    })
  })

  BddTest().when('the add action is selected', () => {
    beforeEach(async () => {
      mountWith()
      await getAddButton().trigger('click')
    })

    BddTest().then('it should emit add', () => {
      expect(wrapper.emitted(Action.ADD)).toHaveLength(1)
    })
  })
})
