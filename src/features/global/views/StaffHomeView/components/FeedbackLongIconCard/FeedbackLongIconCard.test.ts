import { allFeedbacks } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { LongIconCardStub } from '@/common/components/cards/LongIconCard/LongIconCard.stub'
import { formatDateLocalized } from '@/common/utils/date/date'
import FeedbackLongIconCard from '@/features/global/views/StaffHomeView/components/FeedbackLongIconCard/FeedbackLongIconCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('a feedback long icon card', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackLongIconCard>>

  const props = { feedback: allFeedbacks[0] }

  const stubs = { LongIconCard: LongIconCardStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(FeedbackLongIconCard, {
        props,
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the LongIconCard component', () => {
      const longIconCard = wrapper.findComponent({ name: 'LongIconCard' })
      expect(longIconCard.exists()).toBe(true)
    })

    BddTest().then('it should render the trace title as LongIconCard title', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('title')).toBe(`Activité "${props.feedback.activity?.title}"`)
    })

    BddTest().then('it should render the feedback student name', () => {
      const description = wrapper.find('[data-testid="feedback-description"]')
      expect(description.text()).toContain(`${props.feedback.student?.firstName} ${props.feedback.student?.lastName}`)
    })

    BddTest().then('it should render the feedback creation date', () => {
      const description = wrapper.find('[data-testid="feedback-description"]')
      expect(description.text()).toContain(formatDateLocalized(props.feedback.createdAt!, 'fr', true))
    })
  })
})
