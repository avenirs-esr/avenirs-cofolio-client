import { getStaffQuickLinksEnabledHandler } from '@/__mocks__/msw/handlers/staffs/user.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUserCategory } from '@/api/avenir-esr'
import NotificationsPopoverEmptyOrDisabled from '@/common/notifications/components/NotificationsPopoverEmptyOrDisabled/NotificationsPopoverEmptyOrDisabled.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a notifications popover empty or disabled', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotificationsPopoverEmptyOrDisabled>>

  const mountDefault = async (userCategory: EUserCategory, slots: Record<string, any> = {}) => {
    wrapper = mountComponent(NotificationsPopoverEmptyOrDisabled, {
      props: { userCategory },
      slots
    })
    await flushPromises()
  }

  const getNoNotifications = () => wrapper.find('[data-testid="notifications-popover-no-notifications"]')
  const getDisabled = () => wrapper.find('[data-testid="notifications-popover-disabled"]')
  const getCustomSlot = () => wrapper.find('[data-testid="custom-slot"]')

  BddTest().when('notifications disabled', () => {
    beforeEach(() => mountDefault(EUserCategory.STUDENT))

    BddTest().then('it should render disabled content', () => {
      const disabled = getDisabled()
      expect(disabled.exists()).toBe(true)
      expect(disabled.text()).toBe('Pour recevoir des notifications, veuillez activer le paramètre ci-dessous.')
    })

    BddTest().then('it should not render default slot content', () => {
      expect(getNoNotifications().exists()).toBe(false)
    })
  })

  BddTest().when('notifications enabled', () => {
    beforeEach(() => {
      server.use(getStaffQuickLinksEnabledHandler)
      return mountDefault(EUserCategory.STAFF)
    })

    BddTest().then('it should render default slot content', () => {
      const noNotifications = getNoNotifications()
      expect(noNotifications.exists()).toBe(true)
      expect(noNotifications.text()).toBe('Vous n\'avez pas de notification.')
    })

    BddTest().then('it should not render disabled content', () => {
      expect(getDisabled().exists()).toBe(false)
    })
  })

  BddTest().when('a slot is provided', () => {
    beforeEach(() => {
      server.use(getStaffQuickLinksEnabledHandler)
      return mountDefault(EUserCategory.STAFF, {
        default: '<div data-testid="custom-slot">Custom content</div>'
      })
    })

    BddTest().then('it should render the slot content', () => {
      const slot = getCustomSlot()
      expect(slot.exists()).toBe(true)
      expect(slot.text()).toBe('Custom content')
    })
  })
})
