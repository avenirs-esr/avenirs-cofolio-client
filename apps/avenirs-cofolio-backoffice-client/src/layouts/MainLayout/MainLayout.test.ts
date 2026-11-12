import type { VueWrapper } from '@vue/test-utils'
import { AvHeaderStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QuerySuspenseStub, SkipLinksStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { ROUTES } from '@/constants'
import MainLayout from '@/layouts/MainLayout/MainLayout.vue'

const selectLanguageMock = vi.fn()
const mockQuickLinks = {
  data: ref({ firstname: 'martin', lastname: 'dupont' }),
  isPending: ref(false),
  error: ref(null)
}

vi.mock('@avenirs-esr/shared/api/avenir-esr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/shared/api/avenir-esr')>()
  return {
    ...actual,
    useGetQuickLinks: () => mockQuickLinks
  }
})

vi.mock('@avenirs-esr/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/shared')>()
  return {
    ...actual,
    useBaseApiExceptionToast: vi.fn(),
    useLanguageSwitcher: () => ({
      languageSelector: ref([]),
      selectLanguage: selectLanguageMock
    }),
  }
})

BddTest().given('a main layout', () => {
  let wrapper: VueWrapper<InstanceType<typeof MainLayout>>

  const stubs = {
    AvHeader: AvHeaderStub,
    MainNavigation: {
      name: 'MainNavigation',
      template: '<nav data-testid="navigation">Navigation</nav>'
    },
    RouterView: {
      name: 'RouterView',
      template: '<div data-testid="router-view" />'
    },
    QuerySuspense: QuerySuspenseStub,
    SkipLinks: SkipLinksStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the layout is rendered', () => {
    beforeEach(() => {
      wrapper = mountComponent(MainLayout, { global: { stubs } })
    })

    BddTest().then('it should render header and navigation', () => {
      expect(wrapper.findComponent(AvHeaderStub).exists()).toBe(true)
      expect(wrapper.find('[data-testid="navigation"]').exists()).toBe(true)
    })

    BddTest().then('it should pass the home route to the header', () => {
      expect(wrapper.findComponent(AvHeaderStub).props('homeTo')).toEqual(ROUTES.HOME)
    })

    BddTest().then('it should render the user name in the quick links', () => {
      expect(wrapper.find('[data-testid="profile-button"]').text()).toBe('M. Dupont')
    })

    BddTest().then('it should render the SkipLinks component', () => {
      expect(wrapper.findComponent(SkipLinksStub).exists()).toBe(true)
    })

    BddTest().then('it should render the router view', () => {
      expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true)
    })
  })

  BddTest().when('AvHeader emits language-select', () => {
    beforeEach(async () => {
      wrapper = mountComponent(MainLayout, { global: { stubs } })
      wrapper.findComponent(AvHeaderStub).vm.$emit('language-select', 'en')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should call selectLanguage from useLanguageSwitcher', () => {
      expect(selectLanguageMock).toHaveBeenCalledWith('en')
    })
  })
})
