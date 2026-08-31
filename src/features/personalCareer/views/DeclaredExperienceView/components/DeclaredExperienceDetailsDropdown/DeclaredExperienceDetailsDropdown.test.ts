import DeclaredExperienceDetailsDropdown
  from '@/features/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvDropdown: AvDropdownStub,
}

BddTest().given('a declared experience details dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceDetailsDropdown>>

  function mountDropdown (): VueWrapper<InstanceType<typeof DeclaredExperienceDetailsDropdown>> {
    return mount(DeclaredExperienceDetailsDropdown, { global: { stubs } })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountDropdown()
    })

    BddTest().then('the dropdown should be rendered with 3 buttons', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.findAll('button')).toHaveLength(3)
    })

    BddTest().then('the trigger should have the correct aria label and visible label', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.props('triggerAriaLabel')).toBe('Gérer mon expérience')
      expect(dropdown.props('triggerLabel')).toBe('Gérer mon expérience')
    })

    BddTest().and('the update item is selected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        await dropdown.vm.$emit('itemSelected', 'update')
      })

      BddTest().then('it should emit updateSelected', () => {
        expect(wrapper.emitted()).toHaveProperty('updateSelected')
      })
    })

    BddTest().and('the share item is selected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        await dropdown.vm.$emit('itemSelected', 'share')
      })

      BddTest().then('it should emit shareSelected', () => {
        expect(wrapper.emitted()).toHaveProperty('shareSelected')
      })
    })

    BddTest().and('the delete item is selected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        await dropdown.vm.$emit('itemSelected', 'delete')
      })

      BddTest().then('it should emit deleteSelected', () => {
        expect(wrapper.emitted()).toHaveProperty('deleteSelected')
      })
    })
  })
})
