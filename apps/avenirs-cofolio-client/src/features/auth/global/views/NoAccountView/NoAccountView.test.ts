import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import NoAccountView from '@/features/auth/global/views/NoAccountView/NoAccountView.vue'

const mockIdentifier = vi.hoisted(() => ({ value: undefined as string | undefined }))

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({ noAccount: { identifier: mockIdentifier.value } }),
}))

const mockWindowLocationAssign = vi.fn()

Object.defineProperty(window, 'location', {
  value: { assign: mockWindowLocationAssign },
  writable: true,
  configurable: true,
})

BddTest().given('a no account view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NoAccountView>>

  const mountDefault = (identifier?: string) => {
    vi.clearAllMocks()
    mockIdentifier.value = identifier
    wrapper = mount(NoAccountView, { global: { stubs: { AvButton: AvButtonStub } } })
  }

  BddTest().when('the identifier of the user is known', () => {
    beforeEach(() => mountDefault('lucas.tessier@university.com'))

    BddTest().then('it should display the identifier', () => {
      expect(wrapper.find('[data-testid="no-account-identifier"]').text()).toContain('lucas.tessier@university.com')
    })
  })

  BddTest().when('the identifier of the user is unknown', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should not display any identifier', () => {
      expect(wrapper.find('[data-testid="no-account-identifier"]').exists()).toBe(false)
    })
  })

  BddTest().when('clicking the logout button', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should redirect to the logout url', async () => {
      await wrapper.find('[data-testid="no-account-logout-btn"]').trigger('click')
      expect(mockWindowLocationAssign).toHaveBeenCalledWith(__AUTH_LOGOUT_URL__)
    })
  })
})
