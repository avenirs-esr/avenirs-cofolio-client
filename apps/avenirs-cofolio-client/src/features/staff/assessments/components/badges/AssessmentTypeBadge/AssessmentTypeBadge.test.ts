import type { VueWrapper } from '@vue/test-utils'
import type { ActivityTypeBadgeProps } from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import AssessmentTypeBadge from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.vue'

BddTest().given('an assessment type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentTypeBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{
    props: ActivityTypeBadgeProps
    label: string
  }> = [
    { props: { activityType: 'default' }, label: 'Appréciation de l\'activité' },
  ]

  scenario.forEach(({ props, label }) => {
    BddTest().when(`the badge is rendered with activity type ${props.activityType}`, () => {
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
        expect(wrapper.find('[data-testid="activity-type-badge"]').attributes('data-type')).toBe(props.activityType)
      })
    })
  })
})
