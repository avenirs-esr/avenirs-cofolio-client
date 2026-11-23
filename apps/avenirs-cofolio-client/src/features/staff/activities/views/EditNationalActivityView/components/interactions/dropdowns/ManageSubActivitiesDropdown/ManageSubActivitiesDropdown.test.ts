import type { ActionItem } from '@avenirs-esr/shared'
import type { VueWrapper } from '@vue/test-utils'
import type { ManageSubActivitiesDropdownProps } from '@/features/staff/activities/views/EditNationalActivityView/components/interactions/dropdowns/ManageSubActivitiesDropdown/ManageSubActivitiesDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { Action, ManageEntityDropdownStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import ManageSubActivitiesDropdown from '@/features/staff/activities/views/EditNationalActivityView/components/interactions/dropdowns/ManageSubActivitiesDropdown/ManageSubActivitiesDropdown.vue'

const ENTITY_NAME = 'les sous-activités'
const DELETE_EMPTY_TOOLTIP = 'Aucune sous-activité à supprimer'
const DELETE_ENROLLED_STUDENT_TOOLTIP = 'Les sous-activités ne peuvent plus être supprimées car des apprenant(e)s sont inscrit(e)s à cette activité'

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
  const getDeleteButton = () => wrapper.find(`[data-testid="${Action.DELETE}"]`)
  const getDeleteAction = () => (getDropdown().props('actions') as (Action | ActionItem)[])
    .find(action => typeof action !== 'string' && action.type === Action.DELETE) as ActionItem

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should pass the entity name to the dropdown', () => {
      expect(getDropdown().props('entityName')).toBe(ENTITY_NAME)
    })

    BddTest().then('it should contain the add and delete actions', () => {
      expect(getDropdown().props('actions')).toEqual([Action.ADD, expect.objectContaining({ type: Action.DELETE })])
    })

    BddTest().then('it should disable the delete action, as there is no sub-activity', () => {
      expect(getDeleteAction().disabled).toBe(true)
      expect(getDeleteAction().disabledTooltip).toBe(DELETE_EMPTY_TOOLTIP)
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

  BddTest().when('the activity has sub-activities', () => {
    beforeEach(() => {
      mountWith({
        hasSubActivities: true
      })
    })

    BddTest().then('it should enable the delete action', () => {
      expect(getDeleteAction().disabled).toBe(false)
    })

    BddTest().and('the delete action is selected', () => {
      beforeEach(async () => {
        await getDeleteButton().trigger('click')
      })

      BddTest().then('it should emit delete', () => {
        expect(wrapper.emitted(Action.DELETE)).toHaveLength(1)
      })
    })
  })

  BddTest().when('students are enrolled in the activity', () => {
    beforeEach(() => {
      mountWith({
        hasSubActivities: true,
        hasEnrolledStudent: true
      })
    })

    BddTest().then('it should disable the delete action, with the enrolled students tooltip', () => {
      expect(getDeleteAction().disabled).toBe(true)
      expect(getDeleteAction().disabledTooltip).toBe(DELETE_ENROLLED_STUDENT_TOOLTIP)
    })

    BddTest().then('it should keep the add action available', () => {
      expect(getAddButton().attributes('disabled')).toBeUndefined()
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
