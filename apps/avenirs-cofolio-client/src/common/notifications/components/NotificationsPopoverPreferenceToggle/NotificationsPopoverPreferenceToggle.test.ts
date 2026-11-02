import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EUserCategory } from '@/api/avenir-esr'
import { ToggleStub } from '@/common/components/interaction/toggles/Toggle/Toggle.stub'
import NotificationsPopoverPreferenceToggle from '@/common/notifications/components/NotificationsPopoverPreferenceToggle/NotificationsPopoverPreferenceToggle.vue'

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({ addErrorMessage: mockAddErrorMessage }),
  }
})

BddTest().given('a notifications popover preference toggle', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotificationsPopoverPreferenceToggle>>

  const stubs = { Toggle: ToggleStub }

  const mountDefault = () => {
    wrapper = mountComponent(NotificationsPopoverPreferenceToggle, {
      props: { userCategory: EUserCategory.STUDENT },
      global: { stubs },
    })
  }

  const getCheckbox = () => wrapper.findComponent(ToggleStub).find('input[type="checkbox"]')

  beforeEach(async () => {
    mountDefault()
    await flushPromises()
  })

  BddTest().when('component is mounted', () => {
    BddTest().then('it reflects server value (checked)', async () => {
      expect(getCheckbox().attributes('checked') === undefined).toBe(false)
    })
  })

  BddTest().when('toggle is changed successfully', () => {
    beforeEach(async () => {
      await getCheckbox().setValue(false)
      await flushPromises()
    })

    BddTest().then('it updates state without error', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })
})
