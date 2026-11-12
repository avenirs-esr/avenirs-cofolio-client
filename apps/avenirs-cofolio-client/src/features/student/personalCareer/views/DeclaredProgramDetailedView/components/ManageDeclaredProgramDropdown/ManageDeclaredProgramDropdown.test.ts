import type { VueWrapper } from '@vue/test-utils'
import type { ManageDeclaredProgramDropdownProps } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ManageAssociableEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'

BddTest().given('a manage declared program dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageDeclaredProgramDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub
  }

  const elementId = 'declared-program-1'

  function mountDropdown (props: Partial<ManageDeclaredProgramDropdownProps> = {}) {
    return mount(ManageDeclaredProgramDropdown, {
      props: {
        elementId,
        hasAssociations: true,
        ...props
      },
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getActionButton = (action: Action) => wrapper.find(`[data-testid="${action}"]`)
  const getAssociateDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)
  beforeEach(() => {
    wrapper = mountDropdown()
  })

  BddTest().then('it should forward context, element id and has-associations to the associable dropdown', () => {
    const generic = getAssociateDropdown()
    expect(generic.props('contextType')).toBe(EAssociationContextType.DECLARED_PROGRAM)
    expect(generic.props('elementId')).toBe(elementId)
    expect(generic.props('hasAssociations')).toBe(true)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with two actions', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(4)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      expect(getDropdown().props('entityName')).toBe('ma formation')
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the update event', async () => {
      await getActionButton(Action.UPDATE).trigger('click')
      expect(wrapper.emitted('update')).toHaveLength(1)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the delete event', async () => {
      await getActionButton(Action.DELETE).trigger('click')
      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })
})
