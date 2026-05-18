import type { ActivityStatusBadgeProps } from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import { EActivityStatus } from '@/api/avenir-esr'
import ActivityStatusBadge from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an activity status badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityStatusBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const scenario: Array<{ props: ActivityStatusBadgeProps, label: string, icon: string }> = [
    { props: { status: EActivityStatus.DRAFT }, label: 'non publiée', icon: MDI_ICONS.TEXT_BOX_EDIT_OUTLINE },
    { props: { status: EActivityStatus.PUBLISHED }, label: 'publiée', icon: MDI_ICONS.TEXT_BOX_CHECK_OUTLINE },
  ]

  scenario.forEach(({ props, label, icon }) => {
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
    })
  })
})
