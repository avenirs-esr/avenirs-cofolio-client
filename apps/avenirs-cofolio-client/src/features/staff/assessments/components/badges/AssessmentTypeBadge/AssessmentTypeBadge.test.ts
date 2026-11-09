import type { VueWrapper } from '@vue/test-utils'
import type { ActivityTypeBadgeProps } from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EActivityAssessmentType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import AssessmentTypeBadge from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.vue'

BddTest().given('an assessment type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentTypeBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{
    props: ActivityTypeBadgeProps
    label: string
  }> = [
    { props: { assessmentType: EActivityAssessmentType.COMMENT }, label: 'Appréciation' },
    { props: { assessmentType: EActivityAssessmentType.VALIDATION }, label: 'Vérification' },
    { props: { assessmentType: EActivityAssessmentType.GRADE }, label: 'Notée' }
  ]

  scenario.forEach(({ props, label }) => {
    BddTest().when(`the badge is rendered with activity type ${props.assessmentType}`, () => {
      beforeEach(() => {
        wrapper = mount(AssessmentTypeBadge, {
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

      BddTest().then('it should render with the correct data-type attribute', () => {
        expect(wrapper.find('[data-testid="activity-type-badge"]').attributes('data-type')).toBe(props.assessmentType)
      })
    })
  })
})
