import LoginView from '@/features/auth/global/views/LoginView/LoginView.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const mockQuery = ref<Record<string, unknown>>({})

vi.mock('vue-router', () => ({
  useRoute: () => ({
    get query () {
      return mockQuery.value
    },
  }),
}))

const mockWindowLocationAssign = vi.fn()

Object.defineProperty(window, 'location', {
  value: { assign: mockWindowLocationAssign },
  writable: true,
  configurable: true,
})

BddTest().given('a login view', () => {
  let wrapper: VueWrapper<InstanceType<typeof LoginView>>

  const stubs = {
    AvButton: AvButtonStub,
  }

  const mountDefault = async ({ query = {} }: { query?: Record<string, unknown> } = {}) => {
    vi.clearAllMocks()
    mockQuery.value = query
    wrapper = mount(LoginView, { global: { stubs } })
  }

  beforeEach(() => mountDefault())

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the login button', () => {
      const loginButton = wrapper.find('[data-testid="login-btn"]')
      expect(loginButton.exists()).toBe(true)
    })

    BddTest().then('it should render the sign up button', () => {
      const signUpButton = wrapper.find('[data-testid="sign-up-btn"]')
      expect(signUpButton.exists()).toBe(true)
    })
  })

  BddTest().when('clicking the login button without a redirect query param', () => {
    BddTest().then('it should redirect to auth login url with the encoded default redirect path', async () => {
      const loginButton = wrapper.find('[data-testid="login-btn"]')
      await loginButton.trigger('click')

      expect(mockWindowLocationAssign).toHaveBeenCalledOnce()
      expect(mockWindowLocationAssign).toHaveBeenCalledWith(expect.stringContaining(`${__AUTH_LOGIN_URL__}?redirect=${encodeURIComponent(`${import.meta.env.BASE_URL}/student/home`)}`))
    })
  })

  BddTest().when('clicking the login button with a redirect query param', () => {
    beforeEach(() => mountDefault({ query: { redirect: '/current-route' } }))

    BddTest().then('it should redirect to auth login url with encoded redirect query param', async () => {
      const loginButton = wrapper.find('[data-testid="login-btn"]')
      await loginButton.trigger('click')

      expect(mockWindowLocationAssign).toHaveBeenCalledOnce()
      expect(mockWindowLocationAssign).toHaveBeenCalledWith(expect.stringContaining(`${__AUTH_LOGIN_URL__}?redirect=${encodeURIComponent(`/cofolio/current-route`)}`))
    })
  })
})
