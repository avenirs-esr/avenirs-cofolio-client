import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a manage declared program dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageDeclaredProgramDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getActionButton = (action: Action) => wrapper.find(`[data-testid="${action}"]`)

  beforeEach(() => {
    wrapper = mount(ManageDeclaredProgramDropdown, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with two actions', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(2)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      expect(getDropdown().props('entityName')).toBe('ma formation')
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the updateSelected event', async () => {
      await getActionButton(Action.UPDATE).trigger('click')
      expect(wrapper.emitted('updateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the deleteSelected event', async () => {
      await getActionButton(Action.DELETE).trigger('click')
      expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
    })
  })
})
