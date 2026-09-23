import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import DeclaredExperienceDetailsDropdown
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  ManageEntityDropdown: ManageEntityDropdownStub,
}

BddTest().given('a declared experience details dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceDetailsDropdown>>

  function mountDropdown (): VueWrapper<InstanceType<typeof DeclaredExperienceDetailsDropdown>> {
    return mount(DeclaredExperienceDetailsDropdown, { global: { stubs } })
  }

  const getManageEntityDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const emitDropdownActionSelected = (action: string) => getManageEntityDropdown().vm.$emit('actionSelected', action)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountDropdown()
    })

    BddTest().then('the dropdown should be rendered with 2 buttons', () => {
      const dropdown = getManageEntityDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.findAll('button')).toHaveLength(2)
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
    })
  })
})
