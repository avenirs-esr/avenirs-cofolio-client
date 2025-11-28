import SelfKnowledgeElementDetailsDropdown from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvDropdown: AvDropdownStub,
}

BddTest().given('a self knowledge elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementDetailsDropdown>>

  function mountDropdown (): VueWrapper<InstanceType<typeof SelfKnowledgeElementDetailsDropdown>> {
    return mount(SelfKnowledgeElementDetailsDropdown, { global: { stubs } })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountDropdown()
    })

    BddTest().then('the dropdown should be rendered', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.findAll('button')).toHaveLength(3)
      expect(dropdown.props('triggerAriaLabel')).toBe('Gérer mon élément')
      expect(dropdown.props('triggerLabel')).toBe('Gérer mon élément')
    })

    BddTest().and('the update item is selected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        await dropdown.vm.$emit('itemSelected', 'update')
      })

      BddTest().then('it should emit the updateSelected event', () => {
        expect(wrapper.emitted()).toHaveProperty('updateSelected')
      })
    })

    BddTest().and('the share item is selected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        await dropdown.vm.$emit('itemSelected', 'share')
      })

      BddTest().then('it should emit the shareSelected event', () => {
        expect(wrapper.emitted()).toHaveProperty('shareSelected')
      })
    })

    BddTest().and('the delete item is selected', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(AvDropdownStub)
        await dropdown.vm.$emit('itemSelected', 'delete')
      })

      BddTest().then('it should emit the deleteSelected event', () => {
        expect(wrapper.emitted()).toHaveProperty('deleteSelected')
      })
    })
  })
})
