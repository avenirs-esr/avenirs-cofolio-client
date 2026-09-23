import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import SelfKnowledgeElementDetailsDropdown from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  ManageEntityDropdown: ManageEntityDropdownStub,
}

BddTest().given('a self knowledge elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementDetailsDropdown>>

  function mountDropdown (): VueWrapper<InstanceType<typeof SelfKnowledgeElementDetailsDropdown>> {
    return mount(SelfKnowledgeElementDetailsDropdown, { global: { stubs } })
  }

  const getManageEntityDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const emitDropdownAction = (action: Action) => getManageEntityDropdown().vm.$emit('actionSelected', action)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountDropdown()
    })

    BddTest().then('the dropdown should be rendered', () => {
      const dropdown = getManageEntityDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.findAll('button')).toHaveLength(2)
      expect(dropdown.props('entityName')).toBe('mon élément')
    })

    BddTest().and('the update action is selected', () => {
      beforeEach(() => {
        emitDropdownAction(Action.UPDATE)
      })

      BddTest().then('it should emit the update event', () => {
        expect(wrapper.emitted()).toHaveProperty('update')
      })
    })

    BddTest().and('the delete action is selected', () => {
      beforeEach(() => {
        emitDropdownAction(Action.DELETE)
      })

      BddTest().then('it should emit the delete event', () => {
        expect(wrapper.emitted()).toHaveProperty('delete')
      })
    })
  })
})
