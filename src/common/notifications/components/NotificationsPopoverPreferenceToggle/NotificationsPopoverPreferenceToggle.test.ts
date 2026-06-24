import type { VueWrapper } from '@vue/test-utils'
import { EUserCategory } from '@/api/avenir-esr'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub.js'
import NotificationsPopoverPreferenceToggle from '@/common/notifications/components/NotificationsPopoverPreferenceToggle/NotificationsPopoverPreferenceToggle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils.js'
import { beforeEach, expect } from 'vitest'

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
    BddTest().then('it reflects server value (unchecked)', async () => {
      expect(getCheckbox().attributes('checked') === undefined).toBe(true)
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
