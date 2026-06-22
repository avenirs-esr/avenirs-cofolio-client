import WriteFeedbackTab from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a write feedback tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof WriteFeedbackTab>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(WriteFeedbackTab)
    })

    BddTest().then('it should render the write feedback tab', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })
})
