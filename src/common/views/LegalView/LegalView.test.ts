import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import LegalView from '@/common/views/LegalView/LegalView.vue'
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

BddTest().given('a legal view', () => {
  let wrapper: VueWrapper<InstanceType<typeof LegalView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = () => {
    wrapper = mount(LegalView, { global: { stubs } })
  }

  const title = 'Mentions légales'
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
        meta: { breadcrumb: [{ textKey: 'global.views.legalView.title' }] }
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
