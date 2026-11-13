import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { ManageAssociableEntityDropdownStub } from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import DeclaredSkillSettingDropdown from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.vue'

BddTest().given('a declared skill setting dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillSettingDropdown>>

  const declaredSkillId = 'declared-skill-1'

  const stubs = {
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub
  }

  const getDropdown = () => wrapper.findComponent({ name: 'ManageAssociableEntityDropdown' })

  beforeEach(() => {
    wrapper = mount(DeclaredSkillSettingDropdown, {
      props: {
        declaredSkillId
      },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the associable entity dropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should pass the declared skill identifier', () => {
      expect(getDropdown().props('elementId')).toBe(declaredSkillId)
    })

    BddTest().then('it should pass the declared skill association context', () => {
      expect(getDropdown().props('contextType')).toBe(EAssociationContextType.DECLARED_SKILL)
    })

    BddTest().then('it should pass the entity name', () => {
      expect(getDropdown().props('entityName')).toBeTruthy()
    })

    BddTest().then('it should pass update and delete actions', () => {
      expect(getDropdown().props('actions')).toEqual([
        Action.UPDATE,
        Action.DELETE
      ])
    })

    BddTest().then('it should not pass association or dissociation interactive props', () => {
      expect(getDropdown().props('associationInteractiveProps')).toEqual({})
      expect(getDropdown().props('dissociationInteractiveProps')).toEqual({})
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
