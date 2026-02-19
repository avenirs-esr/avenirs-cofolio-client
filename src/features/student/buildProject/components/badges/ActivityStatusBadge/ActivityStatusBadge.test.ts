import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import ActivityStatusBadge from '@/features/student/buildProject/components/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import { MDI_ICONS, PH_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvBadge: AvBadgeStub
}

function mountComponent (status: EDeclaredActivityStatus) {
  return mount(ActivityStatusBadge, {
    props: { status },
    global: { stubs }
  })
}

BddTest().given('an activity status badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityStatusBadge>>

  BddTest().when('status is IN_PROGRESS', () => {
    beforeEach(() => {
      wrapper = mountComponent(EDeclaredActivityStatus.IN_PROGRESS)
    })

    BddTest().then('it should use hourglass icon', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })
      expect(badge.props('icon')).toBe(MDI_ICONS.HOURGLASS)
    })
  })

  BddTest().when('status is SUBSCRIBED', () => {
    beforeEach(() => {
      wrapper = mountComponent(EDeclaredActivityStatus.SUBSCRIBED)
    })

    BddTest().then('it should use pencil icon', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })
      expect(badge.props('icon')).toBe(PH_ICONS.NOTE_PENCIL)
    })
  })

  BddTest().when('status is COMPLETED', () => {
    beforeEach(() => {
      wrapper = mountComponent(EDeclaredActivityStatus.COMPLETED)
    })

    BddTest().then('it should use check icon', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('status is unknown', () => {
    beforeEach(() => {
      wrapper = mountComponent('UNKNOWN' as any)
    })

    BddTest().then('it should not render badge', () => {
      expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(false)
    })
  })
})
