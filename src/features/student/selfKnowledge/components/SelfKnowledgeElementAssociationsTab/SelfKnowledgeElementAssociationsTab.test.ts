import type { VueWrapper } from '@vue/test-utils'
import SelfKnowledgeElementAssociationsTab
  from '@/features/student/selfKnowledge/components/SelfKnowledgeElementAssociationsTab/SelfKnowledgeElementAssociationsTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a self knowledge element associations tab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementAssociationsTab>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementAssociationsTab)
    })

    BddTest().then('it should display the placeholder text', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Mes associations (Placeholder...)')
    })
  })
})
