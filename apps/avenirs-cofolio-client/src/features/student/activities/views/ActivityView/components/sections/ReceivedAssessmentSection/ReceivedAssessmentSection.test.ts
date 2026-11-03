import type { VueWrapper } from '@vue/test-utils'
import type { ReceivedAssessmentDTO } from '@/api/avenir-esr'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { CardStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import { ICONS } from '@/common/constants'
import ReceivedAssessmentSection from '@/features/student/activities/views/ActivityView/components/sections/ReceivedAssessmentSection/ReceivedAssessmentSection.vue'

const requestedAssessment: ReceivedAssessmentDTO = {
  requestedAt: '2025-05-20T10:00:00.000Z',
}

const sentAssessment: ReceivedAssessmentDTO = {
  grade: 16,
  maxGrade: 20,
  comment: 'Très bien.\nBonne évolution sur les sous-activités.',
  requestedAt: '2025-05-20T10:00:00.000Z',
  sentAt: '2025-05-25T10:00:00.000Z',
  assessedBy: {
    id: 'staff-1',
    email: 'perceval@test.fr',
    firstName: 'Marc',
    lastName: 'Perceval',
  },
}

const stubs = {
  Card: CardStub,
  AvCard: AvCardStub,
  AvIconText: AvIconTextStub,
  AvBadge: AvBadgeStub,
}

BddTest().given('a ReceivedAssessmentSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ReceivedAssessmentSection>>

  const getGradeBadge = () => wrapper.findComponent('[data-testid="received-assessment-card-grade"]') as VueWrapper<InstanceType<typeof AvBadgeStub>>
  const getValidationBadge = () => wrapper.findComponent('[data-testid="received-assessment-card-validation"]') as VueWrapper<InstanceType<typeof AvBadgeStub>>

  BddTest().when('the activity has not been submitted for assessment', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: undefined },
        global: { stubs },
      })
    })

    BddTest().then('it should render the section title', () => {
      expect(wrapper.find('[data-testid="received-assessment-section-title"]').text()).toBe('Mon appréciation')
    })

    BddTest().then('it should tell the activity has not been submitted for assessment yet', () => {
      expect(wrapper.find('[data-testid="received-assessment-section-status"]').text()).toBe('Votre activité n\'a pas encore été soumise pour évaluation.')
    })

    BddTest().then('it should not render the assessment card', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(false)
    })
  })

  BddTest().when('the assessment exists without request date', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: {} },
        global: { stubs },
      })
    })

    BddTest().then('it should tell the activity has not been submitted for assessment yet', () => {
      expect(wrapper.find('[data-testid="received-assessment-section-status"]').text()).toBe('Votre activité n\'a pas encore été soumise pour évaluation.')
    })
  })

  BddTest().when('the activity has been submitted and awaits its assessment', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: requestedAssessment },
        global: { stubs },
      })
    })

    BddTest().then('it should tell the submission date and that the assessment is pending', () => {
      expect(wrapper.find('[data-testid="received-assessment-section-status"]').text()).toBe('Votre activité a été soumise pour évaluation le 20/05/2025. Elle est en attente d\'évaluation.')
    })

    BddTest().then('it should not render the assessment card', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(false)
    })
  })

  BddTest().when('the assessment has been sent with a grade and a comment', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: sentAssessment },
        global: { stubs },
      })
    })

    BddTest().then('it should not render the status message', () => {
      expect(wrapper.find('[data-testid="received-assessment-section-status"]').exists()).toBe(false)
    })

    BddTest().then('it should render the card with gray background and no border', () => {
      const card = wrapper.findComponent(CardStub)

      expect(card.exists()).toBe(true)
      expect(card.props('backgroundColor')).toBe('var(--surface-background)')
      expect(card.props('titleBackground')).toBe('var(--surface-background)')
      expect(card.props('borderColor')).toBe('transparent')
    })

    BddTest().then('it should render the title with the assessment icon and the sent date in dd/MM/yyyy format', () => {
      const title = wrapper.findComponent(AvIconTextStub)

      expect(title.props('icon')).toBe(ICONS.ASSESSMENT)
      expect(title.props('text')).toBe('Appréciation reçue le 25/05/2025')
    })

    BddTest().then('it should render the assessor first and last name', () => {
      expect(wrapper.find('[data-testid="received-assessment-card-assessor"]').text()).toBe('Marc Perceval')
    })

    BddTest().then('it should render the grade over the grading scale', () => {
      expect(getGradeBadge().props('label')).toBe('16\u00A0/\u00A020')
    })

    BddTest().then('it should not render the validation', () => {
      expect(getValidationBadge().exists()).toBe(false)
    })

    BddTest().then('it should render the comment', () => {
      expect(wrapper.find('[data-testid="received-assessment-card-comment"]').text()).toBe(sentAssessment.comment)
    })
  })

  BddTest().when('the assessment has been sent with a zero grade', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: { ...sentAssessment, grade: 0 } },
        global: { stubs },
      })
    })

    BddTest().then('it should still render the grade', () => {
      expect(getGradeBadge().props('label')).toBe('0\u00A0/\u00A020')
    })
  })

  BddTest().when('the assessment has been sent as validated', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: { ...sentAssessment, grade: undefined, maxGrade: undefined, validation: true } },
        global: { stubs },
      })
    })

    BddTest().then('it should render the validated badge in success colors', () => {
      const badge = getValidationBadge()

      expect(badge.props('label')).toBe('Validée')
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE_OUTLINE)
      expect(badge.props('color')).toBe('var(--light-foreground-success)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
    })

    BddTest().then('it should not render the grade', () => {
      expect(getGradeBadge().exists()).toBe(false)
    })

    BddTest().then('it should render the comment', () => {
      expect(wrapper.find('[data-testid="received-assessment-card-comment"]').text()).toBe(sentAssessment.comment)
    })
  })

  BddTest().when('the assessment has been sent as not validated', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: { ...sentAssessment, grade: undefined, maxGrade: undefined, validation: false } },
        global: { stubs },
      })
    })

    BddTest().then('it should render the not validated badge in error colors', () => {
      const badge = getValidationBadge()

      expect(badge.props('label')).toBe('Non validée')
      expect(badge.props('icon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(badge.props('color')).toBe('var(--light-foreground-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
    })
  })

  BddTest().when('the assessment has been sent with both a grade and a validation', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: { ...sentAssessment, validation: true } },
        global: { stubs },
      })
    })

    BddTest().then('it should render both the grade and the validation', () => {
      expect(getGradeBadge().props('label')).toBe('16\u00A0/\u00A020')
      expect(getValidationBadge().props('label')).toBe('Validée')
    })
  })

  BddTest().when('the assessment has been sent without grade, validation nor comment', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedAssessmentSection, {
        props: { assessment: { ...sentAssessment, grade: undefined, maxGrade: undefined, comment: undefined } },
        global: { stubs },
      })
    })

    BddTest().then('it should not render any badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the comment', () => {
      expect(wrapper.find('[data-testid="received-assessment-card-comment"]').exists()).toBe(false)
    })
  })
})
