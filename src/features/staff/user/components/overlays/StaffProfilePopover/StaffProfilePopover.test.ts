import { UserProfilePopoverStub } from '@/common/components/overlay/UserProfilePopover/UserProfilePopover.stub'
import StaffProfilePopover from '@/features/staff/user/components/overlays/StaffProfilePopover/StaffProfilePopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff profile popover', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(StaffProfilePopover, {
      props: { username: 'J. Moulin' },
      global: {
        stubs: {
          UserProfilePopover: UserProfilePopoverStub,
        },
      },
    })
  })

  BddTest().when('the popover is rendered', () => {
    BddTest().then('it should render the shared user profile popover', () => {
      expect(wrapper.findComponent(UserProfilePopoverStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the username to the shared user profile popover', () => {
      expect(wrapper.findComponent(UserProfilePopoverStub).props('username')).toBe('J. Moulin')
    })
  })
})
