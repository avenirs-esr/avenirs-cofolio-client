import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { ManageAssociableEntityDropdownStub } from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import DeclaredExperienceDetailsDropdown from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'

BddTest().given('a declared experience details dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceDetailsDropdown>>

  const declaredExperienceId = 'declared-experience-1'

  const stubs = {
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub,
  }

  beforeEach(() => {
    wrapper = mount(DeclaredExperienceDetailsDropdown, {
      props: { declaredExperienceId },
      global: { stubs },
    })
  })

  const getDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render ManageAssociableEntityDropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should pass the declared experience identifier', () => {
      expect(getDropdown().props('elementId')).toBe(declaredExperienceId)
    })

    BddTest().then('it should pass the declared experience association context', () => {
      expect(getDropdown().props('contextType')).toBe(EAssociationContextType.DECLARED_EXPERIENCE)
    })

    BddTest().then('it should pass the entity name', () => {
      expect(getDropdown().props('entityName')).toBe('mon expérience')
    })

    BddTest().then('it should pass update and delete actions', () => {
      expect(getDropdown().props('actions')).toEqual([
        Action.UPDATE,
        Action.DELETE,
      ])
    })
  })

  BddTest().when('the update action is selected', () => {
    BddTest().then('it should emit the update event', async () => {
      await getDropdown().find(`[data-testid="${Action.UPDATE}"]`).trigger('click')

      expect(wrapper.emitted('update')).toHaveLength(1)
    })
  })

  BddTest().when('the delete action is selected', () => {
    BddTest().then('it should emit the delete event', async () => {
      await getDropdown().find(`[data-testid="${Action.DELETE}"]`).trigger('click')

      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })
})
