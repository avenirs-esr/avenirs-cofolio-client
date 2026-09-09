import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import UserProfileDropdown from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a user profile dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserProfileDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub,
    ConfirmationModal: ConfirmationModalStub,
  }

  function getDropdown () {
    return wrapper.findComponent(AvDropdownStub)
  }

  beforeEach(() => {
    wrapper = mount(UserProfileDropdown, {
      props: {
        username: 'J. Moulin',
        actions: [
          { name: 'manage-profile', label: 'Gérer mon profil', icon: 'pencil' },
          { name: 'see-calendar', label: 'Voir mon agenda', icon: 'calendar' },
        ],
      },
      global: { stubs },
    })
  })

  BddTest().when('the dropdown is rendered', () => {
    BddTest().then('it should pass the username as dropdown trigger label', () => {
      expect(getDropdown().props('triggerLabel')).toBe('J. Moulin')
    })

    BddTest().then('it should pass provided actions and logout action to the dropdown', () => {
      const items = getDropdown().props('items') as Array<{ name: string, label: string }>

      expect(items).toEqual([
        expect.objectContaining({ name: 'manage-profile', label: 'Gérer mon profil' }),
        expect.objectContaining({ name: 'see-calendar', label: 'Voir mon agenda' }),
        expect.objectContaining({ name: 'logout-button', label: 'Me déconnecter' }),
      ])
    })
  })

  BddTest().when('a profile action is selected', () => {
    BddTest().then('it should emit the selected action name', async () => {
      await getDropdown().vm.$emit('itemSelected', 'manage-profile')

      expect(wrapper.emitted('actionSelected')).toEqual([['manage-profile']])
    })
  })

  BddTest().when('the logout item is selected', () => {
    BddTest().then('it should display the confirmation modal', async () => {
      await getDropdown().vm.$emit('itemSelected', 'logout-button')

      expect(wrapper.findComponent(ConfirmationModalStub).props('opened')).toBe(true)

      expect(wrapper.emitted('actionSelected')).toBeUndefined()
    })
  })
})
