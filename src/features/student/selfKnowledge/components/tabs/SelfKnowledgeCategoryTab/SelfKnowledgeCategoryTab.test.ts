import type { VueWrapper } from '@vue/test-utils'
import SelfKnowledgeCategoryTab
  from '@/features/student/selfKnowledge/components/tabs/SelfKnowledgeCategoryTab/SelfKnowledgeCategoryTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a self knowledge category tab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeCategoryTab>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeCategoryTab)
    })

    BddTest().then('it should mount properly', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })
})
