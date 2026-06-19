import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import { EActivityThematic, EDeclaredActivityStatus, EFeedbackStatus } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { FeedbackIterationBadgeStub } from '@/features/staff/activities/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.stub'
import { FeedbackStatusBadgeStub } from '@/features/staff/activities/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.stub'
import FeedbackCard from '@/features/staff/activities/views/FeedbacksView/components/FeedbackCard/FeedbackCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockFormatLastModified = vi.fn((value: string) => `formatted-${value}`)
const mockFormatTranslatedDateTime = vi.fn((value: string) => `translated-${value}`)

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useDateUtils: () => ({
      formatLastModified: mockFormatLastModified,
      formatTranslatedDateTime: mockFormatTranslatedDateTime,
    }),
  }
})

const feedback: FeedbackStaffListItemDTO = {
  id: 'feedback-1',
  student: {
    id: 'student-1',
    email: 'camille.le@test.fr',
    firstName: 'Camille',
    lastName: 'Le',
  },
  activity: {
    id: 'declared-activity-1',
    status: EDeclaredActivityStatus.IN_PROGRESS,
    createdAt: '2025-03-15T10:00:00.000Z',
    updatedAt: '2025-03-18T14:30:00.000Z',
    activity: {
      id: 'activity-1',
      title: 'Master Biologie Marine',
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      summary: '',
      description: '',
      feedbackAllowedIterations: 3,
      enableReflection: false,
      traceAllowedAssociations: 0,
      createdAt: '2025-03-15T10:00:00.000Z',
      updatedAt: '2025-03-18T14:30:00.000Z',
    },
  },
  status: EFeedbackStatus.NEW,
  iteration: 1,
  createdAt: '2025-03-15T10:00:00.000Z',
  updatedAt: '2025-03-18T14:30:00.000Z',
}

const stubs = {
  Card: CardStub,
  FeedbackStatusBadge: FeedbackStatusBadgeStub,
  FeedbackIterationBadge: FeedbackIterationBadgeStub,
}

BddTest().given('a FeedbackCard component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof FeedbackCard>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackCard, {
        props: { feedback },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the student name', () => {
      expect(wrapper.text()).toContain('Camille Le')
    })

    BddTest().then('it should render the activity title', () => {
      expect(wrapper.text()).toContain('Master Biologie Marine')
    })

    BddTest().then('it should render the status badge', () => {
      const badge = wrapper.findComponent(FeedbackStatusBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('feedbackStatus')).toBe(EFeedbackStatus.NEW)
    })

    BddTest().then('it should render the iteration badge', () => {
      const badge = wrapper.findComponent(FeedbackIterationBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('iteration')).toBe(1)
    })

    BddTest().then('it should format createdAt', () => {
      expect(mockFormatLastModified).toHaveBeenCalledWith(feedback.createdAt!)
    })

    BddTest().then('it should format updatedAt', () => {
      expect(mockFormatTranslatedDateTime).toHaveBeenCalledWith(feedback.updatedAt!)
    })
  })
})
