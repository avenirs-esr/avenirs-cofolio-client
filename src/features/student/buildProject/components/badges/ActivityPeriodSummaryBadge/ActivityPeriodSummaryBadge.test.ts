import ActivityPeriodSummaryBadge, { type ActivityPeriodSummaryBadgeProps } from '@/features/student/buildProject/components/badges/ActivityPeriodSummaryBadge/ActivityPeriodSummaryBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an activity period summary badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPeriodSummaryBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenarios: Array<{ props: ActivityPeriodSummaryBadgeProps }> = [
    { props: { summary: 'À réaliser en amont' } },
    { props: { summary: 'Pendant le parcours' } },
    { props: { summary: 'À finaliser après projet', small: true } },
  ]

  scenarios.forEach(({ props }) => {
    BddTest().when(`the badge is rendered with summary "${props.summary}"`, () => {
      beforeEach(() => {
        wrapper = mount(ActivityPeriodSummaryBadge, { props, global: { stubs } })
      })

      BddTest().then('it should render the badge component', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)
      })

      BddTest().then('it should render the correct summary label', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('label')).toBe(props.summary)
      })

      BddTest().then('it should pass the small prop if provided', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('small')).toBe(props.small ?? false)
      })
    })
  })
})
