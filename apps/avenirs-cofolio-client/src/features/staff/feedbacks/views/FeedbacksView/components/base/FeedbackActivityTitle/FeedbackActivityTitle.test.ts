import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import FeedbackActivityTitle from '@/features/staff/feedbacks/views/FeedbacksView/components/base/FeedbackActivityTitle/FeedbackActivityTitle.vue'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useTextTruncation: () => ({
      isTruncated: mockIsTruncated,
    }),
  }
})

const mockFeedback = {
  id: 'feedback-1',
  status: EFeedbackStatus.NEW,
}

const mockActivity = {
  id: 'activity-1',
  title: 'Test Activity Title',
}

BddTest().given('a feedback activity title', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackActivityTitle>>

  const stubs = { AvTooltip: AvTooltipStub, RouterLink: RouterLinkStub }

  const mountWith = async (withNav: boolean) => wrapper = await mountWithRouter<typeof FeedbackActivityTitle>(FeedbackActivityTitle, {
    props: { feedback: mockFeedback, activity: mockActivity, withNav },
    global: { stubs },
  })

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getTitleContent = () => wrapper.get('[data-testid="feedback-title-content"]')
  const getContainer = () => wrapper.get('[data-testid="feedback-title"]')

  beforeEach(() => {
    mockIsTruncated.value = false
  })

  BddTest().when('the component is rendered with nav activated', () => {
    beforeEach(async () => {
      await mountWith(true)
    })

    BddTest().then('it should display the feedback title', () => {
      expect(getTitleContent().text()).toBe(mockActivity.title)
    })

    BddTest().then('it should expose the feedback id, activity id, and status on the container and link', () => {
      expect(getContainer().attributes('data-feedback-id')).toBe(mockFeedback.id)
      expect(getContainer().attributes('data-activity-id')).toBe(mockActivity.id)
      expect(getContainer().attributes('data-feedback-status')).toBe(mockFeedback.status)
      expect(getTitleContent().attributes('data-feedback-id')).toBe(mockFeedback.id)
      expect(getTitleContent().attributes('data-activity-id')).toBe(mockActivity.id)
      expect(getTitleContent().attributes('data-feedback-status')).toBe(mockFeedback.status)
    })

    BddTest().then('it should link to the feedback detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
        params: { feedbackId: mockFeedback.id }
      })
    })

    BddTest().then('it should pass the feedback activity title as tooltip content', () => {
      expect(getAvTooltip().props('content')).toBe(mockActivity.title)
    })

    BddTest().then('it should disable the tooltip when the title is not truncated', () => {
      expect(getAvTooltip().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the component is rendered without nav activated', () => {
    beforeEach(async () => {
      await mountWith(false)
    })

    BddTest().then('it should display the feedback title', () => {
      expect(getTitleContent().text()).toBe(mockActivity.title)
    })

    BddTest().then('it should not render the router link', () => {
      expect(getRouterLink().exists()).toBe(false)
    })
  })

  BddTest().when('the feedback activity title is truncated', () => {
    beforeEach(async () => {
      mockIsTruncated.value = true
      await mountWith(true)
    })

    BddTest().then('it should enable the tooltip', () => {
      expect(getAvTooltip().props('disabled')).toBe(false)
    })
  })
})
