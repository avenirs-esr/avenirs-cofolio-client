import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { ManageAssociableEntityDropdownStub } from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'

BddTest().given('a manage declared program dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageDeclaredProgramDropdown>>

  const declaredProgramId = 'declared-program-1'

  const stubs = {
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub,
  }

  const getDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)
  const getActionButton = (action: Action) => wrapper.find(`[data-testid="${action}"]`)

  beforeEach(() => {
    wrapper = mount(ManageDeclaredProgramDropdown, {
      props: { declaredProgramId },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render ManageAssociableEntityDropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should pass the declared program identifier', () => {
      expect(getDropdown().props('elementId')).toBe(declaredProgramId)
    })

    BddTest().then('it should pass the declared program association context', () => {
      expect(getDropdown().props('contextType')).toBe(EAssociationContextType.DECLARED_PROGRAM)
    })

    BddTest().then('it should pass the entity name', () => {
      expect(getDropdown().props('entityName')).toBe('ma formation')
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
      await getActionButton(Action.UPDATE).trigger('click')

      expect(wrapper.emitted('update')).toHaveLength(1)
    })
  })

  BddTest().when('the delete action is selected', () => {
    BddTest().then('it should emit the delete event', async () => {
      await getActionButton(Action.DELETE).trigger('click')

      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })
})
