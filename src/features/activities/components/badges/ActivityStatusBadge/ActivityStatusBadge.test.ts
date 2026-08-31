import type { ActivityStatusBadgeProps } from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import { EActivityStatus } from '@/api/avenir-esr'
import ActivityStatusBadge from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an activity status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityStatusBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{ props: ActivityStatusBadgeProps, label: string, icon: string, color: string, backgroundColor: string }> = [
    { props: { status: EActivityStatus.DRAFT }, label: 'brouillon', icon: MDI_ICONS.TEXT_BOX_EDIT_OUTLINE, color: 'var(--text1)', backgroundColor: 'var(--surface-background)' },
    { props: { status: EActivityStatus.PUBLISHED }, label: 'publiée', icon: MDI_ICONS.TEXT_BOX_CHECK_OUTLINE, color: 'var(--dark-background-success)', backgroundColor: 'var(--light-background-success)' },
    { props: { status: EActivityStatus.UNPUBLISHED }, label: 'dépubliée', icon: MDI_ICONS.TEXT_BOX_CHECK_OUTLINE, color: 'var(--dark-background-warn)', backgroundColor: 'var(--light-background-warn)' },
  ]

  scenario.forEach(({ props, label, icon, color, backgroundColor }) => {
    BddTest().when(`the badge is rendered with status ${props.status}`, () => {
      beforeEach(() => {
        wrapper = mount(ActivityStatusBadge, { props, global: { stubs } })
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

      BddTest().then('it should render the badge colors', () => {
        const badge = wrapper.findComponent(AvBadgeStub)

        expect(badge.props('color')).toBe(color)
        expect(badge.props('backgroundColor')).toBe(backgroundColor)
      })
    })
  })
})
