import type { VueWrapper } from '@vue/test-utils'
import type { AssessmentStatusBadgeProps } from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { EActivityAssessmentStatus } from '@/api/avenir-esr'
import AssessmentStatusBadge from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.vue'

BddTest().given('an assessment status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentStatusBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{
    props: AssessmentStatusBadgeProps
    label: string
    icon: string
  }> = [
    { props: { assessmentStatus: EActivityAssessmentStatus.NEW }, label: 'Nouvelle', icon: MDI_ICONS.BELL_NOTIFICATION },
    { props: { assessmentStatus: EActivityAssessmentStatus.OPENED }, label: 'Non traitée', icon: MDI_ICONS.BELL_NOTIFICATION },
    { props: { assessmentStatus: EActivityAssessmentStatus.SENT }, label: 'Envoyée', icon: MDI_ICONS.CHECK_CIRCLE },
  ]

  scenario.forEach(({ props, label, icon }) => {
    BddTest().when(`the badge is rendered with status ${props.assessmentStatus}`, () => {
      beforeEach(() => {
        wrapper = mount(AssessmentStatusBadge, {
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
