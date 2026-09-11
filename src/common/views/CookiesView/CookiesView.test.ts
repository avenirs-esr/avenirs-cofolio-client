import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { useRoute } from 'vue-router'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

const mockedUseRoute = vi.mocked(useRoute)

BddTest().given('a cookies view', () => {
  let wrapper: VueWrapper<InstanceType<typeof CookiesView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = () => {
    wrapper = mount(CookiesView, { global: { stubs } })
  }

  const title = 'Gestion des cookies'
  const defaultBreadcrumbLinks = [{ text: title }]

  BddTest().when('the route has no breadcrumb meta', () => {
    beforeEach(() => {
      mockedUseRoute.mockReturnValue({ meta: {} } as ReturnType<typeof useRoute>)
      mountDefault()
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(defaultBreadcrumbLinks)
    })
  })

  BddTest().when('the route has breadcrumb meta', () => {
    beforeEach(() => {
      mockedUseRoute.mockReturnValue({
        meta: { breadcrumb: [{ textKey: 'global.views.cookiesView.title' }] }
      } as ReturnType<typeof useRoute>)
      mountDefault()
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([{ text: title }, ...defaultBreadcrumbLinks])
    })
  })
})
