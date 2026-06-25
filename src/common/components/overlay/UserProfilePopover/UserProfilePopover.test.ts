import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import UserProfilePopover from '@/common/components/overlay/UserProfilePopover/UserProfilePopover.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a user profile popover', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvButton: AvButtonStub,
    AvPopover: {
      name: 'AvPopover',
      template: `
        <div>
          <slot name="trigger" :toggle="() => {}"></slot>
          <slot name="popover"></slot>
        </div>
      `,
    },
    ConfirmationModal: ConfirmationModalStub,
  }

  beforeEach(() => {
    wrapper = mount(UserProfilePopover, {
      props: {
        username: 'J. Moulin',
        actions: [
          { label: 'Gérer mon profil', icon: 'pencil' },
          { label: 'Voir mon agenda', icon: 'calendar' },
        ],
      },
      global: { stubs },
    })
  })

  BddTest().when('the popover is rendered', () => {
    BddTest().then('it should render the username as trigger button label', () => {
      expect(wrapper.text()).toContain('J. Moulin')
    })

    BddTest().then('it should render provided actions', () => {
      expect(wrapper.text()).toContain('Gérer mon profil')
      expect(wrapper.text()).toContain('Voir mon agenda')
    })

    BddTest().then('it should render the logout button', () => {
      expect(wrapper.text()).toContain('Me déconnecter')
    })
  })

  BddTest().when('the logout button is clicked', () => {
    BddTest().then('it should display the confirmation modal', async () => {
      await wrapper
        .findAllComponents({ name: 'AvButton' })
        .find(button => button.text() === 'Me déconnecter')
        ?.trigger('click')

      expect(wrapper.findComponent({ name: 'ConfirmationModal' }).props('show')).toBe(true)
    })
  })
})
