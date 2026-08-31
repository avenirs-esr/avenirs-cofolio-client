import type { ActivityThematicBadgeProps } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { EActivityThematic } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ICONS } from '@/common/constants'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an activity thematic badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityThematicBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{ props: ActivityThematicBadgeProps, label: string, icon: string }> = [
    { props: { thematic: EActivityThematic.EXPERIENCES }, label: 'Mes expériences', icon: ICONS.EXPERIENCES },
    { props: { thematic: EActivityThematic.FUTURE_PLANS }, label: 'Explorer mes futurs', icon: ICONS.FUTURES },
    { props: { thematic: EActivityThematic.PROGRAMS }, label: 'Mes formations', icon: ICONS.PROGRAMS },
    { props: { thematic: EActivityThematic.RESUMES }, label: 'CV', icon: ICONS.RESUMES },
    { props: { thematic: EActivityThematic.SELF_KNOWLEDGE }, label: 'Me connaître', icon: ICONS.SELF_KNOWLEDGE },
    { props: { thematic: EActivityThematic.TRAJECTORIES }, label: 'Mes trajectoires', icon: ICONS.TRAJECTORIES },
    { props: { thematic: EActivityThematic.TRANSVERSAL }, label: 'Transverse', icon: ICONS.TRANSVERSAL },
  ]

  scenario.forEach(({ props, label, icon }) => {
    BddTest().when(`the badge is rendered with thematic ${props.thematic}`, () => {
      beforeEach(() => {
        wrapper = mount(ActivityThematicBadge, { props, global: { stubs } })
      })

      BddTest().then('it should render the badge', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)
      })

      BddTest().then('it should render the badge label', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('label')).toBe(label)
      })

      BddTest().then('it should render the badge icon', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('icon')).toBe(icon)
      })
    })
  })
})
