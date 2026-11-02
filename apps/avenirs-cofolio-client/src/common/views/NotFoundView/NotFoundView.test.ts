import type { VueWrapper } from '@vue/test-utils'
import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { EUniverse, EUserCategory } from '@/api/avenir-esr'
import NotFoundView from '@/common/views/NotFoundView/NotFoundView.vue'
import { UNIVERSE_USER_CATEGORY } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session.constants'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'

const BUTTON_LABEL = 'Retour à l\'accueil'
const CONTENT = 'La page que vous recherchez n\'existe pas ou plus.'
const TITLE = '404 - Page introuvable'

vi.mock('@/router', () => ({
  default: {
    replace: vi.fn(),
    currentRoute: { value: { fullPath: '/current-route' } }
  }
}))

vi.mock('@/store', () => ({
  useToasterStore: () => ({
    addErrorMessage: vi.fn()
  })
}))

function universesOf (category: EUserCategory) {
  return Object.values(EUniverse).filter(universe => UNIVERSE_USER_CATEGORY[universe] === category)
}

BddTest().given('a not found view displayed to a logged-in user', () => {
  let wrapper: VueWrapper
  let currentUser: ReturnType<typeof useCurrentUser>
  let unmountSession: () => void

  const mountWith = (user: Partial<LoggedInUserDTO> = {}) => {
    const mounted = mountComposable(() => {
      useAuthStore().$patch({ session: { ...mockedLoggedInUser, ...user } })
      currentUser = useCurrentUser()
    }, {
      usePinia: true,
      useTanstack: true,
      useI18n: true
    })

    unmountSession = mounted.unmount

    wrapper = mountComponent(NotFoundView, {
      global: { stubs: { AvButton: AvButtonStub } }
    }, {
      usePinia: false
    })
  }

  const getButton = () => wrapper.findComponent(AvButtonStub)
  const getTitle = () => wrapper.find('h3')
  const getContent = () => wrapper.find('p')

  afterEach(() => {
    wrapper.unmount()
    unmountSession()
  })

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the correct title, description and button label', () => {
      expect(getTitle().text()).toBe(TITLE)
      expect(getContent().text()).toBe(CONTENT)
      expect(getButton().text()).toBe(BUTTON_LABEL)
    })
  })

  for (const category of Object.values(EUserCategory)) {
    BddTest().when(`the view is mounted for a user of the ${category} category`, () => {
      beforeEach(() => {
        mountWith({ universes: universesOf(category) })
      })

      BddTest().then('it should link the button to the home route returned by useCurrentUser', () => {
        expect(currentUser.profile.activeCategory.value).toBe(category)
        expect(getButton().props('to')).toEqual(currentUser.homeRoute.value)
      })
    })
  }
})
