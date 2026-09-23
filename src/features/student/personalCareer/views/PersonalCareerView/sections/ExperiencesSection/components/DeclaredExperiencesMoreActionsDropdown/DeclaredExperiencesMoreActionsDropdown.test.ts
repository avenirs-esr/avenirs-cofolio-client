import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import DeclaredExperiencesMoreActionsDropdown
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesMoreActionsDropdown/DeclaredExperiencesMoreActionsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experiences more actions dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperiencesMoreActionsDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const emitDropdownAction = (action: Action) => getDropdown().vm.$emit('actionSelected', action)

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(DeclaredExperiencesMoreActionsDropdown, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the dropdown component', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().and('the dropdown props are validated', () => {
      let dropdown: VueWrapper<InstanceType<typeof ManageEntityDropdownStub>>

      beforeEach(() => {
        dropdown = getDropdown()
      })

      BddTest().then('it should have the correct entity name', () => {
        expect(dropdown.props('entityName')).toBe('mes expériences')
      })

      BddTest().then('it should have the correct actions', () => {
        expect(dropdown.props('actions')).toHaveLength(2)
        expect(dropdown.props('actions')).toEqual(
          expect.arrayContaining([
            expect.stringContaining(Action.ADD),
            expect.stringContaining(Action.DELETE)
          ])
        )
      })
    })
  })

  BddTest().when('the add action is selected', () => {
    beforeEach(() => {
      emitDropdownAction(Action.ADD)
    })

    BddTest().then('it should emit addSelected event', () => {
      expect(wrapper.emitted('addSelected')).toBeTruthy()
      expect(wrapper.emitted('addSelected')?.[0]).toEqual([])
    })

    BddTest().then('it should not emit deleteSelected event', () => {
      expect(wrapper.emitted('deleteSelected')).toBeFalsy()
    })
  })

  BddTest().when('the delete item is selected', () => {
    beforeEach(() => {
      emitDropdownAction(Action.DELETE)
    })

    BddTest().then('it should emit deleteSelected event', () => {
      expect(wrapper.emitted('deleteSelected')).toBeTruthy()
      expect(wrapper.emitted('deleteSelected')?.[0]).toEqual([])
    })

    BddTest().then('it should not emit addSelected event', () => {
      expect(wrapper.emitted('addSelected')).toBeFalsy()
    })
  })
})
