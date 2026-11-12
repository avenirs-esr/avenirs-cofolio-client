import type { VueWrapper } from '@vue/test-utils'
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

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAddButton = () => wrapper.find(`[data-testid="${Action.ADD}"]`)

  beforeEach(() => {
    wrapper = mount(ManageSubActivitiesDropdown, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should pass the entity name to the dropdown', () => {
      expect(getDropdown().props('entityName')).toBe(ENTITY_NAME)
    })

    BddTest().then('it should contain the add action', () => {
      expect(getDropdown().props('actions')).toEqual([Action.ADD])
    })
  })

  BddTest().when('the add action is selected', () => {
    beforeEach(async () => {
      await getAddButton().trigger('click')
    })

    BddTest().then('it should emit add', () => {
      expect(wrapper.emitted(Action.ADD)).toHaveLength(1)
    })
  })
})
