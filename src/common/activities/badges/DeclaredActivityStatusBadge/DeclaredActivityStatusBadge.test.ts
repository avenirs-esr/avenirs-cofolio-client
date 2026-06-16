import type { DeclaredActivityStatusBadgeProps } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { MDI_ICONS, PH_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a declared activity status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredActivityStatusBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{ props: DeclaredActivityStatusBadgeProps, label: string, icon: string, color: string, backgroundColor: string }> = [
    { props: { status: EDeclaredActivityStatus.COMPLETED }, label: 'Terminée', icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE, color: 'var(--text1)', backgroundColor: 'var(--light-background-neutral)' },
    { props: { status: EDeclaredActivityStatus.IN_PROGRESS }, label: 'En cours', icon: MDI_ICONS.HOURGLASS, color: 'var(--dark-background-primary1)', backgroundColor: 'var(--light-background-primary2)' },
    { props: { status: EDeclaredActivityStatus.SUBMITTED }, label: 'Soumis', icon: MDI_ICONS.DOTS_HORIZONTAL_CIRCLE_OUTLINE, color: 'var(--light-foreground-primary1)', backgroundColor: 'var(--light-background-critical)' },
    { props: { status: EDeclaredActivityStatus.SUBSCRIBED }, label: 'Inscrit(e)', icon: PH_ICONS.NOTE_PENCIL, color: 'var(--card)', backgroundColor: 'var(--dark-background-primary3)' },
  ]

  scenario.forEach(({ props, label, icon, color, backgroundColor }) => {
    BddTest().when(`the badge is rendered with status ${props.status}`, () => {
      beforeEach(() => {
        wrapper = mount(DeclaredActivityStatusBadge, { props, global: { stubs } })
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

      BddTest().then('it should render the badge with correct color', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('color')).toBe(color)
      })

      BddTest().then('it should render the badge with correct background color', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('backgroundColor')).toBe(backgroundColor)
      })

      BddTest().then('it should render the badge with data status', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.attributes('data-status')).toBe(props.status)
      })

      BddTest().then('it should render the badge small', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.props('small')).toBe(true)
      })
    })
  })
})
