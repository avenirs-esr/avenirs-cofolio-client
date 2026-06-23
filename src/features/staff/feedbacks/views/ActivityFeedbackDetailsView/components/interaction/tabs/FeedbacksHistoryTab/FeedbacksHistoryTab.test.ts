import FeedbacksHistoryTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistoryTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a feedback history tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksHistoryTab>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(FeedbacksHistoryTab)
    })

    BddTest().then('it should render the feedback history tab', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })
})
