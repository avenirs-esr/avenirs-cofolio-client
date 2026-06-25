import { UserProfilePopoverStub } from '@/common/components/overlay/UserProfilePopover/UserProfilePopover.stub'
import StudentProfilePopover from '@/features/student/user/components/overlays/StudentProfilePopover/StudentProfilePopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student profile popover', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(StudentProfilePopover, {
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

    BddTest().then('it should pass all student profile actions', () => {
      const actions = wrapper.findComponent(UserProfilePopoverStub).props('actions') as Array<{ label: string }>

      expect(actions.map(action => action.label)).toEqual([
        'Gérer mon profil',
        'Voir mon agenda',
        'Aller sur mon ENT',
        'Aller sur le passeport de compétences',
      ])
    })
  })
})
