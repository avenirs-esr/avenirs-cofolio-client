import { UserProfileDropdownStub } from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.stub'
import StudentProfileDropdown from '@/features/student/user/components/overlays/StudentProfileDropdown/StudentProfileDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student profile dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProfileDropdown>>

  beforeEach(() => {
    wrapper = mount(StudentProfileDropdown, {
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
