import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { expect } from 'vitest'
import { ROUTES } from '@/common/constants'
import FeedbackTitle from '@/features/staff/feedbacks/views/FeedbacksView/components/base/FeedbackTitle/FeedbackTitle.vue'

const mockFeedback = {
  id: 'feedback-1',
  title: 'Test Feedback Title',
}

BddTest().given('a feedback title', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackTitle>>

  const stubs = { AvTooltip: AvTooltipStub, RouterLink: RouterLinkStub }

  const mountWith = async (withNav: boolean) => wrapper = await mountWithRouter<typeof FeedbackTitle>(FeedbackTitle, {
    props: { feedback: mockFeedback, withNav },
    global: { stubs },
  })

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getTitleContent = () => wrapper.get('[data-testid="feedback-title-content"]')
  const getContainer = () => wrapper.get('[data-testid="feedback-title"]')

  BddTest().when('the component is rendered with nav activated', () => {
    beforeEach(async () => {
      await mountWith(true)
    })

    BddTest().then('it should display the feedback title', () => {
      expect(getTitleContent().text()).toBe(mockFeedback.title)
    })

    BddTest().then('it should expose the group id on the container and link', () => {
      expect(getContainer().attributes('data-group-id')).toBe(mockFeedback.id)
      expect(getTitleContent().attributes('data-group-id')).toBe(mockFeedback.id)
    })

    BddTest().then('it should link to the feedback detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ACTIVITY_FEEDBACK.name,
        params: { feedbackId: mockFeedback.id }
      })
    })

    BddTest().then('it should pass the access tooltip content', () => {
      expect(getAvTooltip().props('content')).toBe('Accéder au feedback')
    })
  })

  BddTest().when('the component is rendered without nav activated', () => {
    beforeEach(async () => {
      await mountWith(false)
    })

    BddTest().then('it should display the feedback title', () => {
      expect(getTitleContent().text()).toBe(mockFeedback.title)
    })

    BddTest().then('it should not render the router link', () => {
      expect(getRouterLink().exists()).toBe(false)
    })
  })
})
