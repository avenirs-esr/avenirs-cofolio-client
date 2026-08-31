import { UserProfileDropdownStub } from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.stub'
import StaffProfileDropdown from '@/features/user/components/overlays/StaffProfileDropdown/StaffProfileDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff profile dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffProfileDropdown>>

  beforeEach(() => {
    wrapper = mount(StaffProfileDropdown, {
      props: { username: 'J. Moulin' },
      global: {
        stubs: {
          UserProfileDropdown: UserProfileDropdownStub,
        },
      },
    })
  })

  BddTest().when('the dropdown is rendered', () => {
    BddTest().then('it should render the shared user profile dropdown', () => {
      expect(wrapper.findComponent(UserProfileDropdownStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the username to the shared user profile dropdown', () => {
      expect(wrapper.findComponent(UserProfileDropdownStub).props('username')).toBe('J. Moulin')
    })
  })
})
