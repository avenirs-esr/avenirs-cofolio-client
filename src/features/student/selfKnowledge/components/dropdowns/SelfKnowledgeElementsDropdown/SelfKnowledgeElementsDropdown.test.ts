import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import SelfKnowledgeElementsDropdown from '@/features/student/selfKnowledge/components/dropdowns/SelfKnowledgeElementsDropdown/SelfKnowledgeElementsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  ManageEntityDropdown: ManageEntityDropdownStub,
}

BddTest().given('a self knowledge elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementsDropdown>>

  function mountDropdown (): VueWrapper<InstanceType<typeof SelfKnowledgeElementsDropdown>> {
    return mount(SelfKnowledgeElementsDropdown, { global: { stubs } })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const emitDropdownAdd = () => getDropdown().vm.$emit('actionSelected', 'add')
  const emitDropdownDelete = () => getDropdown().vm.$emit('actionSelected', 'delete')

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountDropdown()
    })

    BddTest().and('the add action is selected', () => {
      beforeEach(() => {
        emitDropdownAdd()
      })

      BddTest().then('it should emit the add event', () => {
        expect(wrapper.emitted()).toHaveProperty('add')
      })
    })

    BddTest().and('the delete item is selected', () => {
      beforeEach(() => {
        emitDropdownDelete()
      })

      BddTest().then('it should emit the delete event', () => {
        expect(wrapper.emitted()).toHaveProperty('delete')
      })
    })
  })
})
