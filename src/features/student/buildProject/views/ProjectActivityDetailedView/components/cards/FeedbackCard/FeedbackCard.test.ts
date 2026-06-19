import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ICONS } from '@/common/constants'
import FeedbackCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackCard/FeedbackCard.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const feedback: FeedbackOverviewDTO = {
  id: 'feedback-1',
  staff: {
    id: 'staff-1',
    email: 'perceval@test.fr',
    firstName: 'Marc',
    lastName: 'Perceval',
  },
  student: {
    id: 'student-1',
    email: 'student@test.fr',
    firstName: 'Alice',
    lastName: 'Martin',
  },
  feedback: 'Il faudrait que vous puissiez citer vos références méthodologiques.',
  status: EFeedbackStatus.NEW,
  createdAt: '2025-05-05T10:00:00.000Z',
  updatedAt: '2025-05-05T10:00:00.000Z',
}

const stubs = {
  Card: CardStub,
  AvIconText: AvIconTextStub,
}

BddTest().given('a FeedbackCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackCard>>

  BddTest().when('the component is mounted with a full feedback', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackCard, {
        props: { feedback },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card with gray background and no border', () => {
      const card = wrapper.findComponent(CardStub)

      expect(card.exists()).toBe(true)
      expect(card.props('backgroundColor')).toBe('var(--surface-background)')
      expect(card.props('titleBackground')).toBe('var(--surface-background)')
      expect(card.props('borderColor')).toBe('transparent')
    })

    BddTest().then('it should render the title with the feedback icon and date in dd/MM/yyyy format', () => {
      const title = wrapper.findComponent(AvIconTextStub)

      expect(title.exists()).toBe(true)
      expect(title.props('icon')).toBe(ICONS.FEEDBACK)
      expect(title.props('text')).toContain('05/05/2025')
    })

    BddTest().then('it should render the staff name with role in the body', () => {
      expect(wrapper.find('[data-testid="feedback-card-staff"]').text()).toBe('M. Perceval (Enseignant)')
    })

    BddTest().then('it should render the feedback content in the body', () => {
      expect(wrapper.find('[data-testid="feedback-card-content"]').text()).toBe(feedback.feedback)
    })
  })

  BddTest().when('the component is mounted without feedback content', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackCard, {
        props: { feedback: { ...feedback, feedback: undefined } },
        global: { stubs },
      })
    })

    BddTest().then('it should not render the feedback content element', () => {
      expect(wrapper.find('[data-testid="feedback-card-content"]').exists()).toBe(false)
    })
  })
})
