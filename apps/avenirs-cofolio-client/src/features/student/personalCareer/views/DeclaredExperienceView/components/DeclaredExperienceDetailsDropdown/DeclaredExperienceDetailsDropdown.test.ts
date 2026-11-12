import type { VueWrapper } from '@vue/test-utils'
import type { DeclaredExperienceDetailsDropdownProps } from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ManageAssociableEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import DeclaredExperienceDetailsDropdown from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'

const stubs = {
  ManageEntityDropdown: ManageEntityDropdownStub,
  ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub
}

BddTest().given('a declared experience details dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceDetailsDropdown>>

  const elementId = 'exp-123'

  function mountDropdown (props: Partial<DeclaredExperienceDetailsDropdownProps> = {}): VueWrapper<InstanceType<typeof DeclaredExperienceDetailsDropdown>> {
    return mount(DeclaredExperienceDetailsDropdown, {
      props: {
        elementId,
        hasAssociations: true,
        ...props
      },
      global: { stubs }
    })
  }

  const getManageEntityDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAssociateDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)
  const emitDropdownActionSelected = (action: string) => getManageEntityDropdown().vm.$emit('actionSelected', action)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountDropdown()
    })

    BddTest().then('it should forward context, element id and has-associations to the associable dropdown', () => {
      const generic = getAssociateDropdown()
      expect(generic.props('contextType')).toBe(EAssociationContextType.DECLARED_EXPERIENCE)
      expect(generic.props('elementId')).toBe(elementId)
      expect(generic.props('hasAssociations')).toBe(true)
    })

    BddTest().then('the dropdown should be rendered with 4 buttons', () => {
      const dropdown = getManageEntityDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.findAll('button')).toHaveLength(4)
    })

    BddTest().then('the trigger should have the correct entity name', () => {
      const dropdown = getManageEntityDropdown()
      expect(dropdown.props('entityName')).toBe('mon expérience')
    })

    BddTest().and('the update action is selected', () => {
      beforeEach(() => {
        emitDropdownActionSelected('update')
      })

      BddTest().then('it should emit update', () => {
        expect(wrapper.emitted()).toHaveProperty('update')
      })
    })

    BddTest().and('the delete item is selected', () => {
      beforeEach(() => {
        emitDropdownActionSelected('delete')
      })

      BddTest().then('it should emit delete', () => {
        expect(wrapper.emitted()).toHaveProperty('delete')
      })

      BddTest().and('the associate action is selected', () => {
        beforeEach(() => {
          emitDropdownActionSelected('associate')
        })
        BddTest().then('it should not emit associate', () => {
          expect(wrapper.emitted()).not.toHaveProperty('associate')
        })
      })

      BddTest().and('the dissociate action is selected', () => {
        beforeEach(() => {
          emitDropdownActionSelected('dissociate')
        })

        BddTest().then('it should not emit dissociate', () => {
          expect(wrapper.emitted()).not.toHaveProperty('dissociate')
        })
      })
    })
  })
})
