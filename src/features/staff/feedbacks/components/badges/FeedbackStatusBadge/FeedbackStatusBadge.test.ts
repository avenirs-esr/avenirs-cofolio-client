import type { FeedbackStatusBadgeProps } from '@/features/staff/feedbacks/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.vue'
import { EFeedbackStatus } from '@/api/avenir-esr'
import FeedbackStatusBadge from '@/features/staff/feedbacks/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a feedback status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackStatusBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{
    props: FeedbackStatusBadgeProps
    label: string
    icon: string
  }> = [
    { props: { feedbackStatus: EFeedbackStatus.NEW }, label: 'Nouveau', icon: MDI_ICONS.BELL_NOTIFICATION },
    { props: { feedbackStatus: EFeedbackStatus.IN_PROCESS }, label: 'non traité', icon: MDI_ICONS.BELL_NOTIFICATION },
    { props: { feedbackStatus: EFeedbackStatus.SUBMITTED }, label: 'Envoyé', icon: MDI_ICONS.CHECK_CIRCLE }
  ]

  scenario.forEach(({ props, label, icon }) => {
    BddTest().when(`the badge is rendered with status ${props.feedbackStatus}`, () => {
      beforeEach(() => {
        wrapper = mount(FeedbackStatusBadge, {
          props,
          global: { stubs }
        })
      })

      BddTest().then('it should render the badge', () => {
        expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(true)
      })

      BddTest().then('it should render the badge label', () => {
        expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe(label)
      })

      BddTest().then('it should render the badge icon', () => {
        expect(wrapper.findComponent(AvBadgeStub).props('icon')).toBe(icon)
      })
    })
  })
})
